import os
import json
from openai import OpenAI
from google import genai

# Environment Configuration
ENABLE_BEDROCK = os.environ.get("ENABLE_BEDROCK", "true").lower() == "true"
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

RESUME_CONTEXT = """
You are Harry's digital twin, a Principal Engineer based in Bengaluru with deep expertise in AWS, Python, and .NET Core. 
Answer questions strictly based on Harry's professional experience, architecture principles, and technical background. Be direct, authoritative, and precise.
"""

def query_agentcore_bedrock(prompt):
    if not ENABLE_BEDROCK:
        raise Exception("Bedrock AgentCore is disabled via feature flag.")
    
    from strands import Agent
    agent = Agent(
        model="us.anthropic.claude-3-5-sonnet-20241022-v2:0",
        system_prompt=RESUME_CONTEXT
    )
    response = agent.run(prompt)
    return str(response)

def query_openai(prompt):
    if not openai_client:
        raise Exception("OpenAI API key not configured.")
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": RESUME_CONTEXT},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def query_gemini(prompt):
    if not gemini_client:
        raise Exception("Gemini API key not configured.")
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"{RESUME_CONTEXT}\n\nUser Question: {prompt}"
    )
    return response.text

def handler(event, context):
    try:
        # Gracefully handle both API Gateway / Function URL and direct AWS Console tests
        if "body" in event:
            body = json.loads(event["body"]) if isinstance(event["body"], str) else event["body"]
        else:
            body = event

        prompt = body.get("prompt")
        if not prompt:
            return {"statusCode": 400, "body": json.dumps({"error": "Prompt is required."})}
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps({"error": f"Invalid JSON body format: {str(e)}"})}

    answer = None
    source_used = None

    # 1. Try Primary: Bedrock AgentCore / Strands Execution
    try:
        answer = query_agentcore_bedrock(prompt)
        source_used = "bedrock-agentcore"
    except Exception as bedrock_err:
        print(f"Bedrock AgentCore bypassed/failed ({bedrock_err}). Falling back to OpenAI...")
        
        # 2. Fallback 1: OpenAI Subscription API
        try:
            answer = query_openai(prompt)
            source_used = "openai-fallback"
        except Exception as openai_err:
            print(f"OpenAI failed ({openai_err}). Falling back to Gemini...")
            
            # 3. Fallback 2: Gemini API
            try:
                answer = query_gemini(prompt)
                source_used = "gemini-fallback"
            except Exception as gemini_err:
                return {
                    "statusCode": 500,
                    "body": json.dumps({
                        "error": "All AI inference providers failed.",
                        "details": {"bedrock": str(bedrock_err), "openai": str(openai_err), "gemini": str(gemini_err)}
                    })
                }

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(answer)
    }
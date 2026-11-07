terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "aws_profile" {
  type    = string
  default = "digital-twin-dev"
}

variable "enable_bedrock" {
  type        = bool
  description = "Feature flag: Set to false to bypass Bedrock and trigger OpenAI/Gemini fallbacks instantly"
  default     = true
}

variable "openai_api_key" {
  type      = string
  sensitive = true
}

variable "gemini_api_key" {
  type      = string
  sensitive = true
}

# --- IAM ROLE FOR LAMBDA ---
resource "aws_iam_role" "lambda_exec" {
  name = "digital_twin_agentcore_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Conditional Bedrock Model Permissions (Only attached if Bedrock is enabled)
resource "aws_iam_role_policy" "lambda_bedrock_policy" {
  count = var.enable_bedrock ? 1 : 0
  role  = aws_iam_role.lambda_exec.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"]
      Resource = "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-*"
    }]
  })
}

# --- LAMBDA FUNCTION ---
resource "aws_lambda_function" "twin_backend" {
  filename      = "lambda_payload.zip"
  function_name = "digital-twin-agentcore-backend"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.handler"
  runtime       = "python3.11"
  timeout       = 30
  source_code_hash = filebase64sha256("lambda_payload.zip")

  environment {
    variables = {
      ENABLE_BEDROCK = tostring(var.enable_bedrock)
      OPENAI_API_KEY = var.openai_api_key
      GEMINI_API_KEY = var.gemini_api_key
    }
  }
}

resource "aws_lambda_function_url" "url" {
  function_name      = aws_lambda_function.twin_backend.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    max_age           = 86400
  }
}

output "lambda_url" {
  value = aws_lambda_function_url.url.function_url
}
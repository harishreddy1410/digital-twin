import './globals.css';

export const metadata = {
  title: 'Harish Munireddy | Digital Twin',
  description: 'AI-Powered Digital Twin & Principal Cloud Engineer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Forces Tailwind CSS loading instantly across all browsers */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased overflow-hidden m-0 p-0">
        {children}
      </body>
    </html>
  );
}
import './globals.css';

export const metadata = {
  title: 'SE2026 Palembang Operational Monitor',
  description: 'Real-time aggregated compliance tracking for field operations (by @adityalfareza)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
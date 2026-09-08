import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hieloのblog',
  description: 'Hielo 的个人博客，记录生活，也记录偶尔出现的想法。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

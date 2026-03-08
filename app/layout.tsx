import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StoryWeaver - 记忆编织',
  description: '用AI编织你的记忆故事',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-serif min-h-screen">{children}</body>
    </html>
  )
}
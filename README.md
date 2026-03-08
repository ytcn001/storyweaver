# StoryWeaver

一个用 AI 编织记忆故事的 Next.js 14 应用。

## 功能特性

- 首页：分享一段 100 字以内的真实记忆
- AI 访谈：AI 逐条提问，有打字机效果
- 故事生成：左右分栏显示原始记忆和 AI 生成的 800 字短篇故事

## 技术栈

- Next.js 14 App Router
- TypeScript
- Tailwind CSS

## 环境要求

- Node.js 18.x 或更高版本
- npm, yarn, pnpm 或 bun

## 安装 Node.js

### macOS
```bash
# 使用 Homebrew 安装
brew install node

# 或者从官网下载安装包
# 访问 https://nodejs.org/
```

### Windows/Linux
访问 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

## 快速开始

```bash
# 进入项目目录
cd /Users/bytedance/Documents/trae_projects/storyweaver

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
storyweaver/
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   ├── interview/
│   │   └── page.tsx         # 访谈页
│   └── result/
│       └── page.tsx         # 结果页
├── components/
│   └── Typewriter.tsx       # 打字机效果组件
└── ...配置文件
```
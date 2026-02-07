---
created: 2026-02-07T09:59
modified: 2026-02-07T09:59
---
# Poster Wall Generator

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-Plugin-blue?style=for-the-badge&logo=obsidian" alt="Obsidian Plugin">
  <img src="https://img.shields.io/badge/Vue.js-3.x-42b883?style=for-the-badge&logo=vue.js" alt="Vue 3">
  <img src="https://img.shields.io/badge/TypeScript-4.7-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript">
</p>

一款 **Obsidian 插件**，可自动扫描文件夹中的图片并生成一个具有 **赛博朋克风格** 的交互式海报墙照片库。

---

## ✨ 功能特色

- 🎴 **自动扫描** - 自动识别文件夹中的所有图片（jpg/jpeg/png/webp/gif）
- 🎨 **赛博朋克美学** - 霓虹发光效果、故障风格动画、网格背景
- 🖱️ **拖拽排序** - 编辑模式下支持自由拖拽调整海报顺序
- 🔗 **链接绑定** - 可为每张海报添加跳转链接（如豆瓣、B站等）
- ⚙️ **实时调节** - 卡片宽度、间距、圆角等参数实时可调
- 💾 **本地持久化** - 自定义排序和链接自动保存到 LocalStorage
- 📤 **一键导出** - 可导出为完整的独立 HTML 文件

---

## 📦 安装

### 手动安装

1. 下载本插件文件夹
2. 将文件夹复制到 Obsidian Vault 的 `.obsidian/plugins/` 目录下
3. 重启 Obsidian
4. 在 `设置 → 第三方插件` 中启用 **Poster Wall Generator**

### 开发环境安装

```bash
# 克隆到插件目录
cd <your-vault>/.obsidian/plugins

# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建生产版本
npm run build
```

---

## 🚀 使用方法

### 方式一：命令面板

1. 打开包含图片的文件夹中的任意文件
2. 按下 `Ctrl/Cmd + P` 打开命令面板
3. 搜索并执行 `Generate Poster Wall for Current Folder`

### 方式二：右键菜单

1. 在文件管理器中右键点击目标文件夹
2. 选择 **Generate Poster Wall**

执行后，插件会在该文件夹下生成 `poster-wall.html` 文件。

---

## ⚙️ 插件设置

在 `设置 → Poster Wall Generator` 中可配置：

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| Wall Title | 海报墙标题（支持故障动画） | `MY COLLECTION` |
| Description | 副标题描述 | `WATCHED MEDIA LOG` |
| Avatar URL | 头部头像图片 URL | DiceBear 随机头像 |
| Card Width | 卡片默认宽度 | `180px` |
| Spacing (Gap) | 卡片间距 | `16px` |
| Corner Radius | 卡片圆角 | `8px` |
| Show Titles | 默认显示标题 | `true` |
| Edit Mode | 默认启用编辑模式 | `false` |

---

## 🎮 海报墙交互

生成的 HTML 页面支持以下交互：

| 操作 | 说明 |
|------|------|
| **点击卡片** | 若绑定了链接，则跳转到对应页面 |
| **悬停卡片** | 显示标题和播放按钮（如有链接） |
| **齿轮按钮** | 打开/关闭控制面板 |
| **编辑模式** | 启用后可拖拽排序、编辑标题、添加链接 |
| **EXPORT.HTML** | 导出当前状态的完整 HTML 文件 |
| **SYSTEM.RESET** | 重置所有设置和自定义数据 |

---

## 🛠️ 技术栈

- **运行时**: [Vue 3](https://vuejs.org/) (CDN)
- **拖拽库**: [SortableJS](https://sortablejs.github.io/Sortable/)
- **字体**: [Orbitron](https://fonts.google.com/specimen/Orbitron) + [Rajdhani](https://fonts.google.com/specimen/Rajdhani)
- **图标**: [Font Awesome 6](https://fontawesome.com/)
- **构建工具**: [esbuild](https://esbuild.github.io/)

---

## 📁 项目结构

```
poster-wall-plugin/
├── main.ts            # 插件主入口 + HTML 模板
├── manifest.json      # Obsidian 插件清单
├── package.json       # NPM 配置
├── esbuild.config.mjs # 构建配置
├── tsconfig.json      # TypeScript 配置
└── main.js            # 编译产物
```

---

## 📄 License

[MIT License](LICENSE) © 2024

---

> 🌃 *"In the neon glow, every poster tells a story."*

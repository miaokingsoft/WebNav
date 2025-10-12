# Personal Web Navigator (个人网站导航器)

这是一个简单易用的个人网站导航页面，支持添加、删除和管理常用的网站链接。

[English Version](README_EN.md)

## 功能特点

- 简洁美观的响应式界面
- 支持网站分类管理
- 添加和删除网站链接
- 编辑网站信息
- 鼠标悬停显示操作按钮
- 新增网址自动隐藏动画效果
- 数据持久化存储在 `data.json` 文件中
- 支持网站卡片自定义背景色
- 拖动排序功能

## 技术栈

- 前端：HTML, CSS, JavaScript (原生实现，无框架依赖)
- 后端：Node.js + Express 或 Vercel Serverless Functions
- 数据存储：JSON文件

## 目录结构

```
.
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 前端JavaScript逻辑
├── server.js           # 本地Node.js服务器
├── api/
│   └── save.js         # Vercel Serverless Function
├── data.json           # 网站数据存储文件
├── package.json        # 项目依赖配置
└── vercel.json         # Vercel部署配置
```

## 使用说明

### 网站管理
1. 点击右下角的"+"按钮打开添加网站模态框
2. 选择分类，填写网站名称和链接
3. 点击"添加网站"按钮添加网站
4. 鼠标悬停在网站卡片右上角区域显示编辑和删除按钮
5. 点击"编辑"按钮可修改网站信息和背景色
6. 点击"删除"按钮可删除对应网站
7. 鼠标悬停在网站卡片左上角区域可拖动排序

### 数据存储
所有数据会自动保存到 `data.json` 文件中

## 注意事项

- 数据保存在项目根目录的 `data.json` 文件中
- 请确保服务器有写入文件的权限
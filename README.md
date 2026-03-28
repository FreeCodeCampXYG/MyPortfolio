# Portfolio Blog - 个人作品展示博客

一个简洁优雅的个人作品展示博客，纯前端实现，无需服务器和数据库。

## 功能特性

- **作品展示** - 网格布局展示所有作品，支持响应式设计
- **作品管理** - 添加、编辑、删除作品
- **密码保护** - 管理页面需要密码登录
- **本地存储** - 使用 localStorage 持久化数据
- **深色主题** - 现代深色卡片式设计
- **零依赖** - 纯原生 HTML/CSS/JavaScript 实现

## 快速开始

### 方式一：直接打开

双击 `index.html` 文件即可在浏览器中查看效果。

### 方式二：本地服务器

```bash
# 使用 Python
python -m http.server 5500

# 或使用 Node.js
npx serve
```

然后访问 http://localhost:5500

## 使用说明

### 查看作品

访问 `index.html` 即可浏览所有已发布的作品，点击作品卡片可跳转到项目链接。

### 管理作品

1. 访问 `admin.html` 或点击导航栏的「管理」
2. 输入密码登录（默认密码：`admin123`）
3. 添加、编辑或删除作品

### 作品字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| 标题 | 是 | 作品名称，最多 100 字符 |
| 描述 | 否 | 作品简介，最多 500 字符 |
| 链接 | 否 | 作品跳转链接，需为有效 URL |
| 封面图片 | 否 | 图片 URL，建议 16:9 比例 |

## 项目结构

```
portfolio/
├── index.html          # 展示主页
├── admin.html          # 管理页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── data.js         # 数据存储模块
│   ├── app.js          # 展示页逻辑
│   └── admin.js        # 管理页逻辑
└── README.md
```

## 技术栈

- **HTML5** - 语义化标签
- **CSS3** - CSS 变量、Flexbox、Grid、动画
- **Vanilla JavaScript (ES6+)** - IIFE 模块化封装
- **localStorage** - 本地数据持久化

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 安全说明

- 管理密码存储在 localStorage 中，可手动修改
- 登录状态保存在 sessionStorage，关闭浏览器后需重新登录
- 所有用户输入都经过 XSS 转义处理

## 自定义配置

### 修改密码

在浏览器控制台执行：

```javascript
DataStore.setPassword('你的新密码');
```

### 清空数据

在浏览器控制台执行：

```javascript
localStorage.clear();
location.reload();
```

## 许可证

MIT License

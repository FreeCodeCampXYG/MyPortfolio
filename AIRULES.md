# AIRules - AI 开发规范指南

> 本规范用于指导 AI 编程助手（如 Cursor, Trae, Claude Code 等）进行代码开发

---

## 1. 项目架构

### 1.1 技术栈
- **前端**: 纯 HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- **存储**: localStorage
- **无依赖**: 零 npm 包，纯原生实现

### 1.2 目录结构
```
portfolio/
├── index.html          # 展示主页
├── admin.html          # 管理页面
├── css/
│   └── style.css       # 样式（单一文件）
├── js/
│   ├── data.js         # 数据层（localStorage 封装）
│   ├── app.js          # 展示页逻辑
│   └── admin.js        # 管理页逻辑
└── README.md
```

### 1.3 分层职责
| 层级 | 职责 | 文件 |
|------|------|------|
| 视图层 | HTML 结构 | `*.html` |
| 样式层 | CSS 样式 | `css/style.css` |
| 逻辑层 | 用户交互 | `js/app.js`, `js/admin.js` |
| 数据层 | 存储操作 | `js/data.js` |

---

## 2. 代码风格

### 2.1 HTML
```html
<!-- 使用语义化标签 -->
<header class="header">
    <nav class="nav-links">
        <a href="index.html" class="nav-link">作品</a>
    </nav>
</header>

<!-- 自闭合标签不需斜杠 -->
<img src="..." alt="描述">
<br>
```

### 2.2 CSS
```css
/* 使用 CSS 变量定义主题 */
:root {
    --primary: #6366f1;
    --bg-primary: #0f172a;
}

/* 嵌套选择器限制在 3 层以内 */
.card .card-title {
    /* OK */
}
.card .card-content .title {
    /* 考虑提取为独立类 */
}

/* 类名规范：小写 + 连字符 */
.nav-link, .work-card, .btn-primary
```

### 2.3 JavaScript
```javascript
// 使用 IIFE 封装模块
(function() {
    'use strict';
    
    // 私有变量
    let count = 0;
    
    // 公共接口
    window.Module = {
        init: init
    };
})();

// 函数声明优于函数表达式
function handleClick() { }

// 常量大写
const MAX_COUNT = 100;

// DOM 缓存
const btn = document.getElementById('btn');

// 箭头函数用于回调
const items = list.map(item => item.name);
```

---

## 3. 安全规范

### 3.1 XSS 防护
**必须**对所有用户输入和动态内容进行 HTML 转义：
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 使用
element.innerHTML = escapeHtml(userInput);
```

### 3.2 URL 验证
```javascript
// 验证 URL 格式
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
```

### 3.3 localStorage 安全
- 不存储敏感信息（密码仅做简单验证）
- 数据操作需 try-catch
- 解析 JSON 前检查有效性

---

## 4. 性能规范

### 4.1 图片处理
```html
<!-- 懒加载 -->
<img src="..." loading="lazy" alt="...">

<!-- 加载失败处理 -->
<img src="..." onerror="this.parentElement.innerHTML='<span>🖼️</span>'">
```

### 4.2 事件处理
```javascript
// 事件委托优于逐个绑定
container.addEventListener('click', function(e) {
    if (e.target.matches('.delete-btn')) {
        handleDelete(e.target.dataset.id);
    }
});

// 频繁触发使用防抖/节流（如搜索输入）
```

### 4.3 DOM 操作
```javascript
// 批量操作使用 DocumentFragment
const fragment = document.createDocumentFragment();
items.forEach(item => fragment.appendChild(createItem(item)));
container.appendChild(fragment);

// 先操作 DOM 后读取布局属性
```

---

## 5. 响应式设计

### 5.1 断点规范
```css
/* 手机优先 */
/* 平板及以上 */
@media (min-width: 768px) { }

/* 大屏 */
@media (min-width: 1024px) { }
```

### 5.2 布局技巧
```css
/* 网格自适应 */
.works-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}

/* Flex 居中 */
.center {
    display: flex;
    align-items: center;
    justify-content: center;
}
```

---

## 6. 可访问性 (A11y)

### 6.1 语义化
- 使用 `<button>` 而非 `<div>` 实现按钮
- 表单元素关联 `<label>`
- 图片提供 alt 属性

### 6.2 键盘支持
- 模态框支持 ESC 关闭
- 焦点状态样式清晰

### 6.3 ARIA 属性
```html
<button aria-label="关闭" class="modal-close">✕</button>
<div role="dialog" aria-modal="true">...</div>
```

---

## 7. Git 提交规范

### 7.1 提交类型
```
feat: 新功能
fix: 修复 bug
style: 样式调整
refactor: 重构
docs: 文档更新
```

### 7.2 提交示例
```
feat: 添加作品编辑功能
fix: 修复图片加载失败显示问题
style: 优化卡片悬停动画效果
```

---

## 8. 调试清单

完成功能后自检：
- [ ] 功能符合需求文档
- [ ] 无 console.error
- [ ] 无 404 资源请求
- [ ] 响应式布局正常
- [ ] 表单验证正常
- [ ] 删除操作需确认
- [ ] Toast 提示清晰

---

## 9. 提示词模板

### 开发新功能
```
请在 portfolio 项目中添加 [功能名称] 功能：
- 需求描述：[具体描述]
- 交互细节：[用户操作流程]
- 注意事项：[特殊要求]

参考现有代码风格：CSS 变量、小写连字符类名、IIFE 封装 JS
```

### 修改样式
```
请调整 portfolio 的 [组件] 样式：
- 当前状态：[现状]
- 期望状态：[期望]
- 参考：[设计稿或描述]
```

### 修复 Bug
```
发现 [组件] 的 [问题]：
- 复现步骤：[步骤]
- 预期行为：[期望]
- 实际行为：[实际]

请定位并修复
```

(function() {
    'use strict';

    const STORAGE_KEYS = {
        WORKS: 'portfolio_works',
        PASSWORD: 'portfolio_admin_password',
        SESSION: 'portfolio_admin_session'
    };

    const DEFAULT_PASSWORD = 'admin123';

    const SAMPLE_WORKS = [
        {
            id: generateId(),
            title: '个人博客系统',
            description: '基于 Vue3 + TypeScript 构建的现代化博客系统，支持 Markdown 编辑、代码高亮、评论互动等功能。',
            link: 'https://github.com',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: '电商小程序',
            description: '完整的微信小程序电商解决方案，包含商品展示、购物车、订单管理、支付集成等核心功能。',
            link: 'https://github.com',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: '数据可视化平台',
            description: '使用 ECharts + React 构建的企业级数据可视化平台，支持多种图表类型和实时数据更新。',
            link: 'https://github.com',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
            createdAt: new Date().toISOString()
        }
    ];

    function generateId() {
        return 'work_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function isValidUrl(string) {
        if (!string) return false;
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function safeJsonParse(str, defaultValue) {
        try {
            return str ? JSON.parse(str) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    function safeJsonStringify(obj) {
        try {
            return JSON.stringify(obj);
        } catch (e) {
            return null;
        }
    }

    function getWorks() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.WORKS);
            if (!data) {
                initSampleData();
                return safeJsonParse(localStorage.getItem(STORAGE_KEYS.WORKS), []);
            }
            return safeJsonParse(data, []);
        } catch (e) {
            console.error('Failed to get works:', e);
            return [];
        }
    }

    function initSampleData() {
        try {
            localStorage.setItem(STORAGE_KEYS.WORKS, safeJsonStringify(SAMPLE_WORKS));
        } catch (e) {
            console.error('Failed to init sample data:', e);
        }
    }

    function saveWorks(works) {
        try {
            localStorage.setItem(STORAGE_KEYS.WORKS, safeJsonStringify(works));
            return true;
        } catch (e) {
            console.error('Failed to save works:', e);
            return false;
        }
    }

    function addWork(work) {
        const works = getWorks();
        const newWork = {
            id: generateId(),
            title: escapeHtml(work.title),
            description: escapeHtml(work.description),
            link: work.link,
            image: work.image,
            createdAt: new Date().toISOString()
        };
        works.unshift(newWork);
        return saveWorks(works) ? newWork : null;
    }

    function updateWork(id, updates) {
        const works = getWorks();
        const index = works.findIndex(w => w.id === id);
        if (index === -1) return null;

        const updatedWork = {
            ...works[index],
            title: escapeHtml(updates.title),
            description: escapeHtml(updates.description),
            link: updates.link,
            image: updates.image,
            updatedAt: new Date().toISOString()
        };
        works[index] = updatedWork;
        return saveWorks(works) ? updatedWork : null;
    }

    function deleteWork(id) {
        const works = getWorks();
        const filtered = works.filter(w => w.id !== id);
        if (filtered.length === works.length) return false;
        return saveWorks(filtered);
    }

    function getWorkById(id) {
        const works = getWorks();
        return works.find(w => w.id === id) || null;
    }

    function getPassword() {
        return localStorage.getItem(STORAGE_KEYS.PASSWORD) || DEFAULT_PASSWORD;
    }

    function setPassword(newPassword) {
        try {
            localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword);
            return true;
        } catch (e) {
            return false;
        }
    }

    function login(password) {
        if (password === getPassword()) {
            sessionStorage.setItem(STORAGE_KEYS.SESSION, 'true');
            return true;
        }
        return false;
    }

    function logout() {
        sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    }

    function isLoggedIn() {
        return sessionStorage.getItem(STORAGE_KEYS.SESSION) === 'true';
    }

    window.DataStore = {
        getWorks,
        addWork,
        updateWork,
        deleteWork,
        getWorkById,
        login,
        logout,
        isLoggedIn,
        getPassword,
        setPassword,
        escapeHtml,
        isValidUrl,
        generateId
    };
})();

(function() {
    'use strict';

    const loginView = document.getElementById('login-view');
    const adminView = document.getElementById('admin-view');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const addWorkBtn = document.getElementById('add-work-btn');
    const adminWorksContainer = document.getElementById('admin-works-container');
    const adminEmptyState = document.getElementById('admin-empty-state');

    const workModal = document.getElementById('work-modal');
    const workForm = document.getElementById('work-form');
    const modalTitle = document.getElementById('modal-title');
    const workIdInput = document.getElementById('work-id');
    const workTitleInput = document.getElementById('work-title');
    const workDescriptionInput = document.getElementById('work-description');
    const workLinkInput = document.getElementById('work-link');
    const workImageInput = document.getElementById('work-image');
    const modalCloseBtn = workModal.querySelector('.modal-close');
    const modalCancelBtn = workModal.querySelector('.modal-cancel');

    const confirmModal = document.getElementById('confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    const toastContainer = document.getElementById('toast-container');

    let deleteTargetId = null;

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="toast-message">${DataStore.escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
            }, 250);
        }, 3000);
    }

    function showLogin() {
        loginView.style.display = 'flex';
        adminView.style.display = 'none';
    }

    function showAdmin() {
        loginView.style.display = 'none';
        adminView.style.display = 'block';
        renderAdminWorks();
    }

    function checkAuth() {
        if (DataStore.isLoggedIn()) {
            showAdmin();
        } else {
            showLogin();
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        const password = passwordInput.value;

        if (DataStore.login(password)) {
            loginError.style.display = 'none';
            passwordInput.value = '';
            showAdmin();
            showToast('登录成功', 'success');
        } else {
            loginError.style.display = 'block';
            passwordInput.classList.add('shake');
            setTimeout(() => passwordInput.classList.remove('shake'), 500);
        }
    }

    function handleLogout() {
        DataStore.logout();
        showLogin();
        showToast('已退出登录', 'success');
    }

    function createAdminWorkCard(work) {
        const card = document.createElement('article');
        card.className = 'work-card admin-work-card';
        card.setAttribute('data-id', work.id);

        const hasImage = work.image && DataStore.isValidUrl(work.image);
        const hasLink = work.link && DataStore.isValidUrl(work.link);

        card.innerHTML = `
            <div class="work-card-image">
                ${hasImage 
                    ? `<img src="${DataStore.escapeHtml(work.image)}" alt="${DataStore.escapeHtml(work.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                       <div class="work-card-placeholder" style="display:none;">🖼️</div>`
                    : `<div class="work-card-placeholder">🖼️</div>`
                }
            </div>
            <div class="work-card-content">
                <h3 class="work-card-title">${DataStore.escapeHtml(work.title)}</h3>
                <p class="work-card-description">${DataStore.escapeHtml(work.description) || '暂无描述'}</p>
                <div class="work-card-footer">
                    ${hasLink 
                        ? `<a href="${DataStore.escapeHtml(work.link)}" target="_blank" rel="noopener noreferrer" class="work-card-link" onclick="event.stopPropagation()">
                            <span>查看</span>
                            <span class="arrow">→</span>
                           </a>`
                        : `<span class="work-card-link" style="color: var(--text-muted);">暂无链接</span>`
                    }
                    <div class="work-card-actions">
                        <button class="btn btn-secondary btn-sm edit-btn" data-id="${work.id}" aria-label="编辑作品">
                            <span>编辑</span>
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${work.id}" aria-label="删除作品">
                            <span>删除</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    function renderAdminWorks() {
        const works = DataStore.getWorks();

        if (works.length === 0) {
            adminWorksContainer.innerHTML = '';
            adminWorksContainer.style.display = 'none';
            adminEmptyState.style.display = 'flex';
            return;
        }

        adminWorksContainer.style.display = 'grid';
        adminEmptyState.style.display = 'none';

        const fragment = document.createDocumentFragment();
        works.forEach(work => {
            fragment.appendChild(createAdminWorkCard(work));
        });

        adminWorksContainer.innerHTML = '';
        adminWorksContainer.appendChild(fragment);
    }

    function openModal(mode, workId) {
        workForm.reset();
        workIdInput.value = '';

        if (mode === 'edit' && workId) {
            const work = DataStore.getWorkById(workId);
            if (work) {
                modalTitle.textContent = '编辑作品';
                workIdInput.value = work.id;
                workTitleInput.value = work.title;
                workDescriptionInput.value = work.description || '';
                workLinkInput.value = work.link || '';
                workImageInput.value = work.image || '';
            }
        } else {
            modalTitle.textContent = '添加作品';
        }

        workModal.classList.add('active');
        workTitleInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        workModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openConfirmModal(workId) {
        deleteTargetId = workId;
        confirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeConfirmModal() {
        confirmModal.classList.remove('active');
        document.body.style.overflow = '';
        deleteTargetId = null;
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const workData = {
            title: workTitleInput.value.trim(),
            description: workDescriptionInput.value.trim(),
            link: workLinkInput.value.trim(),
            image: workImageInput.value.trim()
        };

        if (!workData.title) {
            showToast('请输入作品标题', 'error');
            workTitleInput.focus();
            return;
        }

        if (workData.link && !DataStore.isValidUrl(workData.link)) {
            showToast('请输入有效的链接地址', 'error');
            workLinkInput.focus();
            return;
        }

        if (workData.image && !DataStore.isValidUrl(workData.image)) {
            showToast('请输入有效的图片地址', 'error');
            workImageInput.focus();
            return;
        }

        const workId = workIdInput.value;
        let result;

        if (workId) {
            result = DataStore.updateWork(workId, workData);
            if (result) {
                showToast('作品更新成功', 'success');
            } else {
                showToast('更新失败，请重试', 'error');
                return;
            }
        } else {
            result = DataStore.addWork(workData);
            if (result) {
                showToast('作品添加成功', 'success');
            } else {
                showToast('添加失败，请重试', 'error');
                return;
            }
        }

        closeModal();
        renderAdminWorks();
    }

    function handleDelete() {
        if (!deleteTargetId) return;

        if (DataStore.deleteWork(deleteTargetId)) {
            showToast('作品已删除', 'success');
            renderAdminWorks();
        } else {
            showToast('删除失败，请重试', 'error');
        }

        closeConfirmModal();
    }

    function handleWorksContainerClick(e) {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (editBtn) {
            const workId = editBtn.dataset.id;
            openModal('edit', workId);
        } else if (deleteBtn) {
            const workId = deleteBtn.dataset.id;
            openConfirmModal(workId);
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') {
            if (workModal.classList.contains('active')) {
                closeModal();
            }
            if (confirmModal.classList.contains('active')) {
                closeConfirmModal();
            }
        }
    }

    function init() {
        checkAuth();

        loginForm.addEventListener('submit', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);

        addWorkBtn.addEventListener('click', () => openModal('add'));
        workForm.addEventListener('submit', handleFormSubmit);
        modalCloseBtn.addEventListener('click', closeModal);
        modalCancelBtn.addEventListener('click', closeModal);
        workModal.addEventListener('click', (e) => {
            if (e.target === workModal) closeModal();
        });

        adminWorksContainer.addEventListener('click', handleWorksContainerClick);

        cancelDeleteBtn.addEventListener('click', closeConfirmModal);
        confirmDeleteBtn.addEventListener('click', handleDelete);
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) closeConfirmModal();
        });

        document.addEventListener('keydown', handleKeydown);

        window.addEventListener('storage', (e) => {
            if (e.key === 'portfolio_works' && DataStore.isLoggedIn()) {
                renderAdminWorks();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.Admin = {
        showToast,
        renderAdminWorks
    };
})();

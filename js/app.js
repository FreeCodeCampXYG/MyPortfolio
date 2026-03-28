(function() {
    'use strict';

    const worksContainer = document.getElementById('works-container');
    const emptyState = document.getElementById('empty-state');
    const toastContainer = document.getElementById('toast-container');

    function createWorkCard(work) {
        const card = document.createElement('article');
        card.className = 'work-card';
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
                        ? `<a href="${DataStore.escapeHtml(work.link)}" target="_blank" rel="noopener noreferrer" class="work-card-link">
                            <span>查看项目</span>
                            <span class="arrow">→</span>
                           </a>`
                        : `<span class="work-card-link" style="color: var(--text-muted);">暂无链接</span>`
                    }
                </div>
            </div>
        `;

        if (hasLink) {
            const linkEl = card.querySelector('.work-card-link');
            if (linkEl && linkEl.tagName === 'A') {
                linkEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }

        return card;
    }

    function renderWorks() {
        const works = DataStore.getWorks();

        if (works.length === 0) {
            worksContainer.innerHTML = '';
            worksContainer.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        worksContainer.style.display = 'grid';
        emptyState.style.display = 'none';

        const fragment = document.createDocumentFragment();
        works.forEach(work => {
            fragment.appendChild(createWorkCard(work));
        });

        worksContainer.innerHTML = '';
        worksContainer.appendChild(fragment);
    }

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

    function init() {
        renderWorks();

        window.addEventListener('storage', (e) => {
            if (e.key === 'portfolio_works') {
                renderWorks();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.App = {
        showToast,
        renderWorks
    };
})();

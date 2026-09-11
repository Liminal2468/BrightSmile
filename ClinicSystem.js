document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const contentContainer = document.querySelector('.content');
    const defaultPage = 'pages/appointments.html';

    async function loadPage(pageUrl) {
        try {
            const response = await fetch(pageUrl);
            if (!response.ok) throw new Error('Network failed to respond.');

            const text = await response.text();
            contentContainer.innerHTML = text;

            // Scripts inserted via innerHTML never execute on their own —
            // recreate each <script> tag so pages like calendar.html can run their JS.
            contentContainer.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                [...oldScript.attributes].forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                oldScript.replaceWith(newScript);
            });
        } catch (error) {
            console.error('Failed to load page:', error);
            contentContainer.innerHTML = `<div style="padding: 20px; color: var(--text-page);">
                <h3>Unable to load content</h3>
                <p>Make sure you are connected to the internet.</p>
            </div>`;
        }
    }

    function setActive(pageUrl) {
        navItems.forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('data-page') === pageUrl);
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-page');
            if (!targetPage) return;

            setActive(targetPage);
            loadPage(targetPage);
        });
    });

    // Single source of truth: whichever page loads first is also marked active,
    // instead of relying on a hardcoded "active" class in the HTML that can go stale.
    setActive(defaultPage);
    loadPage(defaultPage);

    // --- Session / logout ---
    const currentUserEl = document.getElementById('current-user');
    const storedUser = sessionStorage.getItem('clinicUser');
    if (currentUserEl && storedUser) {
        currentUserEl.textContent = storedUser;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('clinicLoggedIn');
            sessionStorage.removeItem('clinicUser');
            window.location.href = 'login.html';
        });
    }
});

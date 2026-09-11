document.addEventListener('DOMContentLoaded', () => {
    // Demo-only credential check — this runs entirely in the browser, so it is
    // NOT real security. A production system needs server-side authentication.
    const DEMO_USER = { username: 'Lorem Ipsum', password: 'latin' };

    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');

    // If already signed in this session, skip straight to the app.
    if (sessionStorage.getItem('clinicLoggedIn') === 'true') {
        window.location.replace('ClinicSystem.html');
        return;
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username === DEMO_USER.username && password === DEMO_USER.password) {
            sessionStorage.setItem('clinicLoggedIn', 'true');
            sessionStorage.setItem('clinicUser', username);
            window.location.href = 'ClinicSystem.html';
        } else {
            errorEl.hidden = false;
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    // Clear the error once the person starts correcting their input.
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => { errorEl.hidden = true; });
    });
});

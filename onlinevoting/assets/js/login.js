document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (!loginForm) {
        console.error('Voter login form not found!');
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const voterName = document.getElementById('voterName').value.trim();
        const voterID = document.getElementById('voterID').value.trim();

        if (voterName === '' || voterID === '') {
            errorMessage.textContent = 'Please fill out all fields.';
            return;
        }

        // Check if user is trying to log in as admin
        if (voterName.toLowerCase() === 'admin') {
            errorMessage.textContent = 'Use the Admin Login page!';
            setTimeout(() => window.location.href = 'admin-login.html', 1000);
            return;
        }

        // Store voter details and redirect
        localStorage.setItem('voterName', voterName);
        localStorage.setItem('voterID', voterID);
        localStorage.setItem('role', 'voter'); // Differentiate role
        window.location.href = 'dashboard.html';
    });
});
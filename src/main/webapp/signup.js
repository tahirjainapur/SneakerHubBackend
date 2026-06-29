// Signup Functionality

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        /*
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // ... AJAX code disabled ...
        });
        */
    }

    // Helper function to display alerts
    function showAlert(alertElement, message, type) {
        alertElement.textContent = message;
        alertElement.classList.remove('alert-error', 'alert-success');
        
        if (type === 'error') {
            alertElement.classList.add('alert-error');
            setTimeout(() => {
                alertElement.classList.remove('alert-error');
                alertElement.style.display = 'none';
            }, 3000);
        } else if (type === 'success') {
            alertElement.classList.add('alert-success');
        }
    }
});

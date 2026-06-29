// Login Verification

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        /*
        loginForm.addEventListener('submit', async (e) => {
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

    // Forgot Password Flow
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            const email = prompt('Enter your registered email address to reset password:');
            if (!email) return; // User cancelled or entered empty string
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === email);
            
            if (userIndex === -1) {
                alert('User not found.');
                return;
            }
            
            // User exists, generate OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            alert('Your SneakerHub Password Reset OTP is: ' + otp);
            
            const userEnteredOtp = prompt('Enter the 4-digit OTP to reset your password:');
            
            if (userEnteredOtp === otp) {
                const newPassword = prompt('Enter your new password:');
                if (newPassword && newPassword.trim() !== '') {
                    users[userIndex].password = newPassword.trim();
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('Password updated successfully. You can now login with your new password.');
                } else {
                    alert('Invalid password. Password reset cancelled.');
                }
            } else {
                alert('Invalid OTP. Password reset process stopped.');
            }
        });
    }
});

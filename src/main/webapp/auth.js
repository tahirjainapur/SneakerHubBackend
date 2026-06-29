// Authentication Form Validation

document.addEventListener('DOMContentLoaded', () => {
    
    // Login Form Validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginAlert = document.getElementById('login-alert');
            
            // Basic Validation: Check if fields are empty
            if (!email || !password) {
                showAlert(loginAlert, 'Please fill in all fields.', 'error');
                return;
            }
            
            // If validation passes, simulate successful login
            showAlert(loginAlert, 'Login successful! Redirecting...', 'success');
            
            // Optional: simulate redirect after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // Signup Form Validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const signupAlert = document.getElementById('signup-alert');
            
            // Basic Validation: All fields required
            if (!fullName || !email || !password || !confirmPassword) {
                showAlert(signupAlert, 'Please fill in all fields.', 'error');
                return;
            }
            
            // Validation: Passwords must match
            if (password !== confirmPassword) {
                showAlert(signupAlert, 'Passwords do not match.', 'error');
                return;
            }
            
            // Validation: Password length check (optional, but good practice)
            if (password.length < 6) {
                showAlert(signupAlert, 'Password must be at least 6 characters.', 'error');
                return;
            }

            // If validation passes, simulate successful signup
            showAlert(signupAlert, 'Account created successfully! Redirecting to login...', 'success');
            
            // Optional: simulate redirect after short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }

    // Helper function to display alerts
    function showAlert(alertElement, message, type) {
        alertElement.textContent = message;
        
        // Remove existing classes
        alertElement.classList.remove('alert-error', 'alert-success');
        
        // Add new class based on type
        if (type === 'error') {
            alertElement.classList.add('alert-error');
        } else if (type === 'success') {
            alertElement.classList.add('alert-success');
        }
        
        // Clear message after 3 seconds if it's an error
        if (type === 'error') {
            setTimeout(() => {
                alertElement.classList.remove('alert-error');
                alertElement.style.display = 'none';
            }, 3000);
        }
    }
});

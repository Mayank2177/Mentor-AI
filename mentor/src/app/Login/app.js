
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
    import { getAuth, GoogleAuthProvider ,signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  const firebaseConfig = {
    apiKey: "AIzaSyC766UoV0usTX7b-wos3g8NJBKNHhNOd3o",
    authDomain: "g-login-7a29b.firebaseapp.com",
    projectId: "g-login-7a29b",
    storageBucket: "g-login-7a29b.firebasestorage.app",
    messagingSenderId: "152778329679",
    appId: "1:152778329679:web:37ba24021310395b29243a"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.languageCode = 'en';
  const provider = new GoogleAuthProvider();
  const googleSignin = document.getElementById('googleSigninLink');
  googleSignin.addEventListener('click',function(){
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        window.location.href = '../logged.html'; // Redirect to logged.html after successful sign-in
      }).catch((error) => {
        
        const errorCode = error.code;
        const errorMessage = error.message;
       
      });
  })
// DOM elements
const toggleButtons = document.querySelectorAll('.toggle-btn');
const toggleIndicator = document.querySelector('.toggle-indicator');
const signinForm = document.querySelector('.signin-form');
const signupForm = document.querySelector('.signup-form');
const formsContainer = document.querySelector('.forms-container');
const messageOverlay = document.getElementById('messageOverlay');
const body = document.body;

// Form elements
const signinFormElement = document.getElementById('signinForm');
const signupFormElement = document.getElementById('signupForm');

// Google Sign In Link
const googleSigninLink = document.getElementById('googleSigninLink');

// Current active form
let currentForm = 'signin';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addInputAnimations();
    createParticleEffects();
    setFormsContainerHeight();
    enhanceAccessibility();
});

// Event listeners
function initializeEventListeners() {
    // Toggle button listeners
    toggleButtons.forEach(button => {
        button.addEventListener('click', handleFormToggle);
    });

    // Form submission listeners
    if (signinFormElement) {
        signinFormElement.addEventListener('submit', handleSigninSubmit);
    }

    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignupSubmit);
    }

    // Google Sign In listener
    if (googleSigninLink) {
        googleSigninLink.addEventListener('click', handleGoogleSignin);
    }

    // Input focus/blur effects
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });

    // Checkbox functionality
    const checkbox = document.getElementById('rememberMe');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            const checkmark = this.nextElementSibling;
            if (this.checked) {
                checkmark.style.backgroundColor = 'var(--primary-color)';
                checkmark.style.borderColor = 'var(--primary-color)';
            } else {
                checkmark.style.backgroundColor = 'transparent';
                checkmark.style.borderColor = '#e2e8f0';
            }
        });
    }

    // Terms checkbox
    const termsCheckbox = document.getElementById('agreeToTerms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            const submitButton = signupFormElement.querySelector('.btn-primary');
            submitButton.disabled = !this.checked;
            if (this.checked) {
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            } else {
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
            }
        });
    }

    // Close message overlay when clicking outside
    if (messageOverlay) {
        messageOverlay.addEventListener('click', function(e) {
            if (e.target === messageOverlay) {
                closeMessage();
            }
        });
    }
}

// Handle Google Sign In
function handleGoogleSignin(e) {
    e.preventDefault();
    
    // Add loading state to Google button
    const originalText = googleSigninLink.textContent;
    googleSigninLink.style.pointerEvents = 'none';
    googleSigninLink.style.opacity = '0.7';
    googleSigninLink.innerHTML = `
        <div class="loading-spinner" style="opacity: 1; position: relative; margin-right: 10px;"></div>
        Connecting to Google...
    `;

    // Simulate Google authentication process
    setTimeout(() => {
        console.log('Google Sign In initiated');
        
        // Reset Google button
        googleSigninLink.style.pointerEvents = 'auto';
        googleSigninLink.style.opacity = '1';
        googleSigninLink.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
        `;
        
        // Show success message
        showMessage('Google Sign In', 'Successfully connected with Google! Welcome to mentor.AI.');
        
        // Here you would typically redirect to Google OAuth or handle the authentication
        // For demo purposes, we're just showing a success message
        
    }, 2000);
}

// Handle form toggle
function handleFormToggle(e) {
    const targetForm = e.target.dataset.form;
    if (targetForm === currentForm) return;

    // Update button states
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Update body class for styling
    if (targetForm === 'signup') {
        body.classList.add('signup-active');
    } else {
        body.classList.remove('signup-active');
    }

    // Switch forms
    if (targetForm === 'signup') {
        signinForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signupForm.classList.remove('active');
        signinForm.classList.add('active');
    }

    currentForm = targetForm;

    // Add animation class
    formsContainer.classList.add('switching');
    setTimeout(() => {
        formsContainer.classList.remove('switching');
    }, 500);

    // Update form container height
    setTimeout(setFormsContainerHeight, 50);
}

// Handle input focus
function handleInputFocus(e) {
    const wrapper = e.target.closest('.input-wrapper');
    if (wrapper) {
        wrapper.classList.add('focused');
    }
    e.target.parentElement.classList.add('focused');
    // Add focus animation
    e.target.style.transform = 'translateY(-1px)';
}

// Handle input blur
function handleInputBlur(e) {
    const wrapper = e.target.closest('.input-wrapper');
    if (wrapper) {
        wrapper.classList.remove('focused');
    }
    e.target.parentElement.classList.remove('focused');
    e.target.style.transform = 'translateY(0)';
    // Validate on blur
    validateField(e.target);
}

// Handle input change
function handleInputChange(e) {
    clearFieldError(e.target);
    // Real-time validation for password confirmation
    if (e.target.name === 'confirmPassword') {
        const password = signupFormElement.querySelector('input[name="password"]').value;
        const confirmPassword = e.target.value;
        if (confirmPassword && password !== confirmPassword) {
            showFieldError(e.target, 'Passwords do not match');
        }
    }
}

// Handle signin form submission
function handleSigninSubmit(e) {
    e.preventDefault();
    if (!validateForm(signinFormElement)) {
        return;
    }

    const submitButton = e.target.querySelector('.btn-primary');
    const formData = new FormData(e.target);

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        console.log('Sign in data:', Object.fromEntries(formData));
        
        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;

        // Show success message
        showMessage('Welcome back!', 'You have successfully signed in to mentor.AI.');

        // Reset form
        e.target.reset();
    }, 2000);
}

// Handle signup form submission
function handleSignupSubmit(e) {
    e.preventDefault();
    if (!validateForm(signupFormElement)) {
        return;
    }

    const submitButton = e.target.querySelector('.btn-primary');
    const formData = new FormData(e.target);

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        console.log('Sign up data:', Object.fromEntries(formData));

        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;

        // Show success message
        showMessage('Account Created!', 'Welcome to mentor.AI! Your account has been created successfully.');

        // Reset form and switch to signin
        e.target.reset();
        setTimeout(() => {
            document.querySelector('[data-form="signin"]').click();
        }, 2000);
    }, 2500);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('.form-control[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Additional validation for signup form
    if (form.id === 'signupForm') {
        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

        if (password !== confirmPassword) {
            showFieldError(form.querySelector('input[name="confirmPassword"]'), 'Passwords do not match');
            isValid = false;
        }

        if (password.length < 6) {
            showFieldError(form.querySelector('input[name="password"]'), 'Password must be at least 6 characters');
            isValid = false;
        }

        const termsCheckbox = form.querySelector('#agreeToTerms');
        if (!termsCheckbox.checked) {
            showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
            isValid = false;
        }
    }

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9]?[0-9]{7,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    }

    // Update field appearance
    if (isValid && value) {
        field.classList.add('valid');
        field.classList.remove('invalid');
    } else if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
    } else {
        field.classList.remove('valid', 'invalid');
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message show';
    errorElement.textContent = message;
    const wrapper = field.closest('.form-group');
    if (wrapper) {
        wrapper.appendChild(errorElement);
    }
    field.classList.add('invalid');
}

// Clear field error
function clearFieldError(field) {
    const wrapper = field.closest('.form-group');
    if (wrapper) {
        const existingError = wrapper.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    field.classList.remove('invalid');
}

// Show success/error message
function showMessage(title, text, type = 'success') {
    if (!messageOverlay) return;

    const messageTitle = messageOverlay.querySelector('.message-title');
    const messageText = messageOverlay.querySelector('.message-text');
    const messageIcon = messageOverlay.querySelector('.message-icon svg');

    messageTitle.textContent = title;
    messageText.textContent = text;

    // Update icon based on type
    if (type === 'success') {
        messageIcon.innerHTML = '<path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle>';
    } else {
        messageIcon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>';
    }

    messageOverlay.classList.add('show');
}

// Close message overlay
function closeMessage() {
    if (messageOverlay) {
        messageOverlay.classList.remove('show');
    }
}

// Add input animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        // Add ripple effect on focus
        input.addEventListener('focus', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        // Add typing animation
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.fontWeight = '500';
            } else {
                this.style.fontWeight = '400';
            }
        });
    });
}

// Create particle effects
function createParticleEffects() {
    const particlesContainer = document.querySelector('.background-particles');
    if (!particlesContainer) return;

    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 20 + 10}s infinite linear`;
        particle.style.animationDelay = Math.random() * 20 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Set forms container height
function setFormsContainerHeight() {
    if (!formsContainer) return;

    const activeForm = formsContainer.querySelector('.auth-form.active');
    if (activeForm) {
        const height = activeForm.offsetHeight;
        formsContainer.style.height = height + 'px';
    }
}

// Enhance accessibility
function enhanceAccessibility() {
    // Add ARIA labels
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        if (!input.getAttribute('aria-label') && input.placeholder) {
            input.setAttribute('aria-label', input.placeholder);
        }
    });

    // Add keyboard navigation for toggle buttons
    toggleButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add keyboard navigation for Google sign in link
    if (googleSigninLink) {
        googleSigninLink.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Add form submission on Enter
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.target.matches('textarea')) {
                e.preventDefault();
                const submitButton = this.querySelector('.btn-primary');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                }
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Responsive handler
window.addEventListener('resize', debounce(() => {
    setFormsContainerHeight();
}, 250));

// Page visibility handler
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        const particles = document.querySelectorAll('.background-particles div');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        const particles = document.querySelectorAll('.background-particles div');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }
});

// Export functions for potential external use
window.EduLearnAuth = {
    showMessage,
    closeMessage,
    validateForm,
    handleFormToggle: function(formType) {
        const button = document.querySelector(`[data-form="${formType}"]`);
        if (button) button.click();
    },
    handleGoogleSignin
};
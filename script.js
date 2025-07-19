// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Global state
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const logoutBtn = document.getElementById('logoutBtn');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');

const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Check if user is already authenticated
    if (authToken) {
        showDashboard();
        loadDashboardData();
    } else {
        showLoginForm();
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Navigation buttons
    loginBtn.addEventListener('click', showLoginForm);
    registerBtn.addEventListener('click', showRegisterForm);
    dashboardBtn.addEventListener('click', showDashboard);
    logoutBtn.addEventListener('click', handleLogout);

    // Form submissions
    loginFormElement.addEventListener('submit', handleLogin);
    registerFormElement.addEventListener('submit', handleRegister);

    // Password visibility toggles
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });

    // Password strength indicator
    const registerPassword = document.getElementById('registerPassword');
    registerPassword.addEventListener('input', updatePasswordStrength);
}

/**
 * Show login form
 */
function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    dashboard.style.display = 'none';
    
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
    dashboardBtn.classList.remove('active');
    
    showNavButtons(false);
}

/**
 * Show register form
 */
function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    dashboard.style.display = 'none';
    
    loginBtn.classList.remove('active');
    registerBtn.classList.add('active');
    dashboardBtn.classList.remove('active');
    
    showNavButtons(false);
}

/**
 * Show dashboard
 */
function showDashboard() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    dashboard.style.display = 'block';
    
    loginBtn.classList.remove('active');
    registerBtn.classList.remove('active');
    dashboardBtn.classList.add('active');
    
    showNavButtons(true);
}

/**
 * Show/hide navigation buttons based on auth status
 */
function showNavButtons(isAuthenticated) {
    if (isAuthenticated) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        dashboardBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        dashboardBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.data.token;
            currentUser = data.data.user;
            
            // Store token in localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showToast('Login successful!', 'success');
            showDashboard();
            loadDashboardData();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle register form submission
 */
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.data.token;
            currentUser = data.data.user;
            
            // Store token in localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showToast('Registration successful!', 'success');
            showDashboard();
            loadDashboardData();
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle logout
 */
async function handleLogout() {
    try {
        // Call logout endpoint
        await fetch(`${API_BASE_URL}/protected/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Clear local storage and state
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    authToken = null;
    currentUser = null;
    
    showToast('Logged out successfully', 'info');
    showLoginForm();
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    if (!authToken) return;
    
    try {
        // Load profile data
        const profileResponse = await fetch(`${API_BASE_URL}/protected/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            updateProfileInfo(profileData.data.user);
        }
        
        // Load dashboard data
        const dashboardResponse = await fetch(`${API_BASE_URL}/protected/dashboard`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (dashboardResponse.ok) {
            const dashboardData = await dashboardResponse.json();
            updateDashboardStats(dashboardData.data);
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'error');
    }
}

/**
 * Update profile information
 */
function updateProfileInfo(user) {
    document.getElementById('userName').textContent = user.username;
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileCreated').textContent = new Date(user.createdAt).toLocaleDateString();
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats(data) {
    document.getElementById('totalPosts').textContent = data.stats.totalPosts;
    document.getElementById('totalLikes').textContent = data.stats.totalLikes;
    document.getElementById('totalComments').textContent = data.stats.totalComments;
    
    // Update activity list
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    data.recentActivity.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.appendChild(activityItem);
    });
}

/**
 * Create activity item element
 */
function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const icon = document.createElement('div');
    icon.className = 'activity-icon';
    
    // Set appropriate icon based on action
    let iconClass = 'fas fa-circle';
    if (activity.action.includes('post')) {
        iconClass = 'fas fa-file-alt';
    } else if (activity.action.includes('like')) {
        iconClass = 'fas fa-heart';
    } else if (activity.action.includes('comment')) {
        iconClass = 'fas fa-comment';
    }
    
    icon.innerHTML = `<i class="${iconClass}"></i>`;
    
    const content = document.createElement('div');
    content.className = 'activity-content';
    content.innerHTML = `
        <h4>${activity.action}</h4>
        <p>${new Date(activity.timestamp).toLocaleString()}</p>
    `;
    
    item.appendChild(icon);
    item.appendChild(content);
    
    return item;
}

/**
 * Check authentication status
 */
function checkAuthStatus() {
    if (authToken) {
        // Verify token is still valid
        fetch(`${API_BASE_URL}/protected/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Token invalid');
            }
        })
        .then(data => {
            currentUser = data.data.user;
            showDashboard();
            loadDashboardData();
        })
        .catch(error => {
            console.error('Token validation error:', error);
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            authToken = null;
            currentUser = null;
            showLoginForm();
        });
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(e) {
    const button = e.target.closest('.toggle-password');
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let text = 'Very Weak';
    
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Cap at 100%
    strength = Math.min(strength, 100);
    
    strengthBar.style.width = `${strength}%`;
    
    if (strength < 25) {
        text = 'Very Weak';
        strengthBar.style.background = '#ff4757';
    } else if (strength < 50) {
        text = 'Weak';
        strengthBar.style.background = '#ffa502';
    } else if (strength < 75) {
        text = 'Good';
        strengthBar.style.background = '#ffa502';
    } else {
        text = 'Strong';
        strengthBar.style.background = '#2ed573';
    }
    
    strengthText.textContent = text;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'error') icon = 'fas fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <div class="toast-content">
            <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <p>${message}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

/**
 * Show/hide loading overlay
 */
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

/**
 * Make authenticated API request
 */
async function makeAuthenticatedRequest(url, options = {}) {
    if (!authToken) {
        throw new Error('No authentication token');
    }
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    const response = await fetch(url, finalOptions);
    
    if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        authToken = null;
        currentUser = null;
        showToast('Session expired. Please login again.', 'error');
        showLoginForm();
        throw new Error('Authentication failed');
    }
    
    return response;
}

// Export functions for testing
window.JWTApp = {
    showToast,
    showLoading,
    makeAuthenticatedRequest,
    handleLogin,
    handleRegister,
    handleLogout
}; 
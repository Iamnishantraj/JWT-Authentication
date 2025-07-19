/**
 * Test file for JWT Authentication API
 * Run this file to test the API endpoints
 */

const fetch = require('node-fetch'); // You may need to install this: npm install node-fetch

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

/**
 * Test user registration
 */
async function testRegister() {
  console.log('\n🔐 Testing User Registration...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Registration successful!');
      console.log('User ID:', data.data.user.id);
      console.log('Token received:', data.data.token.substring(0, 20) + '...');
      authToken = data.data.token;
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
  }
}

/**
 * Test user login
 */
async function testLogin() {
  console.log('\n🔑 Testing User Login...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('Welcome back,', data.data.user.username);
      authToken = data.data.token;
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
  }
}

/**
 * Test accessing protected profile
 */
async function testProtectedProfile() {
  console.log('\n🛡️ Testing Protected Profile Route...');
  
  if (!authToken) {
    console.log('❌ No auth token available. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/protected/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Profile accessed successfully!');
      console.log('User info:', data.data.user);
    } else {
      console.log('❌ Profile access failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Profile access error:', error.message);
  }
}

/**
 * Test accessing protected dashboard
 */
async function testProtectedDashboard() {
  console.log('\n📊 Testing Protected Dashboard Route...');
  
  if (!authToken) {
    console.log('❌ No auth token available. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/protected/dashboard`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Dashboard accessed successfully!');
      console.log('Stats:', data.data.stats);
      console.log('Recent activity:', data.data.recentActivity.length, 'items');
    } else {
      console.log('❌ Dashboard access failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Dashboard access error:', error.message);
  }
}

/**
 * Test accessing protected route without token
 */
async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing Unauthorized Access...');
  
  try {
    const response = await fetch(`${BASE_URL}/protected/profile`);
    
    const data = await response.json();
    
    if (response.status === 401) {
      console.log('✅ Unauthorized access properly blocked!');
      console.log('Message:', data.message);
    } else {
      console.log('❌ Unauthorized access not properly handled');
    }
  } catch (error) {
    console.error('❌ Unauthorized access test error:', error.message);
  }
}

/**
 * Test token refresh
 */
async function testTokenRefresh() {
  console.log('\n🔄 Testing Token Refresh...');
  
  if (!authToken) {
    console.log('❌ No auth token available. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: authToken
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Token refreshed successfully!');
      console.log('New token:', data.data.token.substring(0, 20) + '...');
      authToken = data.data.token;
    } else {
      console.log('❌ Token refresh failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Token refresh error:', error.message);
  }
}

/**
 * Test logout
 */
async function testLogout() {
  console.log('\n👋 Testing Logout...');
  
  if (!authToken) {
    console.log('❌ No auth token available. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/protected/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Logout successful!');
      console.log('Message:', data.message);
      authToken = ''; // Clear the token
    } else {
      console.log('❌ Logout failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Logout error:', error.message);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting JWT Authentication API Tests...\n');
  
  // Test registration
  await testRegister();
  
  // Test login (in case registration fails due to existing user)
  await testLogin();
  
  // Test protected routes
  await testProtectedProfile();
  await testProtectedDashboard();
  
  // Test token refresh
  await testTokenRefresh();
  
  // Test unauthorized access
  await testUnauthorizedAccess();
  
  // Test logout
  await testLogout();
  
  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testRegister,
  testLogin,
  testProtectedProfile,
  testProtectedDashboard,
  testUnauthorizedAccess,
  testTokenRefresh,
  testLogout,
  runAllTests
}; 
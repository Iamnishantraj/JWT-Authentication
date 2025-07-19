# JWT Authentication API

A complete RESTful API with JWT (JSON Web Token) authentication built with Node.js and Express.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Password Hashing** - Bcrypt password encryption
- ✅ **Input Validation** - Express-validator for request validation
- 🔒 **Protected Routes** - Middleware for route protection
- 🔄 **Token Refresh** - Ability to refresh expired tokens
- 📝 **Comprehensive Error Handling** - Detailed error responses
- 🚀 **CORS Enabled** - Cross-origin resource sharing support

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── config.env             # Environment variables
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   └── protected.js      # Protected routes
└── README.md             # This file
```

## Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `config.env` and modify the values as needed
   - **Important:** Change the `JWT_SECRET` to a strong, unique secret key

4. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "1234567890",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2023-12-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "1234567890",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2023-12-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Routes (`/api/protected`)

**Note:** All protected routes require the `Authorization` header:
```http
Authorization: Bearer <your-jwt-token>
```

#### Get User Profile
```http
GET /api/protected/profile
Authorization: Bearer <token>
```

#### Get User Dashboard
```http
GET /api/protected/dashboard
Authorization: Bearer <token>
```

#### Update User Profile
```http
POST /api/protected/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Software developer",
  "location": "New York",
  "website": "https://example.com"
}
```

#### Get User Settings
```http
GET /api/protected/settings
Authorization: Bearer <token>
```

#### Logout User
```http
POST /api/protected/logout
Authorization: Bearer <token>
```

## Usage Examples

### Using cURL

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Access protected route:**
   ```bash
   curl -X GET http://localhost:3000/api/protected/profile \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

### Using JavaScript/Fetch

```javascript
// Register
const registerUser = async () => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Login
const loginUser = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
};

// Access protected route
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/protected/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data);
};
```

## Security Features

### JWT Token Security
- **Secret Key**: Uses a strong secret key for token signing
- **Expiration**: Tokens expire after 24 hours (configurable)
- **Payload**: Contains only necessary user information
- **Verification**: Proper token verification with error handling

### Password Security
- **Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **Validation**: Strong password requirements (minimum 6 characters, must contain number)
- **Comparison**: Secure password comparison using bcrypt

### Input Validation
- **Email Validation**: Proper email format validation
- **Username Validation**: Alphanumeric and underscore only, 3-30 characters
- **Password Validation**: Minimum length and complexity requirements

### Error Handling
- **Detailed Errors**: Specific error messages for different scenarios
- **Status Codes**: Proper HTTP status codes
- **Security**: No sensitive information in error responses

## Environment Variables

Create a `config.env` file with the following variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Production Considerations

1. **Database**: Replace in-memory storage with a proper database (MongoDB, PostgreSQL, etc.)
2. **JWT Secret**: Use a strong, randomly generated secret key
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for authentication endpoints
5. **Token Blacklisting**: Implement token blacklisting for logout
6. **Environment Variables**: Use proper environment variable management
7. **Logging**: Add comprehensive logging
8. **Monitoring**: Implement health checks and monitoring

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (User registered) |
| 400 | Bad Request (Validation errors) |
| 401 | Unauthorized (Invalid/missing token) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications.

## Support

If you encounter any issues or have questions, please open an issue in the repository. 
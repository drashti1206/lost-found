const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Secret key should be in .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock user data (replace with database in production)
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123', // In production, this should be hashed
    name: 'John Doe'
  }
];

// Create JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name
  });
});

// Register route
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name
  };

  users.push(newUser);

  // Create JWT token
  const token = generateToken(newUser);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  });
});

module.exports = { router, verifyToken }; 
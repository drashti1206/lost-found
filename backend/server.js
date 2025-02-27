const express = require('express');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const routes = jsonServer.rewriter(require('./routes.json'));
const middlewares = jsonServer.defaults();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const net = require('net');

const SECRET_KEY = 'your-secret-key';
const BASE_PORT = 5000;
const MAX_PORT_ATTEMPTS = 10;

// Function to check if a port is in use
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.once('close', () => resolve(true))
          .close();
      })
      .listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startPort) => {
  for (let port = startPort; port < startPort + MAX_PORT_ATTEMPTS; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('No available ports found');
};

// Start server with port handling
const startServer = async () => {
  try {
    const port = await findAvailablePort(BASE_PORT);

    // Enable CORS
    server.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    server.use(middlewares);
    server.use(jsonServer.bodyParser);
    server.use(routes);

    // Debug middleware to log requests
    server.use((req, res, next) => {
      console.log('Request:', req.method, req.path, req.body);
      next();
    });

    // Authentication endpoint
    server.post('/auth/login', (req, res) => {
      console.log('Login attempt:', req.body);
      const { email, password } = req.body;

      // Get users from db.json
      const users = router.db.get('users').value();
      console.log('Available users:', users);

      const user = users.find(u => u.email === email && u.password === password);
      console.log('Found user:', user);

      if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({
          token,
          user: userWithoutPassword
        });
      } else {
        res.status(401).json({
          message: 'Invalid credentials',
          debug: { providedEmail: email, usersCount: users.length }
        });
      }
    });

    // Auth middleware for protected routes
    server.use(/^(?!\/(auth|public)).*$/, (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ 
            message: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ 
            message: 'Invalid authentication token',
            code: 'INVALID_TOKEN'
          });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
      } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({
          message: 'Authentication failed',
          code: 'AUTH_FAILED',
          error: err.message
        });
      }
    });

    // Custom routes
    server.get('/items/stats', (req, res) => {
      const items = router.db.get('items').value();
      res.json({
        total: items.length,
        lost: items.filter(item => item.type === 'lost').length,
        found: items.filter(item => item.type === 'found').length,
        matched: items.filter(item => item.status === 'matched').length
      });
    });

    server.get('/users/:id/items', (req, res) => {
      const items = router.db.get('items')
        .filter({ userId: parseInt(req.params.id) })
        .value();
      res.json(items);
    });

    // Use default router
    server.use(router);

    // Add this error handling middleware at the end before server.listen
    server.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Add this near the top of your routes
    server.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    server.listen(port, () => {
      console.log(`JSON Server is running on http://localhost:${port}`);
      console.log(`Database loaded with ${router.db.get('users').size().value()} users`);
    }).on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
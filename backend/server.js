const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key';

// Enable CORS - Update to allow both development ports
server.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use default middlewares (CORS, static, etc)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Authentication routes
server.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = router.db.get('users').find({ email, password }).value();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;

    // Set CORS headers explicitly for this route
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Custom routes
server.get('/items/stats', (req, res) => {
  const items = router.db.get('items').value();
  const stats = {
    total: items.length,
    lost: items.filter(item => item.type === 'lost').length,
    found: items.filter(item => item.type === 'found').length,
    matched: items.filter(item => item.status === 'matched').length
  };
  res.json(stats);
});

server.get('/users/:id/items', authMiddleware, (req, res) => {
  const items = router.db.get('items')
    .filter({ userId: parseInt(req.params.id) })
    .value();
  res.json(items);
});

// Protected routes
server.use(/^(?!\/auth).*$/, authMiddleware);

// Use default router
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
}); 
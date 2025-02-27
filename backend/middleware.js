module.exports = (req, res, next) => {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow frontend origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  // Parse JSON body for POST requests
  if (req.method === 'POST' && !req.body) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (body) {
          req.body = JSON.parse(body);
        }
        next();
      } catch (error) {
        res.status(400).json({ message: 'Invalid JSON body' });
      }
    });
    return;
  }

  // Handle root API request
  if (req.method === 'GET' && req.path === '/api') {
    return res.json({
      status: 'API is running',
      endpoints: {
        items: '/api/items',
        users: '/api/users',
        auth: {
          login: '/api/auth/login',
          register: '/api/auth/register'
        }
      }
    });
  }

  // Handle login
  if (req.method === 'POST' && req.path === '/api/auth/login') {
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required'
      });
    }

    const users = require('./db.json').users;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    console.log('Found user:', user);

    if (!user) {
      return res.status(400).json({ 
        message: 'User not found',
        hint: 'Try with email: john@example.com, password: password123'
      });
    }

    if (user.password !== password) {
      return res.status(400).json({ 
        message: 'Invalid password'
      });
    }

    // Remove sensitive data before sending
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      token: 'fake-jwt-token',
      user: userWithoutPassword
    });
    return;
  }

  // Handle register
  if (req.method === 'POST' && req.path === '/api/auth/register') {
    const { email, password, name } = req.body;
    const users = require('./db.json').users;
    
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio: '',
      location: '',
      status: 'online',
      stats: {
        itemsFound: 0,
        itemsLost: 0,
        successfulMatches: 0,
        helpedOthers: 0
      }
    };

    // In a real app, you would save this to the database
    res.status(201).json({
      token: 'fake-jwt-token',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar
      }
    });
    return;
  }

  // Handle 404 for API routes
  if (req.path.startsWith('/api/') && !req.path.match(/^\/api\/(items|users|auth)/)) {
    return res.status(404).json({
      message: `Cannot ${req.method} ${req.path}`,
      availableRoutes: [
        '/api/items',
        '/api/users',
        '/api/auth/login',
        '/api/auth/register'
      ]
    });
  }

  next();
}; 
const jwt = require('jsonwebtoken');

// This middleware function checks if the user has a valid token
const verifyToken = (req, res, next) => {
  // Get the token from the "Authorization" header
  // Format usually looks like: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Extract the actual token string
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user data (like userId) to the request object
    // so we can use it in the next function
    req.user = decoded;
    
    // Move on to the next function (the actual route)
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;

const jwt = require('jsonwebtoken');
const User = require('../User');

const auth = async(req, res, next) => {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).send({ error: 'Not authorized to access this resource' });
  }

  const token = header.replace('Bearer ', '');

  try {
    const data = jwt.verify(token, process.env.JWT_KEY);

    req.user = await User.query().findById(data.id);
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }
}

module.exports = auth;
const jwt = require('jsonwebtoken');
const { readUsers } = require('../utils/db');

const secret = process.env.JWT_SECRET || 'dev_secret';

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token ausente' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, secret);
    const users = await readUsers();
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = { authenticate };

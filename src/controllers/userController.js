const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readUsers, saveUsers } = require('../utils/db');
const { registerSchema, loginSchema, updateSchema } = require('../validators/userValidator');

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
const jwtSecret = process.env.JWT_SECRET || 'dev_secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';


//Cadastro
async function register(req, res) {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const users = await readUsers();
  if (users.some(u => u.email.toLowerCase() === value.email.toLowerCase())) {
    return res.status(409).json({ message: 'Email já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(value.password, saltRounds);
  const newUser = {
    id: uuidv4(),
    name: value.name,
    email: value.email.toLowerCase(),
    passwordHash,
    role: req?.user?.role === 'ADMIN' ? value.role || 'COMMON' : 'COMMON',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  await saveUsers(users);

  const { passwordHash: _, ...publicUser } = newUser;
  res.status(201).json(publicUser);
}

//Login
async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const users = await readUsers();
  const user = users.find(u => u.email === value.email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(value.password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

//Listar
async function listUsers(req, res) {
  const users = await readUsers();
  const safe = users.map(({ passwordHash, ...u }) => u);
  res.json(safe);
}

//Get user
async function getUser(req, res) {
  const { id } = req.params;
  const users = await readUsers();
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  if (req.user.role !== 'ADMIN' && req.user.id !== id) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { passwordHash, ...safe } = user;
  res.json(safe);
}

//Atualizar
async function updateUser(req, res) {
  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { id } = req.params;
  const users = await readUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Usuário não encontrado' });

  if (req.user.role !== 'ADMIN' && req.user.id !== id) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  if (value.email) {
    const conflict = users.some(u => u.email === value.email.toLowerCase() && u.id !== id);
    if (conflict) return res.status(409).json({ message: 'Email já em uso' });
    users[idx].email = value.email.toLowerCase();
  }
  if (value.name) users[idx].name = value.name;
  if (value.role && req.user.role === 'ADMIN') users[idx].role = value.role;
  if (value.password) {
    users[idx].passwordHash = await bcrypt.hash(value.password, saltRounds);
  }

  await saveUsers(users);
  const { passwordHash, ...safe } = users[idx];
  res.json(safe);
}

//Delete
async function deleteUser(req, res) {
  const { id } = req.params;
  const users = await readUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Usuário não encontrado' });

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Somente ADMIN pode deletar' });
  }

  const removed = users.splice(idx, 1)[0];
  await saveUsers(users);
  const { passwordHash, ...safe } = removed;
  res.json({ message: 'Removido', user: safe });
}

module.exports = { register, login, listUsers, getUser, updateUser, deleteUser };

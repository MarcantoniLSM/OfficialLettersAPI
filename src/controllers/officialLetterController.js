const { v4: uuidv4 } = require('uuid');
const { readLetters, saveLetters } = require('../utils/dbLetters');
const { readUsers } = require('../utils/db');
const { createLetterSchema } = require('../validators/officialLetterValidator');

// Criar nova carta
async function createLetter(req, res) {
  const { error, value } = createLetterSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const users = await readUsers();
  const destinationUser = users.find(u => u.id === value.destinationId);
  if (!destinationUser) return res.status(404).json({ message: 'Destinatário não encontrado' });

  const newLetter = {
    id: uuidv4(),
    originId: req.user.id,
    destinationId: value.destinationId,
    subject: value.subject,
    body: value.body,
    createdAt: new Date().toISOString()
  };

  const letters = await readLetters();
  letters.push(newLetter);
  await saveLetters(letters);

  res.status(201).json(newLetter);
}

// Listar cartas criadas pelo usuário (origem)
async function listSent(req, res) {
  const letters = await readLetters();
  const sent = letters.filter(l => l.originId === req.user.id);
  res.json(sent);
}

// Listar cartas recebidas pelo usuário (destino)
async function listReceived(req, res) {
  const letters = await readLetters();
  const received = letters.filter(l => l.destinationId === req.user.id);
  res.json(received);
}

// Listar todas (ADMIN)
async function listAll(req, res) {
  const letters = await readLetters();
  res.json(letters);
}

module.exports = { createLetter, listSent, listReceived, listAll };

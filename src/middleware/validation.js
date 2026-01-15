export const validateUser = (req, res, next) => {
  const { name, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string válida' });
  }

  if (name.length > 100) {
    return res.status(400).json({ error: 'Nome deve ter no máximo 100 caracteres' });
  }

  if (!role || !['teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Role deve ser "teacher" ou "student"' });
  }

  next();
};

export const validateQuestion = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Título é obrigatório e deve ser uma string válida' });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: 'Título deve ter no máximo 200 caracteres' });
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ error: 'Descrição é obrigatória e deve ser uma string válida' });
  }

  next();
};

export const validateAnswer = (req, res, next) => {
  const { answer } = req.body;

  if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
    return res.status(400).json({ error: 'Resposta é obrigatória e deve ser uma string válida' });
  }

  next();
};

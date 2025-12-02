import jwt from 'jsonwebtoken';

// Middleware de autenticação
const authenticateUser = (req, res, next) => {
  try {
    // Pegar o token do header Authorization
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar dados do usuário na requisição
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export default authenticateUser;
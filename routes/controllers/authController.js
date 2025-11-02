// Funções de placeholder para 'register' e 'login'
// Elas não fazem nada, mas impedem o servidor de quebrar.
// Você pode implementar a lógica real de login (com Prisma, bcrypt, JWT) aqui depois.

export const register = (req, res) => {
  console.log('Recebida requisição /register');
  res.status(201).json({ message: 'Usuário registrado (placeholder)' });
};

export const login = (req, res) => {
  console.log('Recebida requisição /login');
  res.status(200).json({ token: 'seu.token.falso.jwt.aqui', userId: '12345' });
};
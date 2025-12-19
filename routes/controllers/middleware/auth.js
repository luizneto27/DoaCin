//um middleware responsável por autenticar requisições protegidas usando JWT. Ele extrai o token do header Authorization, verifica sua assinatura com a chave secreta (JWT_SECRET) e, em caso de sucesso, anexa informações do usuário (req.userData) para uso pelos controllers seguintes; caso contrário, responde com 401.

import jwt from 'jsonwebtoken'; // importa a biblioteca jsonwebtoken para verificar e decodificar tokens JWT

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // extrai o token do header Authorization, dividindo a string "Bearer <token>" e pegando a segunda parte
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // verifica o token usando a chave secreta do ambiente 
    req.user = { userId: decodedToken.userId }; // insere os dados do usuário decodificados (userId) no objeto req para que controllers subsequentes o utilizem
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error.message);
    res.status(401).json({ message: 'Autenticação falhou. Token inválido ou expirado.' });
  }
};


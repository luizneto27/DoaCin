//um middleware responsável por autenticar requisições protegidas usando JWT. Ele extrai o token do header Authorization, verifica sua assinatura com a chave secreta (JWT_SECRET) e, em caso de sucesso, anexa informações do usuário (req.userData) para uso pelos controllers seguintes; caso contrário, responde com 401.

import jwt from 'jsonwebtoken'; // importa a biblioteca jsonwebtoken para verificar e decodificar tokens JWT

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // extrai o token do header Authorization, dividindo a string "Bearer <token>" e pegando a segunda parte
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // verifica o token usando a chave secreta do ambiente 
    req.userData = { userId: decodedToken.userId }; // insere os dados do usuário decodificados (userId) no objeto req para que controllers subsequentes o utilizem
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token não fornecido', error });
  }
};

// melhorias praticas que se aplicam a este arquivo:
  // 1. Melhorar mensagens de erro: Evitar retornar o objeto de erro completo ao cliente por razões de segurança. Em vez disso, retornar uma mensagem genérica como "Autenticação falhou" e logar o erro detalhado no servidor.

  // 2. Padronizar req.user vs req.userData: Usar um nome consistente como req.user para armazenar dados do usuário autenticado, alinhando-se com convenções comuns.


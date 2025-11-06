import { PrismaClient } from '@prisma/client'; // Importe o Prisma
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

//registrar um novo usuário
export const register = async (req, res) => {
  const { nome, email, password, cpf } = req.body;

  try {
    //verificar se o usuário já existe (por email ou cpf)
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: email }, { cpf: cpf }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email ou CPF já cadastrado.' });
    }

    //criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 12);

    //criar o usuário no banco
    const user = await prisma.user.create({
      data: {
        nome: nome,
        email: email,
        cpf: cpf,
        password: hashedPassword
        //adicione outros campos do schema.prisma se necessário
      }
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

//fazer login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    //comparar a senha
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    //criar o token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET, //segredo do .env
      { expiresIn: '1h' } //duracao do token
    );

    //enviar a resposta
    res.status(200).json({
      token: token,
      userId: user.id
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};
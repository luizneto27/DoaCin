import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';
const { syncCapibas } = require('../../services/userSyncService.js');

const prisma = new PrismaClient();

//registrar um novo usuário
export const register = async (req, res) => {
  const { nome, email, password, cpf } = req.body;

  try {
    //verificar existencia do user por email ou cpf
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [{ email: email }, { cpf: cpf }]
      }
    });

    if (existingUser) { // se ja existir, retorna message
      return res.status(400).json({ message: 'Email ou CPF já cadastrado.' });
    }

    //criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 12); // aumentar os rounds (cost) torna ataques de força bruta muito mais custosos para o atacante, porque cada tentativa exige mais tempo CPU. Também aumenta o tempo de autenticação/registro no seu servidor. Um cost muito alto pode degradar a experiência do usuário ou permitir DoS (ataques que exauram CPU).

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
        // busca o usuario pelo email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // se o usuario nao existir ou a senha estiver incorreta, retorna erro
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // gera o token de acesso
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Sincroniza o saldo de capibas usando o serviço
        try {
            await syncCapibas(user.id, accessToken);
        } catch (error) {
            // Loga o erro mas não impede o login, pois a autenticação principal foi bem-sucedida.
            console.error('Falha ao sincronizar saldo do Conecta durante o login:', error.message);
        }


        // retorna o token de acesso
        res.json({ accessToken });

    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// melhorias que se aplicam a esse arquivo:

  // 1. Normalizacao de email(lowercase)

  // 2. Tratar Unique Contraint do DB: Adicionar constraints unique no schema.prisma (email e cpf) e tratar erro Prisma P2002 para retornar 409 Conflict com mensagem apropriada.

  // 3. UX do registro: Enviar e-mail de verificação antes de ativar conta; evitar que usuários usem a aplicação sem confirmar e-mail.
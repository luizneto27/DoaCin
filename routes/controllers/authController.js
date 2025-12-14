import prisma from "../../config/database.js";
import bcrypt from "bcryptjs"; // hash de senha
import jwt from "jsonwebtoken";

//registrar um novo usuário
export const register = async (req, res) => {
  const { nome, email, password, cpf } = req.body;

  try {
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();

    //verificar existencia do user por email ou cpf
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { cpf: cpf }],
      },
    });

    if (existingUser) {
      // se ja existir, retorna message
      return res.status(400).json({ message: "Email ou CPF já cadastrado." });
    }

    //criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 12); // aumentar os rounds (cost) torna ataques de força bruta muito mais custosos para o atacante, porque cada tentativa exige mais tempo CPU. Também aumenta o tempo de autenticação/registro no seu servidor. Um cost muito alto pode degradar a experiência do usuário ou permitir DoS (ataques que exauram CPU).

    //criar o usuário no banco
    const user = await prisma.user.create({
      data: {
        nome: nome,
        email: normalizedEmail,
        cpf: cpf,
        password: hashedPassword,
        //adicione outros campos do schema.prisma se necessário
      },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao registrar usuário", error: error.message });
  }
};

//fazer login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();

    //buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos." });
    }

    //comparar a senha
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email ou senha inválidos." });
    }

    // Gerar token JWT
    const jwtSecret = process.env.JWT_SECRET || "change_this_secret";
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    // Remover senha antes de retornar o usuário
    const { password: _pwd, ...userWithoutPassword } = user;

    return res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }

  // melhorias que se aplicam a esse arquivo:

  // 1. Normalizacao de email(lowercase)

  // 2. Tratar Unique Contraint do DB: Adicionar constraints unique no schema.prisma (email e cpf) e tratar erro Prisma P2002 para retornar 409 Conflict com mensagem apropriada.

  // 3. UX do registro: Enviar e-mail de verificação antes de ativar conta; evitar que usuários usem a aplicação sem confirmar e-mail.
};

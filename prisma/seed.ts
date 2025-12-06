import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seed pra hemocentros
  const gsh = await prisma.pontoColeta.upsert({
    where: { id: "2ee9eec8-9199-4875-ab60-72e3448eea2c" },
    update: {},
    create: {
      id: "2ee9eec8-9199-4875-ab60-72e3448eea2c",
      nome: "GSH",
      email: "https://www.doesanguedoevida.com.br/banco-de-sangue-hemato",
      telefone: "(81) 3972-4050",
      endereco: "R. Dom Bôsco, 723 - Boa Vista, Recife - PE, 50070-070",
      latitude: -8.058549720722718,
      longitude: -3488905908948004,
      linkMaps: "https://maps.app.goo.gl/X6yhVQ3HufZ2CWm17",
      horarioAbertura: "07:00",
      horarioFechamento: "18:00",
      tipo: "fixed",
    },
  });

  const hemope = await prisma.pontoColeta.upsert({
    where: { id: "32ae187a-a165-4725-bda2-95a8c63438f4" },
    update: {},
    create: {
      id: "32ae187a-a165-4725-bda2-95a8c63438f4",
      nome: "Hemope",
      email: "http://www.hemope.pe.gov.br/",
      telefone: "(81) 3182-4600",
      endereco: "R. Joaquim Nabuco, 171 - Graças, Recife - PE, 52011-000",
      latitude: -8.052652639117525,
      longitude: -34897124021968060,
      linkMaps: "https://maps.app.goo.gl/NAfxcfqxZToYH8QA7",
      horarioAbertura: "07:15",
      horarioFechamento: "18:30",
      tipo: "fixed",
    },
  });

  const ihene = await prisma.pontoColeta.upsert({
    where: { id: "56608a03-ef2c-4012-a7c2-8c52099f4443" },
    update: {},
    create: {
      id: "56608a03-ef2c-4012-a7c2-8c52099f4443",
      nome: "IHENE",
      email: "https://ihene.com.br/",
      telefone: "(81) 2138-3500",
      endereco: "R. Tabira, 54 - Boa Vista, Recife - PE, 50050-330",
      latitude: -8.048850945777147,
      longitude: -3488651096902654,
      linkMaps: "https://maps.app.goo.gl/AnCQvBYXQLUC8GAh7",
      horarioAbertura: "08:00",
      horarioFechamento: "18:00",
      tipo: "fixed",
    },
  });

  const usuarioAdmin = await prisma.user.upsert({
    where: { cpf: "000.000.000-00" },
    update: {},
    create: {
      nome: "Admin",
      email: "teste@gmail.com",
      cpf: "000.000.000-00",
      password: "$2a$12$uiMMFXhkz2IgxoGya7JyQuxxqE41fgy48MQtzAsVG49e9OyNHj9bu",
    },
  });

  console.log({ gsh, hemope, ihene, usuarioAdmin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

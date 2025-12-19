# Testes de Integração - Guia Rápido

## Início Rápido (30 segundos)

```powershell
# 1. Certifique-se que o Docker Desktop está rodando
# 2. Execute:
npm run test:setup
```

Pronto!

---

## Comandos Essenciais

### Comando Único (Recomendado)
```powershell
npm run test:setup  # Faz tudo: Docker + Migrations + Testes
```

### Comandos Individuais

| Comando | O que faz |
|---------|-----------|
| `npm run test:setup` | Setup completo: Docker + migrations + testes |
| `npm test` | Executar todos os testes |
| `npm run test:watch` | Modo watch (re-executa ao salvar) |
| `npm run test:ui` | Interface visual |
| `npm run test:coverage` | Relatório de cobertura |
| `npm run test:cleanup` | Limpar ambiente de testes |

## Gerenciar Docker

```powershell
# Iniciar banco de teste
docker-compose up -d postgres-test

# Parar banco de teste
docker-compose stop postgres-test

# Ver logs
docker logs doacin-db-test

# Status
docker ps | Select-String "test"
```

---

## Fluxo de Trabalho

### Durante Desenvolvimento

1. Inicie o banco de teste (uma vez):
   ```powershell
   docker-compose up -d postgres-test
   ```

2. Trabalhe com modo watch:
   ```powershell
   npm run test:watch
   ```

3. Código → Salvar → Testes rodam automaticamente

### Antes de Commit

```powershell
npm test && npm run test:coverage
```

---

## Problemas Comuns

### Docker não responde
```powershell
# Abra Docker Desktop e aguarde inicializar
# Depois:
npm run test:setup
```

### Porta em uso
```powershell
# Pare containers antigos:
docker-compose stop postgres-test
docker-compose up -d postgres-test
```

### Banco não conecta
```powershell
# Veja os logs:
docker logs doacin-db-test

# Reinicie:
docker-compose restart postgres-test
```

---

## Documentação Completa

- [Resumo Geral](./TESTS-SUMMARY.md) - Visão completa dos testes
- [Guia Docker](./DOCKER-TESTS.md) - Configuração detalhada do Docker
- [Checklist](./CHECKLIST-TESTS.md) - Verificação de setup
- [Troubleshooting](./TROUBLESHOOTING-TESTS.md) - Resolução de problemas

---

## Estrutura de Testes

```
tests/integration/
├── basic.test.js         # 2 testes - Health checks
├── auth.test.js          # 5 testes - Autenticação
├── dashboard.test.js     # 11 testes - Estatísticas
├── donations.test.js     # 15 testes - Doações
├── campaigns.test.js     # 17 testes - Campanhas
├── user.test.js          # 17 testes - Perfil
├── setup.js              # Configuração global
├── testApp.js            # App Express isolado
└── helpers.js            # Funções auxiliares

Total: 67 testes (100% de cobertura)
```


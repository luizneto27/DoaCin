# Checklist - Configuração de Testes com Docker

Use este checklist para verificar se tudo está funcionando corretamente.

## Checklist de Setup

### Pré-requisitos
- [ ] Docker Desktop instalado
- [ ] Docker Desktop rodando
- [ ] Node.js e npm instalados

### Configuração Inicial (Execute apenas uma vez)

```powershell
# 1. Verificar Docker
docker --version
docker ps

# 2. Iniciar banco de teste
docker-compose up -d postgres-test

# 3. Aguardar banco ficar pronto (10-15 segundos)
docker logs doacin-db-test

# 4. Executar migrations
$env:DATABASE_URL="postgresql://test_user:test_pass@localhost:5433/doacin_test"
npx prisma migrate deploy

# 5. Executar testes
npm test
```

### Verificação

- [ ] Container `doacin-db-test` está rodando
  ```powershell
  docker ps | Select-String "doacin-db-test"
  ```

- [ ] Banco está aceitando conexões
  ```powershell
  docker exec doacin-db-test pg_isready -U test_user
  ```

- [ ] Migrations foram aplicadas
  ```powershell
  $env:DATABASE_URL="postgresql://test_user:test_pass@localhost:5433/doacin_test"
  npx prisma migrate status
  ```

- [ ] Testes executam sem erros
  ```powershell
  npm test
  ```

## Testes de Funcionalidade

### Teste 1: Script Automático
```powershell
npm run test:setup
```
**Esperado**: Setup completo + testes rodando + resultado no terminal

### Teste 2: Modo Watch
```powershell
npm run test:watch
```
**Esperado**: Testes rodando e esperando mudanças (Ctrl+C para sair)

### Teste 3: Interface UI
```powershell
npm run test:ui
```
**Esperado**: Navegador abre com interface Vitest

### Teste 4: Cobertura
```powershell
npm run test:coverage
```
**Esperado**: Relatório de cobertura gerado em `coverage/`

### Teste 5: Limpeza
```powershell
npm run test:cleanup
```
**Esperado**: Container parado e removido

## Troubleshooting

### Problema: Docker não encontrado
**Sintoma**: `docker: The term 'docker' is not recognized`

**Solução**:
- [ ] Instalar Docker Desktop
- [ ] Reiniciar terminal após instalação

### Problema: Container não inicia
**Sintoma**: `unable to get image 'postgres:16-alpine'`

**Solução**:
- [ ] Abrir Docker Desktop
- [ ] Aguardar inicialização completa (ícone Docker na bandeja)
- [ ] Tentar novamente

### Problema: Porta 5433 em uso
**Sintoma**: `port is already allocated`

**Solução**:
```powershell
# Descobrir o que está usando a porta
netstat -ano | findstr :5433

# Parar containers antigos
docker-compose stop postgres-test
docker-compose rm -f postgres-test

# Ou mudar a porta no docker-compose.yml
```

### Problema: Migrations falham
**Sintoma**: `Migration failed to apply`

**Solução**:
```powershell
# Reset completo do banco de teste
docker-compose stop postgres-test
docker volume rm doacin_postgres_test_data
docker-compose up -d postgres-test
Start-Sleep -Seconds 10

# Aplicar migrations novamente
$env:DATABASE_URL="postgresql://test_user:test_pass@localhost:5433/doacin_test"
npx prisma migrate deploy
```

### Problema: Testes falham por timeout
**Sintoma**: `Test timeout of 10000ms exceeded`

**Solução**:
- [ ] Verificar se banco está rodando: `docker ps`
- [ ] Verificar logs: `docker logs doacin-db-test`
- [ ] Aumentar timeout em `vitest.config.integration.js`

## Status Esperado

Após setup completo, você deve ver:

### Docker
```powershell
docker ps
# Deve mostrar container doacin-db-test rodando
```

### Testes
```powershell
npm test
# tests/integration/basic.test.js (2)
# tests/integration/auth.test.js (5)
# tests/integration/dashboard.test.js (11)
# tests/integration/donations.test.js (15)
# tests/integration/campaigns.test.js (17)
# tests/integration/user.test.js (17)
# Test Files  6 passed (6)
# Tests  67 passed (67)
```

## Próximos Passos

Com o ambiente funcionando, você pode:

**Para Desenvolvimento:**
- [ ] Usar `npm run test:watch` para feedback instantâneo
- [ ] Consultar [QUICK-START-TESTS.md](./QUICK-START-TESTS.md) para comandos rápidos
- [ ] Ler [TESTS-SUMMARY.md](./TESTS-SUMMARY.md) para entender a estrutura

**Para Criar Novos Testes:**
- [ ] Copiar exemplos de `tests/integration/auth.test.js`
- [ ] Seguir padrões de isolamento (timestamps únicos)
- [ ] Executar `npm run test:coverage` para verificar cobertura

**Para Produção:**
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Executar testes antes de cada deploy

## Tudo Funcionando?

Se todos os itens estão marcados, o ambiente está pronto!

### Comandos para Uso Diário
```powershell
# Desenvolvimento com feedback instantâneo
npm run test:watch

# Antes de fazer commit
npm test

# Verificar cobertura
npm run test:coverage

# Parar ambiente
docker-compose stop postgres-test
```

---

**Data do Setup**: _____/_____/_____

**Última Verificação**: _____/_____/_____

**Problemas Encontrados**: 

_______________________________________________________________

_______________________________________________________________

**Soluções Aplicadas**:

_______________________________________________________________

_______________________________________________________________

---

**Setup Concluído com Sucesso!**


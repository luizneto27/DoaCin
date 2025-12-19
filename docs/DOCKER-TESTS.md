# Docker - Guia Completo para Testes

**Objetivo**: Configurar PostgreSQL isolado via Docker para executar 67 testes de integração sem afetar o banco de produção.

## Pré-requisitos

- Docker Desktop instalado e rodando
- Node.js e npm instalados

## Início Rápido

### Opção 1: Script Automático (Recomendado)

Execute o script que faz tudo automaticamente:

```powershell
npm run test:setup
```

Este script:
1. Verifica se o Docker está rodando
2. Inicia o container PostgreSQL de teste
3. Aguarda o banco ficar pronto
4. Executa as migrations
5. Roda os testes

### Opção 2: Passo a Passo Manual

#### 1. Inicie o Docker Desktop

Certifique-se de que o Docker Desktop está rodando.

#### 2. Inicie o Container de Teste

```powershell
docker-compose up -d postgres-test
```

#### 3. Aguarde o Banco Ficar Pronto

```powershell
# Verifica se está pronto
docker exec doacin-db-test pg_isready -U test_user
```

#### 4. Execute as Migrations

```powershell
$env:DATABASE_URL="postgresql://test_user:test_pass@localhost:5433/doacin_test"
npx prisma migrate deploy
```

#### 5. Execute os Testes

```powershell
npm test
```

## Comandos de Teste Disponíveis

```powershell
# Executar todos os testes uma vez
npm test

# Executar em modo watch (re-executa ao salvar)
npm run test:watch

# Abrir interface UI do Vitest
npm run test:ui

# Executar com cobertura de código
npm run test:coverage

# Setup completo (Docker + migrations + testes)
npm run test:setup

# Limpar ambiente de testes
npm run test:cleanup
```

## Configuração

### Banco de Dados de Teste

O container PostgreSQL para testes tem:

- **Container**: `doacin-db-test`
- **Porta**: `5433` (não conflita com banco principal na 5432)
- **Database**: `doacin_test`
- **Usuário**: `test_user`
- **Senha**: `test_pass`

### Variáveis de Ambiente

As configurações estão em `.env.test`:

```env
DATABASE_URL="postgresql://test_user:test_pass@localhost:5433/doacin_test"
JWT_SECRET="test-secret-key-change-in-production"
NODE_ENV=test
PORT=3001
```

## Troubleshooting

### Docker não está rodando

**Erro**: `error during connect: ... dockerDesktopLinuxEngine`

**Solução**:
1. Abra o Docker Desktop
2. Aguarde ele inicializar completamente
3. Execute novamente: `npm run test:setup`

### Container já existe

**Erro**: `container name ... already in use`

**Solução**:
```powershell
docker-compose stop postgres-test
docker-compose rm -f postgres-test
docker-compose up -d postgres-test
```

### Porta 5433 em uso

**Erro**: `port is already allocated`

**Solução**: Altere a porta no `docker-compose.yml`:
```yaml
ports:
  - "5434:5432"  # Mude 5433 para 5434 (ou outra porta livre)
```

E atualize `.env.test`:
```env
DATABASE_URL="postgresql://test_user:test_pass@localhost:5434/doacin_test"
```

### Erro de conexão com banco

**Erro**: `Can't reach database server`

**Solução**:
1. Verifique se o container está rodando:
   ```powershell
   docker ps | Select-String "doacin-db-test"
   ```

2. Veja os logs do container:
   ```powershell
   docker logs doacin-db-test
   ```

3. Reinicie o container:
   ```powershell
   docker-compose restart postgres-test
   ```

### Migrations falharam

**Erro**: `Migration failed`

**Solução**:
1. Resetar o banco de teste:
   ```powershell
   docker-compose stop postgres-test
   docker volume rm doacin_postgres_test_data
   docker-compose up -d postgres-test
   ```

2. Aguardar e executar migrations novamente:
   ```powershell
   Start-Sleep -Seconds 10
   $env:DATABASE_URL="postgresql://test_user:test_pass@localhost:5433/doacin_test"
   npx prisma migrate deploy
   ```

## Limpeza

### Parar o Container

```powershell
docker-compose stop postgres-test
```

### Remover Container e Dados

```powershell
npm run test:cleanup
```

Ou manualmente:

```powershell
docker-compose stop postgres-test
docker-compose rm -f postgres-test
docker volume rm doacin_postgres_test_data
```

## Comandos Docker Úteis

```powershell
# Ver containers rodando
docker ps

# Ver logs do banco de teste
docker logs doacin-db-test

# Ver logs em tempo real
docker logs -f doacin-db-test

# Executar comando no container
docker exec -it doacin-db-test psql -U test_user -d doacin_test

# Verificar status do banco
docker exec doacin-db-test pg_isready -U test_user

# Reiniciar container
docker-compose restart postgres-test

# Ver uso de recursos
docker stats doacin-db-test
```

## Fluxo de Trabalho Recomendado

### Desenvolvimento Diário

1. **Inicie o ambiente (primeira vez do dia)**:
   ```powershell
   docker-compose up -d postgres-test
   ```

2. **Desenvolva e teste em modo watch**:
   ```powershell
   npm run test:watch
   ```

3. **Ao finalizar, pare o container**:
   ```powershell
   docker-compose stop postgres-test
   ```

### Antes de Commit

1. **Execute todos os testes**:
   ```powershell
   npm test
   ```

2. **Verifique cobertura**:
   ```powershell
   npm run test:coverage
   ```

### CI/CD

No pipeline de CI (GitHub Actions, etc.), use:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_pass
      POSTGRES_DB: doacin_test
    ports:
      - 5433:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5

steps:
  - run: npm ci
  - run: npx prisma migrate deploy
    env:
      DATABASE_URL: postgresql://test_user:test_pass@localhost:5433/doacin_test
  - run: npm test
```

## Dicas

- O banco de teste é **isolado** do banco de desenvolvimento
- Os testes **limpam** o banco automaticamente antes/depois de executar
- Use **test:watch** durante desenvolvimento para feedback instantâneo
- Use **test:ui** para uma interface visual dos testes
- Execute **test:coverage** para ver partes não testadas do código

## Estatísticas dos Testes

- **Total de Testes**: 67
- **Arquivos de Teste**: 6
- **Tempo de Execução**: ~3.6 segundos
- **Taxa de Sucesso**: 100%
- **Endpoints Cobertos**: 9 (100% da API)

---

## Links Úteis

- [Documentação Vitest](https://vitest.dev/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

**Problemas?** Consulte a seção de troubleshooting acima ou abra uma issue.

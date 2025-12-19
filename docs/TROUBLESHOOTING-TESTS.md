# Troubleshooting - Problemas Comuns e Soluções

**Objetivo**: Resolver rapidamente problemas comuns ao executar testes de integração.

---

## Problema: Prisma não encontrava DATABASE_URL

### Sintomas
```
PrismaClientInitializationError: Error validating datasource `db`: 
the URL must start with the protocol `postgresql://` or `postgres://`
```

### Causa Raiz
O arquivo `.env` na raiz do projeto era carregado ANTES do `.env.test`, fazendo com que o Prisma tentasse usar o banco de produção (porta 5432) ao invés do banco de testes (porta 5433).

### Solução Implementada

Definir a `DATABASE_URL` diretamente no script npm usando `cross-env`:

```json
{
  "scripts": {
    "test": "cross-env DATABASE_URL=postgresql://test_user:test_pass@localhost:5433/doacin_test vitest run --config vitest.config.integration.js"
  }
}
```

### Por que funciona?

1. **Prioridade de variáveis de ambiente**: Variáveis definidas diretamente no comando têm prioridade sobre arquivos `.env`
2. **Multiplataforma**: O `cross-env` funciona tanto no Windows quanto Linux/Mac
3. **Isolamento**: Garante que os testes sempre usam o banco correto

### Configurações dos Arquivos

#### vitest.config.integration.js
```javascript
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega .env.test ANTES de configurar qualquer coisa
dotenv.config({ path: resolve(__dirname, '.env.test') });

export default defineConfig({
  test: {
    name: 'integration',
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/integration/setup.js'],
    include: ['tests/integration/**/*.test.js'],
    testTimeout: 10000,
    hookTimeout: 10000,
    env: {
      // Fallback se DATABASE_URL não estiver definida
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://test_user:test_pass@localhost:5433/doacin_test',
    },
  },
});
```

#### tests/integration/setup.js
```javascript
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente ANTES de importar Prisma
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// Importação dinâmica do Prisma DEPOIS de configurar as variáveis
const { PrismaClient } = await import('@prisma/client');

// Instância global do Prisma para testes - com URL explícita como fallback
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://test_user:test_pass@localhost:5433/doacin_test',
    },
  },
});
```

### Checklist de Verificação

Se os testes não estiverem funcionando:

- [ ] Docker está rodando? (`docker ps`)
- [ ] Container de teste está ativo? (`docker ps | grep doacin-db-test`)
- [ ] Banco está aceitando conexões? (`docker exec doacin-db-test pg_isready`)
- [ ] DATABASE_URL está correta no comando npm?
- [ ] cross-env está instalado? (`npm list cross-env`)
- [ ] Migrations foram aplicadas? (`npm run test:setup`)

### Comandos Úteis

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Ver cobertura de testes
npm run test:coverage

# Interface visual dos testes
npm run test:ui

# Setup completo (inicia Docker, migrations e testes)
npm run test:setup

# Limpar ambiente de testes
npm run test:cleanup
```

## Outros Problemas Comuns

### Teste falha: "expected {...} to not have property 'password'"

**Causa**: O banco de dados armazena a senha criptografada (hash bcrypt).

**Solução**: Verificar se a senha está criptografada, não se a propriedade existe:

```javascript
// Errado
expect(userInDb).not.toHaveProperty('password');

// Correto
expect(userInDb.password).toMatch(/^\$2[aby]\$/);
expect(userInDb.password).not.toBe(plainPassword);
```

### Porta 5433 já está em uso

**Solução**: Parar o container e remover:

```bash
npm run test:cleanup
```

### Migrations não aplicam

**Causa**: Banco pode estar com schema desatualizado.

**Solução**: Reset do banco de testes:

```bash
npm run test:cleanup
npm run test:setup
```

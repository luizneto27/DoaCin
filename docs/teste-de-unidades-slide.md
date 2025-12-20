# Teste de Unidades Slide

## Passo a Passo para Criar um Slide de Apresentação de Teste de Unidade

### 1. **Preparar o Ambiente de Apresentação**
   - Abra o VS Code no projeto DoaCin.
   - Certifique-se de que as dependências estão instaladas: `npm install`.
   - Abra o terminal integrado do VS Code (Ctrl + `).
   - Execute `npm run test:unit` para verificar se os testes passam (deve mostrar "3 passed" no terminal).

### 2. **Criar o Slide no PowerPoint ou Google Slides**
   - **Título do Slide**: "Testes de Unidade no DoaCin - Exemplo: Registro de Usuário"
   - **Conteúdo Principal**:
     - **Objetivo**: Demonstrar isolamento e rapidez dos testes unitários.
     - **Código do Teste**: Mostre um snippet do arquivo `tests/unit/authController.test.js` (ex.: o teste "deve registrar um usuário com sucesso").
     - **Execução**: Inclua uma captura de tela ou animação do terminal executando `npm run test:unit`.
     - **Resultado Esperado**: "3 passed" em verde, destacando que não há dependências externas (DB/API).

### 3. **Demonstrar Durante a Apresentação**
   - **Passo 1**: Mostre a estrutura do projeto (pasta `tests/unit/`).
   - **Passo 2**: Abra o arquivo `tests/unit/authController.test.js` no editor e explique o mock do Prisma (usando `vi.mock`).
   - **Passo 3**: Execute `npm run test:unit` no terminal ao vivo.
   - **Passo 4**: Destaque o resultado: "Testes unitários são rápidos (~1-2 segundos) e isolados, diferentemente dos de integração que precisam de DB real."

### 4. **Elementos Visuais para o Slide**
   - **Antes/Depois**: Compare com testes de integração (ex.: `npm run test` que leva mais tempo e usa Docker).
   - **Benefícios**: Liste "Isolamento", "Rapidez", "Facilita Refatoração".
   - **Exemplo de Código**:
     ```javascript
     it('deve registrar um usuário com sucesso', async () => {
       // Arrange
       const req = {
         body: {
           nome: 'João Silva',
           email: 'joao@example.com',
           cpf: '12345678901',
           password: 'senha123',
         },
       };
       const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
       };

       // Mocks
       prisma.user.findFirst.mockResolvedValue(null); // Usuário não existe
       bcrypt.hash.mockResolvedValue('hashedPassword');
       prisma.user.create.mockResolvedValue({
         id: '1',
         nome: 'João Silva',
         email: 'joao@example.com',
         cpf: '12345678901',
         password: 'hashedPassword',
       });

       // Act
       await register(req, res);

       // Assert
       expect(res.status).toHaveBeenCalledWith(201);
       expect(res.json).toHaveBeenCalledWith({ message: 'Usuário registrado com sucesso!' });
     });
     ```
   - **Captura de Tela**: Inclua uma imagem do terminal com output como:
     ```
     ✓ deve registrar um usuário com sucesso
     ✓ deve retornar erro se usuário já existe
     ✓ deve retornar erro 500 em caso de falha
     3 passed (0.5s)
     ```
     *(Adicione aqui uma captura de tela real do terminal após executar `npm run test:unit`)*

### 5. **Dicas para Apresentação**
   - **Tempo**: 2-3 minutos por slide.
   - **Interatividade**: Peça ao público se sabem a diferença entre unitários e integração.
   - **Transição**: "Agora que vimos testes unitários isolados, vamos aos de integração que testam o sistema completo."</content>
<parameter name="filePath">c:\Users\Luan Silva\Documents\GitHub\DoaCin\docs\teste-de-unidades-slide.md
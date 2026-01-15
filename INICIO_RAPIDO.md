# ⚡ Início Rápido - Backend Teacher App

## 🚀 Passos para Iniciar o Backend

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar .env
Crie um arquivo `.env` na raiz do projeto:
```env
SUPABASE_KEY=sua_chave_supabase_aqui
PORT=3001
```

**Onde encontrar a SUPABASE_KEY:**
- Supabase Dashboard → Settings → API → "anon" key

### 3. Iniciar Servidor
```bash
npm start
```

### 4. Verificar Funcionamento
Acesse: `http://localhost:3001/health`

## 📚 Endpoints Principais

- `POST /api/users` - Criar usuário
- `GET /api/questions` - Listar perguntas
- `POST /api/questions` - Criar pergunta (teacher)
- `GET /api/questions/:id/answers` - Listar respostas
- `POST /api/questions/:id/answers` - Criar resposta (student)

## 🧪 Testar
```bash
node test-api.js
```

## 📖 Documentação Completa
Veja `README.md` e `INTEGRACAO_FRONTEND.md` para mais detalhes.

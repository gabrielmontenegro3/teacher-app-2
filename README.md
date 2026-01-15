# Teacher App - Backend API

Backend REST API para aplicação de perguntas e respostas entre professores e alunos, desenvolvido com Node.js, Express e Supabase.

## 📋 Funcionalidades

- ✅ Criação de usuários (professores e alunos)
- ✅ Criação de perguntas (apenas professores)
- ✅ Respostas a perguntas (apenas alunos)
- ✅ Listagem de perguntas e respostas
- ✅ Validação de dados e tratamento de erros
- ✅ Integração com Supabase (PostgreSQL)

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Conta no Supabase com banco de dados configurado
- Chave de API do Supabase

### Passos para Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto
   - Copie o conteúdo de `.env.example` e preencha com suas credenciais:

```env
SUPABASE_KEY=sua_chave_supabase_aqui
PORT=3001
```

3. **Iniciar o servidor:**
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

## 📚 Estrutura do Banco de Dados

O banco de dados já deve estar criado no Supabase com as seguintes tabelas:

### Tabela `users`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL)
- `role` (VARCHAR(20) NOT NULL) - valores: 'teacher' ou 'student'
- `created_at` (TIMESTAMP)

### Tabela `questions`
- `id` (SERIAL PRIMARY KEY)
- `teacher_id` (INTEGER NOT NULL) - FK para users(id)
- `title` (VARCHAR(200) NOT NULL)
- `description` (TEXT NOT NULL)
- `created_at` (TIMESTAMP)

### Tabela `answers`
- `id` (SERIAL PRIMARY KEY)
- `question_id` (INTEGER NOT NULL) - FK para questions(id)
- `student_id` (INTEGER NOT NULL) - FK para users(id)
- `answer` (TEXT NOT NULL)
- `created_at` (TIMESTAMP)

## 🔌 Endpoints da API

### Base URL
```
http://localhost:3001/api
```

### 1. Usuários

#### Criar Usuário
```http
POST /api/users
Content-Type: application/json

{
  "name": "Nome do Usuário",
  "role": "teacher" | "student"
}
```

**Resposta de sucesso (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "role": "teacher",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Buscar Usuário por ID
```http
GET /api/users/:id
```

**Resposta de sucesso (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "role": "teacher",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Perguntas

#### Criar Pergunta (apenas professores)
```http
POST /api/questions
Content-Type: application/json

{
  "teacher_id": 1,
  "title": "Título da Pergunta",
  "description": "Descrição detalhada da pergunta"
}
```

**Resposta de sucesso (201):**
```json
{
  "message": "Pergunta criada com sucesso",
  "question": {
    "id": 1,
    "teacher_id": 1,
    "title": "Título da Pergunta",
    "description": "Descrição detalhada da pergunta",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Listar Todas as Perguntas
```http
GET /api/questions
```

**Resposta de sucesso (200):**
```json
{
  "questions": [
    {
      "id": 1,
      "teacher_id": 1,
      "title": "Título da Pergunta",
      "description": "Descrição detalhada da pergunta",
      "created_at": "2024-01-01T00:00:00.000Z",
      "teacher": {
        "id": 1,
        "name": "Professor João",
        "role": "teacher"
      }
    }
  ]
}
```

#### Buscar Pergunta por ID
```http
GET /api/questions/:id
```

**Resposta de sucesso (200):**
```json
{
  "question": {
    "id": 1,
    "teacher_id": 1,
    "title": "Título da Pergunta",
    "description": "Descrição detalhada da pergunta",
    "created_at": "2024-01-01T00:00:00.000Z",
    "teacher": {
      "id": 1,
      "name": "Professor João",
      "role": "teacher"
    }
  }
}
```

### 3. Respostas

#### Criar Resposta (apenas alunos)
```http
POST /api/questions/:question_id/answers
Content-Type: application/json

{
  "student_id": 2,
  "answer": "Texto da resposta do aluno"
}
```

**Resposta de sucesso (201):**
```json
{
  "message": "Resposta criada com sucesso",
  "answer": {
    "id": 1,
    "question_id": 1,
    "student_id": 2,
    "answer": "Texto da resposta do aluno",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Listar Respostas de uma Pergunta
```http
GET /api/questions/:question_id/answers
```

**Resposta de sucesso (200):**
```json
{
  "question_id": 1,
  "answers": [
    {
      "id": 1,
      "question_id": 1,
      "student_id": 2,
      "answer": "Texto da resposta do aluno",
      "created_at": "2024-01-01T00:00:00.000Z",
      "student": {
        "id": 2,
        "name": "Aluno Maria",
        "role": "student"
      }
    }
  ]
}
```

### Health Check
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "message": "Servidor está funcionando"
}
```

## ⚠️ Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação (dados inválidos)
- `403` - Acesso negado (ex: aluno tentando criar pergunta)
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## 🧪 Testando a API

Execute o script de teste (certifique-se de que o servidor está rodando):

```bash
node test-api.js
```

Ou use ferramentas como Postman, Insomnia ou curl para testar os endpoints manualmente.

## 📝 Exemplos de Uso no Frontend

### Criar um Usuário (Tela de Entrada)

```javascript
// Quando o usuário preencher o formulário de entrada
const createUser = async (name, role) => {
  try {
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        role: role // 'teacher' ou 'student'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      // Salvar o ID do usuário (pode usar localStorage, context, etc)
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
      
      // Redirecionar para a tela apropriada
      if (data.user.role === 'teacher') {
        // Redirecionar para tela de professor
      } else {
        // Redirecionar para tela de aluno
      }
    } else {
      console.error('Erro:', data.error);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};
```

### Criar uma Pergunta (Professor)

```javascript
const createQuestion = async (title, description) => {
  const teacherId = parseInt(localStorage.getItem('userId'));
  
  try {
    const response = await fetch('http://localhost:3001/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacher_id: teacherId,
        title: title,
        description: description
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Pergunta criada:', data.question);
      // Atualizar lista de perguntas ou redirecionar
    } else {
      console.error('Erro:', data.error);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};
```

### Listar Perguntas (Aluno)

```javascript
const getQuestions = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/questions');
    const data = await response.json();
    
    if (response.ok) {
      return data.questions; // Array de perguntas
    } else {
      console.error('Erro:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
};
```

### Responder uma Pergunta (Aluno)

```javascript
const createAnswer = async (questionId, answer) => {
  const studentId = parseInt(localStorage.getItem('userId'));
  
  try {
    const response = await fetch(`http://localhost:3001/api/questions/${questionId}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentId,
        answer: answer
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Resposta criada:', data.answer);
      // Atualizar interface ou mostrar mensagem de sucesso
    } else {
      console.error('Erro:', data.error);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};
```

### Listar Respostas de uma Pergunta

```javascript
const getAnswers = async (questionId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/questions/${questionId}/answers`);
    const data = await response.json();
    
    if (response.ok) {
      return data.answers; // Array de respostas
    } else {
      console.error('Erro:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
};
```

## 🔧 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuração do Supabase
│   ├── controllers/
│   │   ├── userController.js    # Lógica de usuários
│   │   ├── questionController.js # Lógica de perguntas
│   │   └── answerController.js  # Lógica de respostas
│   ├── middleware/
│   │   └── validation.js        # Validações de dados
│   ├── routes/
│   │   ├── userRoutes.js        # Rotas de usuários
│   │   ├── questionRoutes.js    # Rotas de perguntas
│   │   └── answerRoutes.js      # Rotas de respostas
│   └── server.js                # Servidor Express
├── .env                         # Variáveis de ambiente (não versionado)
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
├── test-api.js                  # Script de teste
└── README.md                    # Esta documentação
```

## 🐛 Tratamento de Erros

A API retorna mensagens de erro padronizadas:

```json
{
  "error": "Mensagem de erro",
  "details": "Detalhes adicionais (opcional)"
}
```

Exemplos de erros comuns:
- `400`: Dados inválidos (nome vazio, role inválida, etc.)
- `403`: Tentativa de ação não permitida (aluno criando pergunta, etc.)
- `404`: Recurso não encontrado (usuário, pergunta, etc.)
- `500`: Erro interno do servidor

## 📦 Dependências

- `express`: Framework web para Node.js
- `@supabase/supabase-js`: Cliente JavaScript do Supabase
- `cors`: Middleware para habilitar CORS
- `dotenv`: Carregamento de variáveis de ambiente

## 🔐 Segurança

⚠️ **Importante**: Esta é uma API básica sem autenticação. Para produção, considere adicionar:
- Autenticação JWT
- Rate limiting
- Validação mais robusta
- Sanitização de inputs
- HTTPS obrigatório

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se o servidor está rodando
2. Se a variável `SUPABASE_KEY` está configurada corretamente
3. Se o banco de dados está acessível no Supabase
4. Os logs do servidor para mensagens de erro

---

**Desenvolvido para integração com frontend React/Next.js/Vue/etc.**

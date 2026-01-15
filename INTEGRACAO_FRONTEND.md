# 📘 Guia de Integração do Backend com Frontend

Este documento é destinado à IA que está desenvolvendo o frontend. Ele contém todas as informações necessárias para integrar o backend com o frontend.

## 🎯 Visão Geral

O backend está rodando em `http://localhost:3001` (ou na Vercel em produção) e fornece uma API REST para:
- Gerenciamento de usuários (professores e alunos)
- Criação, listagem, edição e exclusão de perguntas (professores)
- Criação, listagem, edição e exclusão de respostas (alunos)

**Funcionalidades de Edição/Exclusão:**
- ✅ Professores podem editar/excluir apenas suas próprias perguntas
- ✅ Alunos podem editar/excluir apenas suas próprias respostas
- ✅ Validação de autorização no backend (segurança garantida)

## 🚀 Como Colocar o Backend em Funcionamento

### Passo 1: Instalar Dependências

No diretório do backend, execute:
```bash
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto backend
2. Adicione a seguinte linha (substitua pela sua chave real do Supabase):
```env
SUPABASE_KEY=sua_chave_supabase_aqui
PORT=3001
```

**Onde encontrar a SUPABASE_KEY:**
- Acesse o painel do Supabase (https://supabase.com/dashboard)
- Selecione seu projeto
- Vá em Settings > API
- Copie a "anon" ou "service_role" key (use a "anon" key para este caso)

### Passo 3: Iniciar o Servidor

Execute no terminal do backend:
```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

Você verá uma mensagem confirmando que o servidor está rodando:
```
🚀 Servidor rodando na porta 3001
📍 Health check: http://localhost:3001/health
📚 API disponível em: http://localhost:3001/api
```

### Passo 4: Verificar se Está Funcionando

Abra no navegador ou faça uma requisição para:
```
http://localhost:3001/health
```

Deve retornar:
```json
{
  "status": "OK",
  "message": "Servidor está funcionando"
}
```

## 🔌 Endpoints Disponíveis

### Base URL
```
http://localhost:3001/api
```

### 1. Criar Usuário (Tela de Entrada)
**POST** `/api/users`

**Body:**
```json
{
  "name": "Nome do Usuário",
  "role": "teacher" | "student"
}
```

**Resposta de Sucesso (201):**
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

**Uso no Frontend:**
- Quando o usuário preencher o formulário de entrada (nome + seleção de role)
- Salvar o `user.id` e `user.role` no localStorage ou state management
- Redirecionar para a tela apropriada baseado no role

### 2. Criar Pergunta (Professor)
**POST** `/api/questions`

**Body:**
```json
{
  "teacher_id": 1,
  "title": "Título da Pergunta",
  "description": "Descrição detalhada"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Pergunta criada com sucesso",
  "question": {
    "id": 1,
    "teacher_id": 1,
    "title": "Título da Pergunta",
    "description": "Descrição detalhada",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Uso no Frontend:**
- Tela do professor com formulário (título + descrição)
- `teacher_id` vem do usuário logado (localStorage/state)
- Após criar, atualizar a lista de perguntas

### 3. Listar Todas as Perguntas
**GET** `/api/questions`

**Resposta de Sucesso (200):**
```json
{
  "questions": [
    {
      "id": 1,
      "teacher_id": 1,
      "title": "Título da Pergunta",
      "description": "Descrição detalhada",
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

**Uso no Frontend:**
- Tela do aluno: mostrar todas as perguntas disponíveis
- Tela do professor: mostrar suas próprias perguntas (filtrar por `teacher_id`)

### 4. Buscar Pergunta Específica
**GET** `/api/questions/:id`

**Resposta de Sucesso (200):**
```json
{
  "question": {
    "id": 1,
    "teacher_id": 1,
    "title": "Título da Pergunta",
    "description": "Descrição detalhada",
    "created_at": "2024-01-01T00:00:00.000Z",
    "teacher": {
      "id": 1,
      "name": "Professor João",
      "role": "teacher"
    }
  }
}
```

### 5. Atualizar Pergunta (Apenas o professor que criou)
**PUT** `/api/questions/:id`

**Body:**
```json
{
  "teacher_id": 1,
  "title": "Título Atualizado",
  "description": "Descrição atualizada"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Pergunta atualizada com sucesso",
  "question": {
    "id": 1,
    "teacher_id": 1,
    "title": "Título Atualizado",
    "description": "Descrição atualizada",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Erros Possíveis:**
- `403` - "Você só pode modificar suas próprias perguntas" (se teacher_id não for o criador)
- `404` - "Pergunta não encontrada"
- `403` - "Apenas professores podem modificar perguntas"

**Uso no Frontend:**
- Tela do professor: botão "Editar" em cada pergunta
- Modal/formulário de edição com os campos pré-preenchidos
- `teacher_id` deve ser o ID do professor logado
- Após atualizar, recarregar a lista de perguntas

### 6. Excluir Pergunta (Apenas o professor que criou)
**DELETE** `/api/questions/:id`

**Body:**
```json
{
  "teacher_id": 1
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Pergunta excluída com sucesso"
}
```

**Erros Possíveis:**
- `403` - "Você só pode excluir suas próprias perguntas" (se teacher_id não for o criador)
- `404` - "Pergunta não encontrada"
- `403` - "Apenas professores podem excluir perguntas"

**Uso no Frontend:**
- Tela do professor: botão "Excluir" em cada pergunta
- Confirmar exclusão antes de enviar (dialog de confirmação)
- `teacher_id` deve ser o ID do professor logado
- Após excluir, remover da lista ou recarregar

### 7. Criar Resposta (Aluno)
**POST** `/api/questions/:question_id/answers`

**Body:**
```json
{
  "student_id": 2,
  "answer": "Texto da resposta do aluno"
}
```

**Resposta de Sucesso (201):**
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

**Uso no Frontend:**
- Tela do aluno: ao clicar em uma pergunta, mostrar formulário de resposta
- `student_id` vem do usuário logado
- `question_id` vem da pergunta selecionada

### 8. Listar Respostas de uma Pergunta
**GET** `/api/questions/:question_id/answers`

**Resposta de Sucesso (200):**
```json
{
  "question_id": 1,
  "answers": [
    {
      "id": 1,
      "question_id": 1,
      "student_id": 2,
      "answer": "Texto da resposta",
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

**Uso no Frontend:**
- Tela do professor: ver respostas de suas perguntas
- Tela do aluno: ver respostas de outros alunos na mesma pergunta

### 9. Atualizar Resposta (Apenas o aluno que criou)
**PUT** `/api/questions/:question_id/answers/:answer_id`

**Body:**
```json
{
  "student_id": 2,
  "answer": "Resposta atualizada pelo aluno"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Resposta atualizada com sucesso",
  "answer": {
    "id": 1,
    "question_id": 1,
    "student_id": 2,
    "answer": "Resposta atualizada pelo aluno",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Erros Possíveis:**
- `403` - "Você só pode modificar suas próprias respostas" (se student_id não for o criador)
- `404` - "Resposta não encontrada"
- `403` - "Apenas alunos podem modificar respostas"

**Uso no Frontend:**
- Tela do aluno: botão "Editar" em cada resposta que ele criou
- Modal/formulário de edição com o texto pré-preenchido
- `student_id` deve ser o ID do aluno logado
- Após atualizar, recarregar as respostas da pergunta

### 10. Excluir Resposta (Apenas o aluno que criou)
**DELETE** `/api/questions/:question_id/answers/:answer_id`

**Body:**
```json
{
  "student_id": 2
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Resposta excluída com sucesso"
}
```

**Erros Possíveis:**
- `403` - "Você só pode excluir suas próprias respostas" (se student_id não for o criador)
- `404` - "Resposta não encontrada"
- `403` - "Apenas alunos podem excluir respostas"

**Uso no Frontend:**
- Tela do aluno: botão "Excluir" em cada resposta que ele criou
- Confirmar exclusão antes de enviar (dialog de confirmação)
- `student_id` deve ser o ID do aluno logado
- Após excluir, remover da lista ou recarregar as respostas

## 💻 Exemplos de Código para o Frontend

### Configuração Base (Axios ou Fetch)

```javascript
// config/api.js
const API_BASE_URL = 'http://localhost:3001/api';

// Função helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};
```

### Tela de Entrada (Login/Cadastro)

```javascript
// components/LoginScreen.jsx ou similar
import { apiRequest } from '../config/api';

const LoginScreen = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ name, role }),
      });

      // Salvar dados do usuário
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);

      // Redirecionar
      if (data.user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      alert('Erro ao criar usuário: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Aluno</option>
        <option value="teacher">Professor</option>
      </select>
      <button type="submit">Entrar</button>
    </form>
  );
};
```

### Tela do Professor (Criar, Editar e Excluir Perguntas)

```javascript
// components/TeacherDashboard.jsx
import { apiRequest } from '../config/api';
import { useState, useEffect } from 'react';

const TeacherDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await apiRequest('/questions');
      const teacherId = parseInt(localStorage.getItem('userId'));
      // Filtrar apenas perguntas do professor logado
      const myQuestions = data.questions.filter(q => q.teacher_id === teacherId);
      setQuestions(myQuestions);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    const teacherId = parseInt(localStorage.getItem('userId'));

    try {
      await apiRequest('/questions', {
        method: 'POST',
        body: JSON.stringify({
          teacher_id: teacherId,
          title,
          description,
        }),
      });

      setTitle('');
      setDescription('');
      loadQuestions(); // Recarregar lista
      alert('Pergunta criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar pergunta: ' + error.message);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setTitle(question.title);
    setDescription(question.description);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    const teacherId = parseInt(localStorage.getItem('userId'));

    try {
      await apiRequest(`/questions/${editingQuestion.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          teacher_id: teacherId,
          title,
          description,
        }),
      });

      setEditingQuestion(null);
      setTitle('');
      setDescription('');
      loadQuestions();
      alert('Pergunta atualizada com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar pergunta: ' + error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) {
      return;
    }

    const teacherId = parseInt(localStorage.getItem('userId'));

    try {
      await apiRequest(`/questions/${questionId}`, {
        method: 'DELETE',
        body: JSON.stringify({
          teacher_id: teacherId,
        }),
      });

      loadQuestions();
      alert('Pergunta excluída com sucesso!');
    } catch (error) {
      alert('Erro ao excluir pergunta: ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h1>Painel do Professor</h1>
      
      <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da pergunta"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição da pergunta"
          required
        />
        <button type="submit">
          {editingQuestion ? 'Atualizar Pergunta' : 'Criar Pergunta'}
        </button>
        {editingQuestion && (
          <button type="button" onClick={cancelEdit}>Cancelar</button>
        )}
      </form>

      <div>
        <h2>Minhas Perguntas</h2>
        {questions.map((q) => (
          <div key={q.id}>
            <h3>{q.title}</h3>
            <p>{q.description}</p>
            <button onClick={() => viewAnswers(q.id)}>Ver Respostas</button>
            <button onClick={() => handleEditQuestion(q)}>Editar</button>
            <button onClick={() => handleDeleteQuestion(q.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Tela do Aluno (Ver Perguntas, Responder, Editar e Excluir Respostas)

```javascript
// components/StudentDashboard.jsx
import { apiRequest } from '../config/api';
import { useState, useEffect } from 'react';

const StudentDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [editingAnswer, setEditingAnswer] = useState(null);
  const studentId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (selectedQuestion) {
      loadAnswers(selectedQuestion.id);
    }
  }, [selectedQuestion]);

  const loadQuestions = async () => {
    try {
      const data = await apiRequest('/questions');
      setQuestions(data.questions);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  };

  const loadAnswers = async (questionId) => {
    try {
      const data = await apiRequest(`/questions/${questionId}/answers`);
      setAnswers(data.answers);
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    try {
      await apiRequest(`/questions/${selectedQuestion.id}/answers`, {
        method: 'POST',
        body: JSON.stringify({
          student_id: studentId,
          answer,
        }),
      });

      setAnswer('');
      loadAnswers(selectedQuestion.id);
      alert('Resposta enviada com sucesso!');
    } catch (error) {
      alert('Erro ao enviar resposta: ' + error.message);
    }
  };

  const handleEditAnswer = (answerItem) => {
    setEditingAnswer(answerItem);
    setAnswer(answerItem.answer);
  };

  const handleUpdateAnswer = async (e) => {
    e.preventDefault();

    try {
      await apiRequest(`/questions/${selectedQuestion.id}/answers/${editingAnswer.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          student_id: studentId,
          answer,
        }),
      });

      setEditingAnswer(null);
      setAnswer('');
      loadAnswers(selectedQuestion.id);
      alert('Resposta atualizada com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar resposta: ' + error.message);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!confirm('Tem certeza que deseja excluir esta resposta?')) {
      return;
    }

    try {
      await apiRequest(`/questions/${selectedQuestion.id}/answers/${answerId}`, {
        method: 'DELETE',
        body: JSON.stringify({
          student_id: studentId,
        }),
      });

      loadAnswers(selectedQuestion.id);
      alert('Resposta excluída com sucesso!');
    } catch (error) {
      alert('Erro ao excluir resposta: ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingAnswer(null);
    setAnswer('');
  };

  return (
    <div>
      <h1>Painel do Aluno</h1>
      
      <div>
        <h2>Perguntas Disponíveis</h2>
        {questions.map((q) => (
          <div key={q.id} onClick={() => setSelectedQuestion(q)}>
            <h3>{q.title}</h3>
            <p>{q.description}</p>
            <p>Por: {q.teacher?.name}</p>
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <div>
          <h2>Pergunta: {selectedQuestion.title}</h2>
          <p>{selectedQuestion.description}</p>

          <h3>Respostas</h3>
          {answers.map((a) => (
            <div key={a.id}>
              <p><strong>{a.student?.name}:</strong> {a.answer}</p>
              {a.student_id === studentId && (
                <>
                  <button onClick={() => handleEditAnswer(a)}>Editar</button>
                  <button onClick={() => handleDeleteAnswer(a.id)}>Excluir</button>
                </>
              )}
            </div>
          ))}

          <h3>{editingAnswer ? 'Editar Resposta' : 'Nova Resposta'}</h3>
          <form onSubmit={editingAnswer ? handleUpdateAnswer : handleSubmitAnswer}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Sua resposta"
              required
            />
            <button type="submit">
              {editingAnswer ? 'Atualizar Resposta' : 'Enviar Resposta'}
            </button>
            {editingAnswer && (
              <button type="button" onClick={cancelEdit}>Cancelar</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
```

## 🔐 Regras de Autorização e Segurança

### Regras de Edição e Exclusão

**Perguntas:**
- ✅ Apenas professores podem criar perguntas
- ✅ Apenas o professor que criou pode editar/excluir sua própria pergunta
- ❌ Professores não podem editar/excluir perguntas de outros professores
- ❌ Alunos não podem criar, editar ou excluir perguntas

**Respostas:**
- ✅ Apenas alunos podem criar respostas
- ✅ Apenas o aluno que criou pode editar/excluir sua própria resposta
- ❌ Alunos não podem editar/excluir respostas de outros alunos
- ❌ Professores não podem criar, editar ou excluir respostas

### Validações no Frontend

**Importante:** Sempre valide no frontend antes de mostrar botões de editar/excluir:

```javascript
// Exemplo: Verificar se o usuário pode editar uma pergunta
const canEditQuestion = (question) => {
  const userId = parseInt(localStorage.getItem('userId'));
  const userRole = localStorage.getItem('userRole');
  return userRole === 'teacher' && question.teacher_id === userId;
};

// Exemplo: Verificar se o usuário pode editar uma resposta
const canEditAnswer = (answer) => {
  const userId = parseInt(localStorage.getItem('userId'));
  const userRole = localStorage.getItem('userRole');
  return userRole === 'student' && answer.student_id === userId;
};

// Uso no componente
{canEditQuestion(question) && (
  <button onClick={() => handleEditQuestion(question)}>Editar</button>
)}
```

**Nota:** As validações no frontend são apenas para UX. O backend sempre valida e rejeita operações não autorizadas.

## ⚠️ Tratamento de Erros

Todos os endpoints retornam erros no formato:
```json
{
  "error": "Mensagem de erro",
  "details": "Detalhes adicionais (opcional)"
}
```

**Códigos de Status:**
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `403` - Acesso negado (ex: tentando editar/excluir registro de outro usuário)
- `404` - Não encontrado
- `500` - Erro do servidor

**Erros Comuns de Autorização:**
- `403` - "Você só pode modificar suas próprias perguntas"
- `403` - "Você só pode excluir suas próprias perguntas"
- `403` - "Você só pode modificar suas próprias respostas"
- `403` - "Você só pode excluir suas próprias respostas"
- `403` - "Apenas professores podem criar/modificar/excluir perguntas"
- `403` - "Apenas alunos podem criar/modificar/excluir respostas"

Sempre trate erros no frontend e mostre mensagens amigáveis ao usuário.

## 🔄 Fluxo de Dados Recomendado

1. **Tela de Entrada:**
   - Usuário preenche nome e seleciona role
   - POST `/api/users` → Salva dados no localStorage
   - Redireciona para tela apropriada

2. **Tela do Professor:**
   - GET `/api/questions` → Filtra por `teacher_id`
   - POST `/api/questions` → Cria nova pergunta
   - PUT `/api/questions/:id` → Atualiza pergunta (apenas suas próprias)
   - DELETE `/api/questions/:id` → Exclui pergunta (apenas suas próprias)
   - GET `/api/questions/:id/answers` → Ver respostas

3. **Tela do Aluno:**
   - GET `/api/questions` → Lista todas as perguntas
   - GET `/api/questions/:id/answers` → Ver respostas existentes
   - POST `/api/questions/:id/answers` → Criar resposta
   - PUT `/api/questions/:question_id/answers/:answer_id` → Atualiza resposta (apenas suas próprias)
   - DELETE `/api/questions/:question_id/answers/:answer_id` → Exclui resposta (apenas suas próprias)

## 🧪 Testando a Integração

1. Certifique-se de que o backend está rodando (`npm start` no backend)
2. Teste o endpoint de health: `http://localhost:3001/health`
3. Teste criar um usuário via Postman/Insomnia ou pelo frontend
4. Verifique se os dados estão sendo salvos no Supabase

## 📝 Notas Importantes

- O backend usa CORS, então requisições do frontend devem funcionar normalmente
- Todos os IDs são números inteiros
- As datas vêm no formato ISO 8601
- O backend valida os dados antes de salvar
- Apenas professores podem criar perguntas
- Apenas alunos podem criar respostas

## 🆘 Troubleshooting

**Erro: "Cannot connect to server"**
- Verifique se o backend está rodando
- Verifique se a porta 3000 está livre
- Verifique se a URL está correta

**Erro: "SUPABASE_KEY não encontrada"**
- Verifique se o arquivo `.env` existe no backend
- Verifique se a chave está correta

**Erro: "Erro ao criar usuário"**
- Verifique se o banco de dados está configurado corretamente
- Verifique se as tabelas existem no Supabase

**Erro CORS no navegador**
- O backend já tem CORS habilitado, mas se houver problemas, verifique a configuração

---

**Pronto para integração!** 🚀

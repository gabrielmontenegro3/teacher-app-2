/**
 * Script de teste básico para validar os endpoints da API
 * Execute: node test-api.js
 */

const API_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Iniciando testes da API...\n');

  try {
    // Teste 1: Criar um professor
    console.log('1️⃣ Testando criação de professor...');
    const teacherResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Professor João',
        role: 'teacher'
      })
    });
    const teacherData = await teacherResponse.json();
    console.log('✅ Professor criado:', teacherData);
    const teacherId = teacherData.user?.id;

    if (!teacherId) {
      throw new Error('Falha ao criar professor');
    }

    // Teste 2: Criar um aluno
    console.log('\n2️⃣ Testando criação de aluno...');
    const studentResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aluno Maria',
        role: 'student'
      })
    });
    const studentData = await studentResponse.json();
    console.log('✅ Aluno criado:', studentData);
    const studentId = studentData.user?.id;

    if (!studentId) {
      throw new Error('Falha ao criar aluno');
    }

    // Teste 3: Criar uma pergunta
    console.log('\n3️⃣ Testando criação de pergunta...');
    const questionResponse = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacher_id: teacherId,
        title: 'O que é JavaScript?',
        description: 'Explique o conceito de JavaScript e suas principais características.'
      })
    });
    const questionData = await questionResponse.json();
    console.log('✅ Pergunta criada:', questionData);
    const questionId = questionData.question?.id;

    if (!questionId) {
      throw new Error('Falha ao criar pergunta');
    }

    // Teste 4: Listar todas as perguntas
    console.log('\n4️⃣ Testando listagem de perguntas...');
    const questionsListResponse = await fetch(`${API_URL}/questions`);
    const questionsListData = await questionsListResponse.json();
    console.log('✅ Perguntas listadas:', questionsListData);

    // Teste 5: Criar uma resposta
    console.log('\n5️⃣ Testando criação de resposta...');
    const answerResponse = await fetch(`${API_URL}/questions/${questionId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        answer: 'JavaScript é uma linguagem de programação de alto nível, interpretada e orientada a objetos.'
      })
    });
    const answerData = await answerResponse.json();
    console.log('✅ Resposta criada:', answerData);

    // Teste 6: Listar respostas de uma pergunta
    console.log('\n6️⃣ Testando listagem de respostas...');
    const answersListResponse = await fetch(`${API_URL}/questions/${questionId}/answers`);
    const answersListData = await answersListResponse.json();
    console.log('✅ Respostas listadas:', answersListData);

    console.log('\n✅ Todos os testes passaram com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error.message);
    console.error('Certifique-se de que:');
    console.error('1. O servidor está rodando (npm start)');
    console.error('2. A variável SUPABASE_KEY está configurada no arquivo .env');
    console.error('3. O banco de dados está configurado corretamente');
  }
}

testAPI();

import { supabase } from '../config/supabase.js';

export const createAnswer = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { student_id, answer } = req.body;

    // Verificar se a pergunta existe
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', question_id)
      .single();

    if (questionError || !question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    // Verificar se o usuário existe e é um student
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', student_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Apenas alunos podem responder perguntas' });
    }

    const { data, error } = await supabase
      .from('answers')
      .insert([
        {
          question_id: parseInt(question_id),
          student_id: student_id,
          answer: answer.trim()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar resposta:', error);
      return res.status(500).json({ error: 'Erro ao criar resposta', details: error.message });
    }

    res.status(201).json({
      message: 'Resposta criada com sucesso',
      answer: data
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const getAnswersByQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;

    // Verificar se a pergunta existe
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', question_id)
      .single();

    if (questionError || !question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    // Buscar respostas
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', question_id)
      .order('created_at', { ascending: false });

    if (answersError) {
      console.error('Erro ao buscar respostas:', answersError);
      return res.status(500).json({ error: 'Erro ao buscar respostas', details: answersError.message });
    }

    // Buscar informações dos alunos para cada resposta
    if (answers && answers.length > 0) {
      const studentIds = [...new Set(answers.map(a => a.student_id))];
      const { data: students, error: studentsError } = await supabase
        .from('users')
        .select('id, name, role')
        .in('id', studentIds);

      if (studentsError) {
        console.error('Erro ao buscar alunos:', studentsError);
      }

      // Combinar dados
      const answersWithStudents = answers.map(answer => {
        const student = students?.find(s => s.id === answer.student_id);
        return {
          ...answer,
          student: student || null
        };
      });

      return res.json({
        question_id: parseInt(question_id),
        answers: answersWithStudents
      });
    }

    res.json({
      question_id: parseInt(question_id),
      answers: []
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { question_id, answer_id } = req.params;
    const { student_id, answer: answerText } = req.body;

    // Verificar se a resposta existe
    const { data: answer, error: answerError } = await supabase
      .from('answers')
      .select('*')
      .eq('id', answer_id)
      .eq('question_id', question_id)
      .single();

    if (answerError || !answer) {
      return res.status(404).json({ error: 'Resposta não encontrada' });
    }

    // Verificar se o student_id fornecido é o criador da resposta
    if (answer.student_id !== parseInt(student_id)) {
      return res.status(403).json({ error: 'Você só pode modificar suas próprias respostas' });
    }

    // Verificar se o usuário existe e é um student
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', student_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Apenas alunos podem modificar respostas' });
    }

    // Atualizar a resposta
    const { data, error } = await supabase
      .from('answers')
      .update({
        answer: answerText.trim()
      })
      .eq('id', answer_id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar resposta:', error);
      return res.status(500).json({ error: 'Erro ao atualizar resposta', details: error.message });
    }

    res.json({
      message: 'Resposta atualizada com sucesso',
      answer: data
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { question_id, answer_id } = req.params;
    const { student_id } = req.body;

    // Verificar se a resposta existe
    const { data: answer, error: answerError } = await supabase
      .from('answers')
      .select('*')
      .eq('id', answer_id)
      .eq('question_id', question_id)
      .single();

    if (answerError || !answer) {
      return res.status(404).json({ error: 'Resposta não encontrada' });
    }

    // Verificar se o student_id fornecido é o criador da resposta
    if (answer.student_id !== parseInt(student_id)) {
      return res.status(403).json({ error: 'Você só pode excluir suas próprias respostas' });
    }

    // Verificar se o usuário existe e é um student
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', student_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Apenas alunos podem excluir respostas' });
    }

    // Excluir a resposta
    const { error } = await supabase
      .from('answers')
      .delete()
      .eq('id', answer_id);

    if (error) {
      console.error('Erro ao excluir resposta:', error);
      return res.status(500).json({ error: 'Erro ao excluir resposta', details: error.message });
    }

    res.json({
      message: 'Resposta excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};
import { supabase } from '../config/supabase.js';

export const createQuestion = async (req, res) => {
  try {
    const { teacher_id, title, description } = req.body;

    // Verificar se o usuário existe e é um teacher
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', teacher_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas professores podem criar perguntas' });
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          teacher_id: teacher_id,
          title: title.trim(),
          description: description.trim()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar pergunta:', error);
      return res.status(500).json({ error: 'Erro ao criar pergunta', details: error.message });
    }

    res.status(201).json({
      message: 'Pergunta criada com sucesso',
      question: data
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    // Buscar perguntas
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (questionsError) {
      console.error('Erro ao buscar perguntas:', questionsError);
      return res.status(500).json({ error: 'Erro ao buscar perguntas', details: questionsError.message });
    }

    // Buscar informações dos professores para cada pergunta
    if (questions && questions.length > 0) {
      const teacherIds = [...new Set(questions.map(q => q.teacher_id))];
      const { data: teachers, error: teachersError } = await supabase
        .from('users')
        .select('id, name, role')
        .in('id', teacherIds);

      if (teachersError) {
        console.error('Erro ao buscar professores:', teachersError);
      }

      // Combinar dados
      const questionsWithTeachers = questions.map(question => {
        const teacher = teachers?.find(t => t.id === question.teacher_id);
        return {
          ...question,
          teacher: teacher || null
        };
      });

      return res.json({
        questions: questionsWithTeachers
      });
    }

    res.json({
      questions: []
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (questionError) {
      if (questionError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Pergunta não encontrada' });
      }
      return res.status(500).json({ error: 'Erro ao buscar pergunta', details: questionError.message });
    }

    // Buscar informações do professor
    const { data: teacher, error: teacherError } = await supabase
      .from('users')
      .select('id, name, role')
      .eq('id', question.teacher_id)
      .single();

    if (teacherError) {
      console.error('Erro ao buscar professor:', teacherError);
    }

    res.json({
      question: {
        ...question,
        teacher: teacher || null
      }
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

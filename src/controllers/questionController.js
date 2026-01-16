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

    // Preparar dados para inserção (apenas campos fornecidos)
    const questionData = {
      teacher_id: teacher_id
    };

    // Adicionar título se fornecido
    if (title && typeof title === 'string' && title.trim().length > 0) {
      questionData.title = title.trim();
    }

    // Adicionar descrição se fornecida
    if (description && typeof description === 'string' && description.trim().length > 0) {
      questionData.description = description.trim();
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([questionData])
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

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id, title, description } = req.body;

    // Verificar se a pergunta existe
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (questionError || !question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    // Verificar se o teacher_id fornecido é o criador da pergunta
    if (question.teacher_id !== parseInt(teacher_id)) {
      return res.status(403).json({ error: 'Você só pode modificar suas próprias perguntas' });
    }

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
      return res.status(403).json({ error: 'Apenas professores podem modificar perguntas' });
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData = {};

    // Adicionar título se fornecido
    if (title !== undefined) {
      if (title && typeof title === 'string' && title.trim().length > 0) {
        updateData.title = title.trim();
      } else if (title === null || title === '') {
        // Permitir remover o título definindo como null
        updateData.title = null;
      }
    }

    // Adicionar descrição se fornecida
    if (description !== undefined) {
      if (description && typeof description === 'string' && description.trim().length > 0) {
        updateData.description = description.trim();
      } else if (description === null || description === '') {
        // Permitir remover a descrição definindo como null
        updateData.description = null;
      }
    }

    // Validar que pelo menos um campo (título ou descrição) permaneça após atualização
    const finalTitle = updateData.title !== undefined ? updateData.title : question.title;
    const finalDescription = updateData.description !== undefined ? updateData.description : question.description;

    if (!finalTitle && !finalDescription) {
      return res.status(400).json({ error: 'A pergunta deve ter pelo menos título ou descrição' });
    }

    // Atualizar a pergunta
    const { data, error } = await supabase
      .from('questions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar pergunta:', error);
      return res.status(500).json({ error: 'Erro ao atualizar pergunta', details: error.message });
    }

    res.json({
      message: 'Pergunta atualizada com sucesso',
      question: data
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id } = req.body;

    // Verificar se a pergunta existe
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (questionError || !question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

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
      return res.status(403).json({ error: 'Apenas professores podem excluir perguntas' });
    }

    // Excluir a pergunta (qualquer professor pode excluir qualquer pergunta)
    // As respostas serão excluídas em cascata se houver foreign key constraint
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir pergunta:', error);
      return res.status(500).json({ error: 'Erro ao excluir pergunta', details: error.message });
    }

    res.json({
      message: 'Pergunta excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};
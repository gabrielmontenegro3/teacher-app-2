import { supabase } from '../config/supabase.js';

export const createUser = async (req, res) => {
  try {
    const { name, role } = req.body;

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          role: role
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: data
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }

    res.json({ user: data });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

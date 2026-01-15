import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://zyslxrbpcjykwhybuksq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey || supabaseKey === 'sua_chave_supabase_aqui') {
  console.error('\n❌ ERRO: SUPABASE_KEY não configurada corretamente');
  console.error('\n📝 Para resolver:');
  console.error('1. Abra o arquivo .env na raiz do projeto');
  console.error('2. Substitua "sua_chave_supabase_aqui" pela sua chave real do Supabase');
  console.error('3. Obtenha a chave em: https://supabase.com/dashboard');
  console.error('   → Selecione seu projeto');
  console.error('   → Settings → API → Copie a "anon" key (anon/public key)');
  console.error('4. Salve o arquivo .env e reinicie o servidor\n');
  throw new Error('SUPABASE_KEY não configurada. Verifique o arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

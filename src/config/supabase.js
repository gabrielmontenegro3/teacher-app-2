import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://zyslxrbpcjykwhybuksq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey || supabaseKey === 'sua_chave_supabase_aqui') {
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  const errorMsg = isVercel 
    ? 'SUPABASE_KEY não configurada na Vercel. Configure em Settings → Environment Variables'
    : 'SUPABASE_KEY não configurada. Verifique o arquivo .env';
  
  console.error('\n❌ ERRO: SUPABASE_KEY não configurada corretamente');
  console.error('\n📝 Para resolver:');
  
  if (isVercel) {
    console.error('1. Acesse o painel da Vercel: https://vercel.com/dashboard');
    console.error('2. Selecione seu projeto');
    console.error('3. Vá em Settings → Environment Variables');
    console.error('4. Adicione a variável SUPABASE_KEY com sua chave do Supabase');
    console.error('5. Faça redeploy do projeto');
  } else {
    console.error('1. Abra o arquivo .env na raiz do projeto');
    console.error('2. Substitua "sua_chave_supabase_aqui" pela sua chave real do Supabase');
    console.error('3. Reinicie o servidor');
  }
  
  console.error('\n📋 Como obter a chave:');
  console.error('   → Acesse: https://supabase.com/dashboard');
  console.error('   → Selecione seu projeto');
  console.error('   → Settings → API → Copie a "anon" key (anon/public key)\n');
  
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔨 Iniciando build do projeto...\n');

// Verificar se o arquivo .env existe
const envPath = join(rootDir, '.env');
if (!existsSync(envPath)) {
  console.error('❌ ERRO: Arquivo .env não encontrado!');
  console.error('📝 Crie um arquivo .env na raiz do projeto com:');
  console.error('   SUPABASE_KEY=sua_chave_aqui');
  console.error('   PORT=3001\n');
  process.exit(1);
}

// Verificar se o .env tem a chave configurada
try {
  const envContent = readFileSync(envPath, 'utf-8');
  if (envContent.includes('sua_chave_supabase_aqui') || !envContent.includes('SUPABASE_KEY=')) {
    console.error('❌ ERRO: SUPABASE_KEY não configurada no arquivo .env!');
    console.error('📝 Configure a chave do Supabase no arquivo .env\n');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erro ao ler arquivo .env:', error.message);
  process.exit(1);
}

// Verificar se node_modules existe
const nodeModulesPath = join(rootDir, 'node_modules');
if (!existsSync(nodeModulesPath)) {
  console.error('❌ ERRO: node_modules não encontrado!');
  console.error('📝 Execute: npm install\n');
  process.exit(1);
}

// Verificar se os arquivos principais existem
const requiredFiles = [
  'src/server.js',
  'src/config/supabase.js',
  'src/routes/userRoutes.js',
  'src/routes/questionRoutes.js',
  'src/routes/answerRoutes.js'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = join(rootDir, file);
  if (!existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${file}`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.error('\n❌ ERRO: Alguns arquivos necessários estão faltando!');
  process.exit(1);
}

// Verificar estrutura de pastas
const requiredDirs = [
  'src/controllers',
  'src/middleware',
  'src/routes',
  'src/config',
  'src/utils'
];

let allDirsExist = true;
for (const dir of requiredDirs) {
  const dirPath = join(rootDir, dir);
  if (!existsSync(dirPath)) {
    console.error(`❌ Diretório não encontrado: ${dir}`);
    allDirsExist = false;
  }
}

if (!allDirsExist) {
  console.error('\n❌ ERRO: Alguns diretórios necessários estão faltando!');
  process.exit(1);
}

// Build bem-sucedido
console.log('✅ Estrutura do projeto verificada');
console.log('✅ Arquivo .env configurado');
console.log('✅ Dependências instaladas');
console.log('✅ Arquivos principais presentes');
console.log('\n🎉 Build concluído com sucesso!');
console.log('\n📝 Para iniciar o servidor:');
console.log('   npm start');
console.log('\n📝 Para desenvolvimento:');
console.log('   npm run dev\n');

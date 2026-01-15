import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 3001;

// Configurar CORS para aceitar múltiplas origens (localhost e Vercel)
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      // Desenvolvimento local
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      // Frontend em produção (Vercel)
      'https://teacher-app-2-frontend.vercel.app',
      // Variáveis de ambiente (para flexibilidade)
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    ].filter(Boolean);
    
    // Em desenvolvimento, permitir todas as origens para facilitar testes
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Em produção, verificar se a origem está na lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Requisição bloqueada por CORS de origem: ${origin}`);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Para navegadores legados
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Teacher App Backend',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      users: '/api/users',
      questions: '/api/questions',
      answers: '/api/questions/:id/answers'
    }
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor está funcionando', 
    port: DEFAULT_PORT,
    environment: process.env.NODE_ENV || 'development',
    vercelUrl: process.env.VERCEL_URL || 'local',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/questions', answerRoutes); // Respostas: /api/questions/:question_id/answers

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

/**
 * Inicia o servidor em uma porta disponível
 */
async function startServer() {
  let port = DEFAULT_PORT;

  try {
    // Na Vercel, não precisamos verificar portas
    if (process.env.VERCEL) {
      return;
    }

    // Importar portChecker dinamicamente apenas quando necessário (local)
    const { isPortInUse, tryFreePort, findAvailablePort } = await import('./utils/portChecker.js');
    
    // Verificar se a porta está em uso
    const portInUse = await isPortInUse(port);

    if (portInUse) {
      console.log(`\n⚠️  Porta ${port} está em uso. Tentando liberar...`);
      
      // Tentar liberar a porta
      const freed = await tryFreePort(port);
      
      if (!freed) {
        console.log(`\n⚠️  Não foi possível liberar a porta ${port}.`);
        console.log(`🔍 Procurando uma porta alternativa...`);
        
        // Tentar encontrar uma porta disponível
        port = await findAvailablePort(port);
        console.log(`\n✅ Porta alternativa encontrada: ${port}`);
      } else {
        console.log(`✅ Porta ${port} liberada com sucesso!`);
      }
    }

    // Iniciar servidor
    const server = app.listen(port, () => {
      console.log('\n' + '='.repeat(50));
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📍 Health check: http://localhost:${port}/health`);
      console.log(`📚 API disponível em: http://localhost:${port}/api`);
      console.log('='.repeat(50) + '\n');
    });

    // Tratamento de erro ao iniciar servidor
    server.on('error', async (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ ERRO: A porta ${port} ainda está em uso após tentativas de liberação.`);
        console.error(`🔍 Tentando encontrar uma porta alternativa...`);
        
        try {
          const newPort = await findAvailablePort(port + 1);
          console.log(`\n✅ Tentando iniciar na porta ${newPort}...`);
          
          // Tentar novamente na nova porta
          const newServer = app.listen(newPort, () => {
            console.log('\n' + '='.repeat(50));
            console.log(`🚀 Servidor rodando na porta ${newPort}`);
            console.log(`📍 Health check: http://localhost:${newPort}/health`);
            console.log(`📚 API disponível em: http://localhost:${newPort}/api`);
            console.log('='.repeat(50) + '\n');
          });

          newServer.on('error', (err) => {
            console.error('❌ Erro crítico ao iniciar servidor:', err);
            process.exit(1);
          });
        } catch (findError) {
          console.error('❌ Não foi possível encontrar uma porta disponível:', findError.message);
          console.error('\n📝 Solução manual:');
          console.error(`1. Encontre o processo: netstat -ano | findstr :${port}`);
          console.error('2. Encerre o processo: Stop-Process -Id [PID] -Force');
          console.error(`3. Ou altere a porta no arquivo .env (PORT=3002)\n`);
          process.exit(1);
        }
      } else {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n⚠️  SIGTERM recebido. Encerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor encerrado.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n⚠️  SIGINT recebido. Encerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor encerrado.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Erro crítico ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Handler para Vercel (serverless function)
// A Vercel espera que exportemos o app Express diretamente
export default app;

// Iniciar servidor apenas em ambiente local (não na Vercel)
// A Vercel define automaticamente a variável VERCEL=true
if (!process.env.VERCEL) {
  startServer();
}

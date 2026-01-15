import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';
import { findAvailablePort, tryFreePort, isPortInUse } from './utils/portChecker.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/questions', answerRoutes); // Respostas: /api/questions/:question_id/answers

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor está funcionando', port: DEFAULT_PORT });
});

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

// Iniciar servidor
startServer();

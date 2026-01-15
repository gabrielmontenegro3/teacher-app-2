import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Verifica se uma porta está em uso
 */
export async function isPortInUse(port) {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    return stdout.trim().length > 0;
  } catch (error) {
    // Se não encontrar nada, a porta está livre
    return false;
  }
}

/**
 * Encontra uma porta disponível, começando da porta especificada
 */
export async function findAvailablePort(startPort = 3001) {
  let port = startPort;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return port;
    }
    console.log(`⚠️  Porta ${port} está em uso, tentando ${port + 1}...`);
    port++;
    attempts++;
  }

  throw new Error(`Não foi possível encontrar uma porta disponível após ${maxAttempts} tentativas`);
}

/**
 * Tenta liberar a porta matando processos que a estão usando
 */
export async function tryFreePort(port) {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    if (!stdout.trim()) {
      return true; // Porta já está livre
    }

    // Extrair PIDs únicos
    const pids = [...new Set(
      stdout
        .split('\n')
        .map(line => line.trim().split(/\s+/).pop())
        .filter(pid => pid && !isNaN(pid))
    )];

    if (pids.length === 0) {
      return true;
    }

    console.log(`🔧 Tentando liberar porta ${port} (processos encontrados: ${pids.join(', ')})...`);

    for (const pid of pids) {
      try {
        await execAsync(`taskkill /F /PID ${pid}`);
        console.log(`   ✅ Processo ${pid} encerrado`);
      } catch (error) {
        // Ignorar erros ao tentar matar processos
      }
    }

    // Aguardar um pouco e verificar novamente
    await new Promise(resolve => setTimeout(resolve, 1000));
    return !(await isPortInUse(port));
  } catch (error) {
    return false;
  }
}

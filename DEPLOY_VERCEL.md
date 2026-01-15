# 🚀 Guia de Deploy na Vercel

Este guia explica como fazer deploy do backend na Vercel.

## 📋 Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Projeto no Supabase configurado
3. Código do backend no GitHub (recomendado) ou pronto para deploy

## 🔧 Passos para Deploy

### 1. Preparar o Projeto

O projeto já está configurado com:
- ✅ `vercel.json` - Configuração do deploy
- ✅ `src/server.js` - Ajustado para funcionar como serverless function
- ✅ CORS configurado para aceitar múltiplas origens

### 2. Fazer Deploy na Vercel

#### Opção A: Via CLI da Vercel

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy (na raiz do projeto backend)
vercel

# Para produção
vercel --prod
```

#### Opção B: Via Dashboard da Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub (ou faça upload)
4. Configure as variáveis de ambiente (veja passo 3)
5. Clique em "Deploy"

### 3. Configurar Variáveis de Ambiente na Vercel

**IMPORTANTE:** Configure estas variáveis no painel da Vercel:

1. Acesse seu projeto na Vercel Dashboard
2. Vá em **Settings → Environment Variables**
3. Adicione as seguintes variáveis:

```
SUPABASE_KEY=sua_chave_supabase_aqui
```

**Onde encontrar a SUPABASE_KEY:**
- Acesse https://supabase.com/dashboard
- Selecione seu projeto
- Vá em **Settings → API**
- Copie a **"anon" key** (chave pública/anônima)

**Variáveis opcionais:**
```
FRONTEND_URL=https://seu-frontend.vercel.app  # URL do seu frontend (para CORS)
NODE_ENV=production
```

### 4. Após o Deploy

Após o deploy, você receberá uma URL como:
```
https://seu-projeto.vercel.app
```

**Endpoints disponíveis:**
- Health Check: `https://seu-projeto.vercel.app/health`
- API Base: `https://seu-projeto.vercel.app/api`
- Usuários: `https://seu-projeto.vercel.app/api/users`
- Perguntas: `https://seu-projeto.vercel.app/api/questions`
- Respostas: `https://seu-projeto.vercel.app/api/questions/:id/answers`

### 5. Atualizar Frontend

Após obter a URL da Vercel, atualize seu frontend para usar a nova URL:

```javascript
// Exemplo de configuração no frontend
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seu-projeto.vercel.app/api'
  : 'http://localhost:3001/api';
```

## 🔄 Atualizações Futuras

A Vercel faz deploy automático quando você faz push para o repositório conectado. Para deploy manual:

```bash
vercel --prod
```

## 🐛 Troubleshooting

### Erro: "SUPABASE_KEY não configurada"
- Verifique se a variável `SUPABASE_KEY` está configurada no painel da Vercel
- Certifique-se de que não há espaços extras no valor

### Erro de CORS
- Adicione a URL do seu frontend na variável `FRONTEND_URL`
- Ou ajuste o CORS no `src/server.js` para incluir sua URL

### Erro 404 nas rotas
- Verifique se o `vercel.json` está na raiz do projeto
- Certifique-se de que todas as rotas começam com `/api/`

## 📝 Notas Importantes

- A Vercel gerencia a porta automaticamente (não precisa configurar `PORT`)
- O servidor funciona como serverless function (não fica rodando 24/7)
- Cada requisição inicia uma nova instância (cold start)
- Para melhor performance, considere usar Vercel Pro para reduzir cold starts

## 🔗 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel + Express](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Supabase Dashboard](https://supabase.com/dashboard)

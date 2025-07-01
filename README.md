# 🎮 Darkscore Battlefield

**Darkscore Battlefield** é uma plataforma web para registrar partidas entre amigos, acompanhar placares e manter um histórico de confrontos. Ideal para quem leva a resenha a sério e quer saber, de forma definitiva, quem vence mais.

## ✨ Funcionalidades

- ✅ Criação de partidas com múltiplos jogadores
- ✅ Registro de resultados e vencedores
- ✅ Histórico de confrontos entre amigos
- ✅ Visualização de vitórias por jogador
- ✅ Lista de amigos com destaque para rivalidades
- ✅ Interface direta, responsiva e rápida

## 🧪 Tecnologias utilizadas

- **React** – SPA moderna e performática
- **TypeScript** – Tipagem estática para maior segurança
- **Firebase** – Autenticação, Firestore e Realtime Database
- **Vite** – Build e dev server ultrarrápido

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/darkscore-battlefield.git
cd darkscore-battlefield
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure suas variáveis de ambiente

# Define o ambiente (dev ou production)

```env
WEB_ENV=dev
```

# Firebase

```env
API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
AUTH_DOMAIN=seu-projeto.firebaseapp.com
PROJECT_ID=seu-projeto
STORAGE_BUCKET=seu-projeto.appspot.com
MESSAGING_SENDER_ID=XXXXXXXXXXXX
API_ID=1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXXXX
MEASUREMENT_ID=G-XXXXXXXXXX
```

# URLs do Firebase Realtime Database

```env
DATABASE_URL_DEVELOPMENT=https://seu-projeto.firebaseio.com
DATABASE_URL_PRODUCTION=https://seu-projeto.firebaseio.com
```

### 4. Inicie o servidor local

```bash
npm run dev
```

Acesse http://localhost:8080 no navegador para ver o projeto em ação.

## 📦 Estrutura do projeto

```bash
src/
├── components/       # Componentes reutilizáveis da interface
├── contexts/         # Contextos React para estado global
├── dtos/             # Data Transfer Objects e tipos
├── env/              # Configurações e variáveis de ambiente
├── hooks/            # Hooks personalizados
├── libs/             # Serviços e libs, incluindo configuração do Firebase
├── pages/            # Páginas principais do app
└── routes/           # Configuração das rotas do app
```

## 📌 Observações

- O projeto utiliza lógica personalizada para exibir vitórias entre amigos com base no histórico de partidas.

- Ideal para grupos de jogos (board games, futebol, games online etc).

- Todos os dados são salvos na nuvem com Firebase.

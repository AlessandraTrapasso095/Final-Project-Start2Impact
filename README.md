# PixelForge Studio Workspace

Web app full stack realizzata come **Progetto Finale Start2Impact**.

L'applicazione simula il workspace interno di **PixelForge Studio**, una micro-agenzia creativa che ha bisogno di:

- registrazione, login e logout;
- gestione della sessione utente;
- aggiornamento del profilo personale;
- task board condivisa;
- bacheca con post e commenti;
- centro notifiche.

## Obiettivo del progetto

Il progetto nasce per:

- sviluppo di **API RESTful** personalizzate;
- integrazione tra **front end** e **back end**;
- autenticazione completa;
- realizzazione di una **SPA** con interfaccia moderna e curata;
- aggiunta di funzionalita' extra utili.

## Stack utilizzato

- **Front end:** React + Vite
- **Back end:** Node.js + Express
- **Persistenza dati:** file locale `JSONC`
- **Autenticazione:** password hashata + token di sessione
- **Stile UI:** CSS custom con componenti riusabili, hover states, loading ring e feedback panel

## Funzionalita' principali

### Autenticazione

- registrazione utente
- login utente
- logout utente
- recupero sessione attiva al refresh

### Funzionalita' extra

- aggiornamento profilo utente
- upload immagine profilo dalla sidebar
- task board con creazione, aggiornamento e cancellazione task
- bacheca con pubblicazione post e commenti
- notifiche legate alle azioni principali del workspace

## Struttura del progetto

```text
Final Project Start2Impact/
├── client/                  # frontend React + Vite
├── server/                  # backend Node.js + Express
├── docs/
│   └── project-plan.md      # brief iniziale e roadmap
├── README.md
└── package.json             # workspace root
```

## Requisiti

- Node.js gia' installato
- npm

## Installazione

Dalla root del progetto:

```bash
npm install
```

## Avvio del progetto

### 1. Avvio backend

```bash
npm run dev:server
```

Backend disponibile su:

- `http://127.0.0.1:4321`
- API base: `http://127.0.0.1:4321/api`

### 2. Avvio frontend

In un secondo terminale:

```bash
npm run dev:client
```

Frontend disponibile su:

- `http://127.0.0.1:5174`

## Script disponibili

### Root

- `npm run dev:client`
- `npm run dev:server`
- `npm run start:server`

### Frontend

- `npm run build --workspace client`
- `npm run preview --workspace client`

### Backend

- `npm run start --workspace server`

## API principali

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

### Task

- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

### Profilo

- `GET /api/profile`
- `PATCH /api/profile`

### Bacheca

- `GET /api/feed`
- `POST /api/feed`
- `POST /api/feed/:postId/comments`

### Notifiche

- `GET /api/notifications`
- `PATCH /api/notifications/:notificationId/read`
- `PATCH /api/notifications/read-all`

## Persistenza dati

I dati vengono salvati localmente in:

- `server/storage/app-data.jsonc`

Questo rende il progetto semplice da avviare e perfetto per una demo o una presentazione, senza dipendere da database esterni.

## Note utili

- Il progetto e' pensato come **Single Page Application**.
- Il focus e' sulla dimostrazione pratica delle competenze full stack.
- La UI e' stata progettata con una landing pubblica separata dall'area riservata.
- Dopo il login, la landing non viene piu' mostrata: l'utente entra direttamente nella dashboard.


## Cliente scelto

**PixelForge Studio**  
Micro-agenzia creativa per cui e' stato immaginato un workspace interno dedicato alla gestione di accessi, task, comunicazione del team e organizzazione del lavoro.

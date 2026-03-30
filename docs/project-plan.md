<!-- questo file mi serve per fissare il brief del progetto, il cliente scelto e tutta la roadmap prima di iniziare a sviluppare davvero. -->

# Progetto Finale Start2Impact

## Titolo del progetto
TaskFlow Studio

## Cliente scelto
PixelForge Studio, una micro-agenzia creativa che ha bisogno di una web app interna per permettere al team di:

- registrarsi in autonomia;
- fare login e logout in modo semplice;
- gestire una bacheca di task condivisi;
- aggiornare i dati principali del proprio profilo.

## Perche' questo progetto e' adatto al Master
Questo progetto ci permette di coprire bene tutta la traccia finale:

- autenticazione completa con registrazione, login, logout e sessione utente;
- API RESTful sviluppate da zero;
- integrazione tra front end e back end;
- funzionalita' extra reali e facili da mostrare in presentazione;
- interfaccia moderna, curata e professionale.

## Scelte tecniche
- Tipo applicazione: SPA
- Front end: React con Vite
- Back end: Node.js con Express
- Persistenza iniziale: file JSON locale, cosi' partiamo dalle basi senza complicare troppo il setup
- Autenticazione: password hashata + token di sessione
- Stile UI: moderno, pulito, professionale, con hover states, spinner di caricamento e feedback chiari

## Funzionalita' principali
### Autenticazione
- registrazione utente;
- login utente;
- logout utente;
- recupero sessione attiva.

### Funzionalita' extra
- creazione task;
- modifica task;
- cambio stato task;
- eliminazione task;
- aggiornamento profilo utente.

## Roadmap completa
1. Step 1: impostare brief, struttura del repository e package base.
2. Step 2: configurare il backend Node.js/Express con struttura DRY a moduli.
3. Step 3: impostare la persistenza dati locale e il modello utente/task.
4. Step 4: sviluppare le API RESTful di autenticazione.
5. Step 5: testare da terminale gli endpoint auth e sistemare i casi di errore.
6. Step 6: configurare il frontend React e il design system di base.
7. Step 7: costruire le schermate di registrazione e login con UI moderna.
8. Step 8: collegare il frontend alle API per gestire sessione, feedback e logout.
9. Step 9: sviluppare le API extra per task e profilo.
10. Step 10: creare dashboard, task board e interazioni frontend.
11. Step 11: rifinire DRY, loading, error handling, hover effects e look professionale.
12. Step 12: fare test finale, preparare README e contenuti della presentazione PDF.

## Regola di lavoro
Procediamo uno step alla volta e non passiamo allo step successivo finche' non viene confermato.

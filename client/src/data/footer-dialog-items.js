// questo file mi serve per raccogliere in un solo posto i contenuti del footer.
// lo uso per restare DRY tra sezione informativa della landing e popup aperti dai link finali.

export const footerDialogItems = [
  {
    id: "privacy",
    label: "Privacy",
    eyebrow: "Privacy",
    title: "Come vengono gestiti i dati del workspace.",
    description:
      "I dati inseriti in questa demo vengono usati solo per autenticazione, sessione utente e gestione delle attivita'.",
    details: [
      "Le password non vengono salvate in chiaro e il profilo utente resta disponibile solo dentro l'app.",
      "Le sessioni vengono mantenute nel browser che sto usando per la demo e non sono pensate per ambienti pubblici.",
      "Le immagini profilo e i contenuti di bacheca servono solo a mostrare il funzionamento del progetto finale.",
    ],
  },
  {
    id: "termini",
    label: "Termini",
    eyebrow: "Termini",
    title: "Ambito d'uso del progetto.",
    description:
      "PixelForge Studio Workspace e' una web app dimostrativa sviluppata per il progetto finale Start2Impact.",
    details: [
      "L'accesso e' pensato per test, presentazione e revisione del flusso applicativo.",
      "La piattaforma non e' pensata per uso commerciale o pubblico nella sua forma attuale.",
      "Le funzionalita' mostrate servono a certificare competenze full stack su autenticazione, API e interfaccia utente.",
    ],
  },
  {
    id: "stato",
    label: "Stato servizio",
    eyebrow: "Stato servizio",
    title: "Funzionalita' attive nella versione attuale.",
    description:
      "Registrazione, login, logout, recupero sessione, board task, profilo, bacheca e notifiche sono operativi.",
    details: [
      "I dati vengono mantenuti in persistenza locale di sviluppo, quindi il servizio e' adatto a demo controllate.",
      "Il flusso di caricamento immagini profilo, aggiornamento task e messaggi del team e' gia' consultabile nell'area riservata.",
      "Questa versione e' ottimizzata per presentazione e valutazione del progetto finale, non per produzione reale.",
    ],
  },
  {
    id: "contatti",
    label: "Contatti",
    eyebrow: "Contatti",
    title: "Richiedi informazioni sulla demo.",
    description:
      "Questo form e' dimostrativo e mi serve solo per mostrare come potrebbe apparire un contatto interno al progetto.",
    details: [
      "Posso simulare una richiesta per collaborazione, supporto o revisione del workspace.",
    ],
  },
];

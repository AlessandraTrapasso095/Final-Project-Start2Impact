// questo file mi serve per tenere in un punto solo tutti i percorsi del layer dati.
// lo uso per evitare di riscrivere il path del file di storage in servizi e repository diversi.

import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);

// mi serve per ricavare il percorso assoluto della cartella storage.
// questo mi evita problemi se lancio il server da posizioni diverse del terminale.
export const storageDirectoryPath = path.resolve(currentDirectoryPath, "../../storage");

// mi serve per puntare sempre allo stesso file dati commentato.
export const storageFilePath = path.join(storageDirectoryPath, "app-data.jsonc");

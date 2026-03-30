// lo uso per evitare di riscrivere il path del file di storage in servizi e repository diversi.

import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);

// mi serve per ricavare il percorso assoluto della cartella storage.
export const storageDirectoryPath = path.resolve(currentDirectoryPath, "../../storage");

export const storageFilePath = path.join(storageDirectoryPath, "app-data.jsonc");

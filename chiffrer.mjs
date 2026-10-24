// My-QHSE – chiffrer un document réservé à l'administrateur.
// Utilisation (Node 18+) :
//   QHSE_CODE="XXXX-XXXX-XXXX-XXXX" node outils-admin/chiffrer.mjs documents-source/mon-fichier.xlsx documents/mon-fichier.xlsx.enc
// Le code n'est jamais écrit dans un fichier. Le sel et le nombre d'itérations sont lus dans documents-acces.js.
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto, randomBytes } from "node:crypto";

const [, , entree, sortie] = process.argv;
const code = (process.env.QHSE_CODE || "").trim().toUpperCase().replace(/\s+/g, "");
if (!entree || !sortie || !code) {
  console.error('Usage : QHSE_CODE="XXXX-XXXX-XXXX-XXXX" node chiffrer.mjs <fichier> <fichier.enc>');
  process.exit(1);
}
const conf = readFileSync(new URL("../documents-acces.js", import.meta.url), "utf8");
const sel = Buffer.from(/sel:\s*"([^"]+)"/.exec(conf)[1], "base64");
const iterations = parseInt(/iterations:\s*(\d+)/.exec(conf)[1], 10);

const base = await webcrypto.subtle.importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveKey"]);
const cle = await webcrypto.subtle.deriveKey({ name: "PBKDF2", salt: sel, iterations, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const iv = randomBytes(12);
const chiffre = Buffer.from(await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, cle, readFileSync(entree)));
writeFileSync(sortie, Buffer.concat([iv, chiffre]));
console.log("Chiffré :", sortie, "(" + (chiffre.length + 12) + " octets)");

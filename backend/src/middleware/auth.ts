import { IncomingMessage, ServerResponse } from "http";

const API_KEY_SECRETA = "12345";

export function requireAuth(req: IncomingMessage, res: ServerResponse, next: () => void): void {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Acesso negado. Chave de API ausente." }));
        return;
    }

    const providedKey = authHeader;

    if (providedKey !== API_KEY_SECRETA) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Chave de API inválida." }));
        return;
    }

    next();
}
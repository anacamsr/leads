import * as http from "http";
import { router } from "./routes";
import { initDB } from "./initDb";
import { IncomingMessage, ServerResponse } from "http";

// --- Configurações CORS ---
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = "http://localhost:3000"; 
const ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization";

function handleCors(req: IncomingMessage, res: ServerResponse): boolean {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS);
  res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);
  res.setHeader('Access-Control-Allow-Credentials', 'true'); 

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

const server = http.createServer(async (req, res) => {
    if (handleCors(req, res)) {
        return; 
    }
    router(req, res);
});

initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  });
});
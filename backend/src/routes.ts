import { IncomingMessage, ServerResponse } from "http";
import { parse } from 'url';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from "./controllers";
import { requireAuth } from "./middleware/auth";

export const parseBody = (req: IncomingMessage): Promise<any> =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });

const protectedRoute = (req: IncomingMessage, res: ServerResponse, callback: () => void) => {
  requireAuth(req, res, callback);
};

export async function router(req: IncomingMessage, res: ServerResponse) {

  res.setHeader("Content-Type", "application/json");

  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = parse(req.url || '', true);
  const path = parsedUrl.pathname;
  const method = req.method;

  if (path === "/api/leads/export/csv" && method === "GET") {
    return protectedRoute(req, res, () => exportLeads(res));
  }

  // GET /api/leads: 
  if (path === "/api/leads" && method === "GET") {
    return protectedRoute(req, res, () => {
      getLeads(res, parsedUrl.query);
    });
  }

  // POST /api/leads:
  if (path === "/api/leads" && method === "POST") {
    const leadBody = await parseBody(req);

    const dataToSave = {
      ...leadBody,
      ...parsedUrl.query,
    };

    return createLead(dataToSave, res);
  }

  if (path?.startsWith("/api/leads/")) {
    const id = path.split("/")[3];

    if (!id) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "ID não fornecido" }));
    }

    if (method === "GET") {
      return protectedRoute(req, res, () => getLeadById(id, res));
    }

    if (method === "PUT") {
      return protectedRoute(req, res, () => updateLead(req, res, id));
    }

    if (method === "DELETE") {
      return protectedRoute(req, res, () => deleteLead(res, id));
    }
  }

  // Default 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
}
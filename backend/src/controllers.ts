import { pool } from "./db";
import { IncomingMessage, ServerResponse } from "http";
import { parseBody } from "./routes";
import { exportToCSV } from "./utils/exportCSV";

interface LeadQueryParams {
  searchTerm?: string;
  _page?: string;
  _limit?: string;
  _sort?: string;
  _order?: string;
}

// GET /api/leads
export async function getLeads(res: ServerResponse, params: LeadQueryParams) {
  const { searchTerm, _page, _limit, _sort, _order } = params;

  const page = parseInt(_page || '1', 10);
  const limit = parseInt(_limit || '10', 10);
  const sortBy = _sort || 'id';
  const sortOrder = (_order || 'desc').toUpperCase();
  const offset = (page - 1) * limit;

  let whereClause = "";
  let searchParams: string[] = []; // Renomeado para clareza

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // SQL Corrigido: usando LOWER()
    whereClause = " WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ?";
    
    const searchPattern = `%${lowerSearchTerm}%`;
    
    searchParams = [searchPattern, searchPattern];
  }

  try {
    // 1. QUERY DE CONTAGEM (USA APENAS OS PARÂMETROS DE BUSCA)
    const countSql = `SELECT COUNT(id) AS total FROM leads${whereClause}`;
    const [countRows]: any = await pool.query(countSql, searchParams); // Usa apenas searchParams
    const totalLeads = countRows[0].total;

    // 2. QUERY DE SELEÇÃO
    let sql = `SELECT * FROM leads${whereClause}`;

    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    sql += ` LIMIT ? OFFSET ?`;

    // 3. CRIAÇÃO DO ARRAY FINAL DE PARÂMETROS (BUSCA + PAGINAÇÃO)
    // Clonamos searchParams e adicionamos os números (limit e offset) no final.
    const dataParams = [...searchParams, limit, offset]; 
    
    // 🚨 DEBUG: Você pode reativar este log para conferir a ordem dos parâmetros.
    // console.log("SQL Final:", sql);
    // console.log("Parâmetros Finais (dataParams):", dataParams);
    
    const [rows] = await pool.query(sql, dataParams);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Total-Count': totalLeads.toString()
    });

    res.end(JSON.stringify(rows));

  } catch (err) {
    console.error("Erro na busca de Leads:", err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Erro interno ao buscar leads." }));
  }
}


// GET /api/leads/:id
export async function getLeadById(id: string, res: ServerResponse) {
  const [rows]: any = await pool.query("SELECT * FROM leads WHERE id = ?", [id]);
  if (!rows.length) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Lead não encontrado" }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify(rows[0]));
  }
}

// POST /api/leads 
export async function createLead(dataToSave: any, res: ServerResponse) {

  const {
    name,
    email,
    phone,
    role,
    birthDate,
    message,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    fbclid,
  } = dataToSave;

  try {
    const sql = `
        INSERT INTO leads 
        (name, email, phone, role, birthDate, message, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    const values = [
      name,
      email,
      phone,
      role,
      birthDate,
      message,
      utm_source || null,
      utm_medium || null,
      utm_campaign || null,
      utm_term || null,
      utm_content || null,
      gclid || null,
      fbclid || null,
    ];

    await pool.query(sql, values);

    res.writeHead(201);
    res.end(JSON.stringify({ message: "Lead criado com sucesso", data: dataToSave }));

  } catch (err) {
    console.error("Erro ao inserir Lead:", err);
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Erro ao criar lead. Verifique os dados e o banco." }));
  }
}

// PUT /api/leads/:id
export async function updateLead(req: IncomingMessage, res: ServerResponse, id: string) {
  try {
    const body = await parseBody(req);
    await pool.query("UPDATE leads SET ? WHERE id = ?", [body, id]);
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Lead atualizado com sucesso" }));
  } catch (err) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Erro ao atualizar lead" }));
  }
}

// DELETE /api/leads/:id
export async function deleteLead(res: ServerResponse, id: string) {
  await pool.query("DELETE FROM leads WHERE id = ?", [id]);
  res.writeHead(200);
  res.end(JSON.stringify({ message: "Lead deletado com sucesso" }));
}

// GET /api/leads/export/csv
export async function exportLeads(res: ServerResponse) {
  const [rows]: any = await pool.query("SELECT * FROM leads");
  const csv = exportToCSV(rows);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.writeHead(200);
  res.end(csv);
}
export function exportToCSV(rows: any[]): string {
    if (!rows.length) return "";
  
    const headers = Object.keys(rows[0]).join(",");
    const data = rows.map(r => Object.values(r).join(",")).join("\n");
  
    return `${headers}\n${data}`;
  }  
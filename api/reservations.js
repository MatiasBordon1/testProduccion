// /api/reservations.js
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets('v4');
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const TAB = process.env.GOOGLE_SHEETS_TAB || 'Reservas';

export default async function handler(req, res) {
  try {
    const client = await auth.getClient();

    // 🔹 GET — obtener todas las reservas
    if (req.method === 'GET') {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!A:F`,
        auth: client,
      });

      const rows = response.data.values || [];
      const headers = rows.shift(); // quita la primera fila (encabezados)
      const reservas = rows.map((r) => ({
        lote: r[0],
        nombre: r[1],
        correo: r[2],
        telefono: r[3],
        mostrarComo: r[4],
        timestamp: r[5],
      }));

      return res.status(200).json({ ok: true, rows: reservas });
    }

    // 🔹 POST — agregar nueva reserva
    if (req.method === 'POST') {
      const { lotId, firstName, email, phone, displayName, anonymous } = req.body;

      const values = [[
        lotId,
        firstName,
        email,
        phone,
        anonymous ? 'Anónimo' : displayName,
        new Date().toLocaleString(),
      ]];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!A:F`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
        auth: client,
      });

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error Sheets:', error);
    return res.status(500).json({ error: error.message });
  }
}

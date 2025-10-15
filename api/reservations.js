// api/reservations.js
import { getSheets, getSpreadsheetId } from './sheets.js';

const TAB = process.env.GOOGLE_SHEETS_TAB || 'Reservas';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const { lotId, firstName, email, phone, displayName, anonymous } = body;

      if (!lotId || !firstName || !email) {
        return res.status(400).json({ ok: false, error: 'Campos requeridos: lotId, firstName, email' });
      }

      const row = [
        new Date().toISOString(),
        String(lotId),
        String(firstName),
        String(email),
        phone ? String(phone) : '',
        anonymous ? 'Anónimo' : (displayName || 'Anónimo'),
      ];

      const sheets = await getSheets();
      await sheets.spreadsheets.values.append({
        spreadsheetId: getSpreadsheetId(),
        range: `${TAB}!A:F`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      });

      return res.status(201).json({ ok: true });
    }

    if (req.method === 'GET') {
      const sheets = await getSheets();
      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId: getSpreadsheetId(),
        range: `${TAB}!A:F`,
        majorDimension: 'ROWS',
      });
      return res.status(200).json({ ok: true, rows: resp.data.values || [] });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e) {
    console.error('Error Sheets:', e);
    const status = /PERMISSION|forbidden/i.test(e.message) ? 403 : 500;
    return res.status(status).json({ ok: false, error: e.message });
  }
}

// src/api/client.js
const BASE = import.meta.env.VITE_API_BASE || '/api';

/**
 * Envía una reserva al backend (Vercel Function)
 */
export async function appendReservation(lotId, data) {
  const res = await fetch(`${BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lotId,
      firstName: data.firstName,
      email: data.email,
      phone: data.phone,
      displayName: data.displayName,
      anonymous: data.anonymous,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Error HTTP');
  return json;
}

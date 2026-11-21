import { Ticket } from '../models/Ticket'
import { TicketPage } from '../models/TicketPage'

// Vide par défaut : on appelle /api/... sur la même origine (proxy Vite ou nginx).
// Pour viser une API distante : VITE_API_URL=https://mon-api.exemple (CORS requis).
const ENDPOINT = `${import.meta.env.VITE_API_URL ?? ''}/api/tickets`

export class ApiError extends Error {
  constructor(message, status, violations = []) {
    super(message)
    this.status = status
    this.violations = violations // erreurs de validation (422) : [{ propertyPath, message }]
  }
}

async function request(url, { headers, ...options } = {}) {
  let response
  try {
    response = await fetch(url, { ...options, headers: { Accept: 'application/ld+json', ...headers } })
  } catch {
    throw new ApiError("Impossible de joindre l'API.", 0)
  }

  if (response.status === 204) return null // DELETE réussi : pas de corps

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.detail ?? data?.['hydra:description'] ?? `Erreur ${response.status}`
    throw new ApiError(message, response.status, data?.violations ?? [])
  }
  return data
}

export async function fetchTickets({ page = 1, title, status, priority } = {}) {
  const query = new URLSearchParams({ page })
  if (title) query.set('title', title)
  if (status) query.set('status', status)
  if (priority) query.set('priority', priority)

  return TicketPage.fromApi(await request(`${ENDPOINT}?${query}`))
}

export async function fetchTicket(id) {
  return Ticket.fromApi(await request(`${ENDPOINT}/${id}`))
}

export async function createTicket(dto) {
  const data = await request(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/ld+json' },
    body: JSON.stringify(dto),
  })
  return Ticket.fromApi(data)
}

export async function updateTicket(id, dto) {
  const data = await request(`${ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(dto),
  })
  return Ticket.fromApi(data)
}

export async function deleteTicket(id) {
  await request(`${ENDPOINT}/${id}`, { method: 'DELETE' })
}

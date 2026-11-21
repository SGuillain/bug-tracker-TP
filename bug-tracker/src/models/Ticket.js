// Valeurs acceptées par l'API (enums TicketStatus et TicketPriority côté Symfony)
export const TICKET_STATUSES = [
  { value: 'open', label: 'Ouvert' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'resolved', label: 'Résolu' },
]

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
]

const labelOf = (list, value) => list.find((item) => item.value === value)?.label ?? value

/** Ticket tel que renvoyé par l'API (GET / PATCH). */
export class Ticket {
  constructor({ id, title, description, status, priority, createdAt }) {
    this.id = id
    this.title = title
    this.description = description
    this.status = status
    this.priority = priority
    this.createdAt = createdAt
  }

  static fromApi(json) {
    return new Ticket({ ...json, createdAt: new Date(json.createdAt) })
  }

  get statusLabel() {
    return labelOf(TICKET_STATUSES, this.status)
  }

  get priorityLabel() {
    return labelOf(TICKET_PRIORITIES, this.priority)
  }

  get createdAtLabel() {
    return this.createdAt.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
  }
}

/** Corps de la requête POST /api/tickets (groupe ticket:write). */
export class TicketCreateDto {
  constructor({ title, description, priority }) {
    this.title = title.trim()
    this.description = description.trim()
    this.priority = priority
  }
}

/** Corps de la requête PATCH /api/tickets/{id} (groupe ticket:patch). */
export class TicketPatchDto {
  constructor({ status, priority }) {
    if (status !== undefined) this.status = status
    if (priority !== undefined) this.priority = priority
  }
}

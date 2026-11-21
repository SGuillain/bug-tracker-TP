import { Ticket } from './Ticket'

/**
 * Une page de résultats de GET /api/tickets.
 * L'API renvoie du JSON-LD (Hydra) : selon la config d'API Platform les clés
 * sont préfixées ("hydra:member") ou non ("member"), on accepte les deux.
 */
export class TicketPage {
  constructor({ tickets, totalItems, totalPages }) {
    this.tickets = tickets
    this.totalItems = totalItems
    this.totalPages = totalPages
  }

  static fromApi(json) {
    const members = json.member ?? json['hydra:member'] ?? []
    const view = json.view ?? json['hydra:view'] ?? {}
    const lastLink = view.last ?? view['hydra:last'] ?? ''
    const lastPage = /[?&]page=(\d+)/.exec(lastLink)

    return new TicketPage({
      tickets: members.map(Ticket.fromApi),
      totalItems: json.totalItems ?? json['hydra:totalItems'] ?? members.length,
      totalPages: lastPage ? Number(lastPage[1]) : 1,
    })
  }
}

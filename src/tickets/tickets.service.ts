import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Cannot Login to account',
      description: 'I am unable to login to my account since yesterday.',
      priority: 'high',
      status: 'open',
      createdAt: '2023-06-01T10:00:00Z',
    },
    {
      id: 2,
      subject: 'Feature Request: Dark Mode',
      description: 'It would be great to have a dark mode option in the app.',
      priority: 'medium',
      status: 'open',
      createdAt: '2023-06-02T14:30:00Z',
    },
    {
      id: 3,
      subject: 'Bug: App crashes on startup',
      description: 'The app crashes immediately after launching on my device.',
      priority: 'high',
      status: 'open',
      createdAt: '2023-06-03T09:15:00Z',
    },
    {
      id: 4,
      subject: 'Payment Issue',
      description: 'I was charged twice for my subscription this month.',
      priority: 'high',
      status: 'closed',
      createdAt: '2023-06-04T11:45:00Z',
    },
    {
      id: 5,
      subject: 'Question about API usage',
      description:
        'Can you provide more details on the rate limits for the API?',
      priority: 'low',
      status: 'closed',
      createdAt: '2023-06-05T16:20:00Z',
    },
  ];

  findAll(status?: Ticket['status'], priority?: Ticket['priority']): Ticket[] {
    let tickets = this.tickets;

    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status);
    }

    if (priority) {
      tickets = tickets.filter((ticket) => ticket.priority === priority);
    }

    return tickets;
  }

  findOne(id: number): Ticket | undefined {
    const ticket = this.tickets.find((ticket) => ticket.id === id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  create(createTicketDto: CreateTicketDto): Ticket {
    const newTicket: Ticket = {
      id: this.tickets.length + 1,
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      priority: createTicketDto.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.tickets.push(newTicket);
    return newTicket;
  }
}

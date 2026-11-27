export interface IEvent {
    id: number;
    title: string;
    description: string;
    category: string;
    date: Date;
    location: string;
    total_seats: number;
    available_seats: number;
    price: string;
    organizer_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface EventOrganizer {
    id: number;
    name: string;
    email: string;
}

export interface IEventWithOrganizer extends IEvent {
    organizer: EventOrganizer;
}

export interface EventUpdateData {
    title: string;
    description: string;
    category: string;
    date: Date | string;
    location: string;
    total_seats: number;
    available_seats: number;
    price: number | string;
}
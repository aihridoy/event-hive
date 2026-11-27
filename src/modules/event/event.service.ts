import { AppError } from "../../utils/AppError";
import type { IEvent, IEventWithOrganizer } from "./event.interface";
import { EventRepository } from "./event.repository";
import type { CreateEventInput, UpdateEventInput } from "./event.validation";

const createEvent = async (payload: CreateEventInput, organizerId: number): Promise<IEvent> => {
    return EventRepository.create(payload, organizerId);
};

const getAllEvents = async (search: string): Promise<IEvent[]> => {
    return EventRepository.findAll(search)
};

const getEventById = async (id: number): Promise<IEventWithOrganizer> => {
    const event = await EventRepository.findById(id);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    const organizer = await EventRepository.findOrganizer(event.organizer_id);

    if (!organizer) {
        throw new AppError(404, "Organizer not found");
    }

    return { ...event, organizer };
};

const updateEvent = async (id: number, userId: number, payload: UpdateEventInput): Promise<IEvent> => {
    const event = await EventRepository.findById(id);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    if (event.organizer_id !== userId) {
        throw new AppError(403, "You can only update your own events");
    }

    let availableSeats = event.available_seats;

    if (payload.total_seats !== undefined) {
        const soldTickets = await EventRepository.getSoldTickets(id);

        if (payload.total_seats < soldTickets) {
            throw new AppError(400, `Total seats cannot be lower than tickets already sold (${soldTickets})`);
        }

        availableSeats = payload.total_seats - soldTickets;
    }

    return EventRepository.update(id, {
        ...event,
        ...payload,
        available_seats: availableSeats,
    });
};

const deleteEvent = async (id: number, userId: number): Promise<void> => {
    const event = await EventRepository.findById(id);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    if (event.organizer_id !== userId) {
        throw new AppError(403, "You can only delete your own events");
    }

    const soldTickets = await EventRepository.getSoldTickets(id);

    if (soldTickets > 0) {
        throw new AppError(400, "Cannot delete an event that has confirmed bookings");
    }

    await EventRepository.remove(id);
};

export const EventService = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
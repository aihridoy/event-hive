import { pool } from "../../config/db";
import type { EventOrganizer, EventUpdateData, IEvent } from "./event.interface";
import type { CreateEventInput } from "./event.validation";

const create = async (payload: CreateEventInput, organizerId: number): Promise<IEvent> => {
    const result = await pool.query<IEvent>(
        `INSERT INTO events (title, description, category, date, location, total_seats, available_seats, price, organizer_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
            payload.title,
            payload.description,
            payload.category,
            payload.date,
            payload.location,
            payload.total_seats,
            payload.total_seats,
            payload.price,
            organizerId,
        ],
    );

    return result.rows[0] as IEvent;
};

const findAll = async (search: string): Promise<IEvent[]> => {
    const result = await pool.query<IEvent>(
        `SELECT * FROM events
         WHERE title ILIKE $1 OR description ILIKE $1
         ORDER BY created_at DESC`,
        [`%${search}%`],
    );

    return result.rows;
};

const findById = async (id: number): Promise<IEvent | undefined> => {
    const result = await pool.query<IEvent>(
        "SELECT * FROM events WHERE id = $1",
        [id],
    );

    return result.rows[0];
};

const findOrganizer = async (organizerId: number): Promise<EventOrganizer | undefined> => {
    const result = await pool.query<EventOrganizer>(
        "SELECT id, name, email FROM users WHERE id = $1",
        [organizerId],
    );

    return result.rows[0];
};

const getSoldTickets = async (eventId: number): Promise<number> => {
    const result = await pool.query<{ sold: number }>(
        `SELECT COALESCE(SUM(tickets_booked), 0)::int AS sold
         FROM bookings
         WHERE event_id = $1 AND status = 'confirmed'`,
        [eventId],
    );

    return result.rows[0]?.sold ?? 0;
};

const update = async (id: number, data: EventUpdateData): Promise<IEvent> => {
    const result = await pool.query<IEvent>(
        `UPDATE events
         SET title = $1, description = $2, category = $3, date = $4, location = $5,
             total_seats = $6, available_seats = $7, price = $8
         WHERE id = $9
         RETURNING *`,
        [
            data.title,
            data.description,
            data.category,
            data.date,
            data.location,
            data.total_seats,
            data.available_seats,
            data.price,
            id,
        ],
    );

    return result.rows[0] as IEvent;
};

const remove = async (id: number): Promise<void> => {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
};

export const EventRepository = {
    create,
    findAll,
    findById,
    findOrganizer,
    getSoldTickets,
    update,
    remove,
};
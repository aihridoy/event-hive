import type { Request, Response } from "express";
import { EventService } from "./event.service";
import { sendResponse } from "../../utils/sendResponse";
import { parseId } from "../../utils/parseId";

const createEvent = async (req: Request, res: Response): Promise<void> => {
    const event = await EventService.createEvent(req.body, req.user!.id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Event created successfully",
        data: event,
    });
};

const getAllEvents = async (req: Request, res: Response): Promise<void> => {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const events = await EventService.getAllEvents(search);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Events retrieved successfully",
        data: events,
    });
};

const getEventById = async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id, "event");
    const event = await EventService.getEventById(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Event retrieved successfully",
        data: event,
    });
};

const updateEvent = async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id, "event");
    const event = await EventService.updateEvent(id, req.user!.id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Event updated successfully",
        data: event,
    });
};

const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id, "event");
    await EventService.deleteEvent(id, req.user!.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Event deleted successfully",
        data: null,
    });
};

export const EventController = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
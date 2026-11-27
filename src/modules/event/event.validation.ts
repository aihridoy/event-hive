import { z } from "zod";

export const createEventSchema = z.object({
    title: z.string({ error: "Title is required" }).trim().min(1, "Title is required"),
    description: z.string({ error: "Description is required" }).trim().min(1, "Description is required"),
    category: z.string({ error: "Category is required" }).trim().min(1, "Category is required").max(50, "Category must be at most 50 characters"),
    date: z.iso.datetime({ offset: true, error: "Date must be a valid ISO 8601 date-time" }),
    location: z.string({ error: "Location is required" }).trim().min(1, "Location is required"),
    total_seats: z.number({ error: "Total seats must be a number" })
        .int("Total seats must be a whole number")
        .positive("Total seats must be greater than 0")
        .max(2147483647, "Total seats is too large"),
    price: z.number({ error: "Price must be a number" })
        .min(0, "Price must be 0 or greater")
        .max(99999999.99, "Price is too large"),
});

export const updateEventSchema = createEventSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { error: "At least one field is required to update" },
);

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
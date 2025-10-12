// src/modules/events/event.service.js
import {
  findEvents,
  findEventById,
  createEvent,
  updateEvent,
  getBookedSeats,
  getCurrentUserEvents
} from "./event.model.js";


export const eventService = {
  async listEvents(query) {
    const { start, end, limit, offset } = query;
    return await findEvents(start, end, limit, offset );
  },
 async listCurrentUserEvents(id) {
    return await getCurrentUserEvents(id);
  },

  async getEvent(id) {
    const event = await findEventById(id);
    if (!event) throw new Error("Event not found");
    return event;
  },

  async createEvent(reqBody, userId) {
    const { title, description, date, total_seats } = reqBody;

    if (!title || !date || !total_seats) {
      throw new Error("title, date and total_seats are required");
    }

    const eventDate = new Date(date);
    if (eventDate <= new Date()) {
      throw new Error("Event date must be in the future");
    }

    return await createEvent({ title, description, date: eventDate, total_seats, created_by: userId });
  },

  async updateEvent(id, reqBody, userId) {
    const event = await findEventById(id);
    if (!event) throw new Error("Event not found");
    if (event.created_by !== userId) throw new Error("Not authorized to update this event");

    const bookedSeats = await getBookedSeats(id);
    if (reqBody.total_seats < bookedSeats) {
      throw new Error("Cannot reduce total seats below already booked seats");
    }

    return await updateEvent(id, reqBody);
  }
};

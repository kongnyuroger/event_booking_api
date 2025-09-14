
import { eventService } from "./event.service.js";

export const eventController = {
  async listEvents(req, res) {
    try {
      const events = await eventService.listEvents(req.query);
      res.json(events);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getEvent(req, res) {
    try {
      const event = await eventService.getEvent(req.params.id);
      res.json(event);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async createEvent(req, res) {
    try {
      const userId = req.user.id; 
      const event = await eventService.createEvent(req.body, userId);
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateEvent(req, res) {
    try {
      const userId = req.user.id;
      const event = await eventService.updateEvent(req.params.id, req.body, userId);
      res.json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};


import { eventService } from "./event.service.js";

export const eventController = {

async getEvents(req, res, next) {
  try {
    const { limit, offset, start, end } = req.query;
    const events = await eventService.listEvents({ 
      offset: parseInt(offset) || 0, 
      limit: parseInt(limit) || 5, 
      start, 
      end 
    });
  
    res.json(events);
  } catch (err) {
    next(err);
  }
},

async searchingEvents(req, res, next) {
  try {
    const {q, limit, offset,  } = req.query;
    const events = await eventService.search({ 
      q,
      offset: parseInt(offset) || 0, 
      limit: parseInt(limit) || 6, 
    });
  
    res.json(events);
  } catch (err) {
    next(err);
  }
},

async getEventsLoginUser(req, res, next) {
  try {
    const id = req.user.id
    console.log(id)
    const events = await eventService.listCurrentUserEvents(
     id
    );
  
    res.json(events);
  } catch (err) {
    next(err);
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

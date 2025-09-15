
import { bookingService } from "./booking.service.js";

export const bookingController = {
  async createBooking(req, res) {
    try {
      const { seats } = req.body;
      const eventId = req.params.id;
      const userId = req.user.id;
      const booking = await bookingService.bookSeats(eventId, seats, userId);
      res.status(201).json(booking);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listBookings(req, res) {
    try {
      const userId = req.user.id;
      const bookings = await bookingService.listUserBookings(userId);
      res.json(bookings);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async cancelBooking(req, res) {
    try {
      const bookingId = req.params.id;
      const userId = req.user.id;
      const booking = await bookingService.cancelBooking(bookingId, userId);
      res.json({ message: "Booking cancelled", booking });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

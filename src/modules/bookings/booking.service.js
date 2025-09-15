
import {
  createBooking,
  findBookingsByUser,
  deleteBooking,
  findBookingById
} from "./booking.model.js";

export const bookingService = {
  async bookSeats(eventId, seats, userId) {
    if (!seats || seats <= 0) throw new Error("Seats must be greater than 0");
    return await createBooking(eventId, userId, seats);
  },

  async listUserBookings(userId) {
    return await findBookingsByUser(userId);
  },

  async cancelBooking(bookingId, userId) {
    const booking = await findBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.user_id !== userId) throw new Error("Not authorized to cancel this booking");

    return await deleteBooking(bookingId, userId);
  }
};

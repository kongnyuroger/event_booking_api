
import pool from "../../config/db.js";

export async function createBooking(eventId, userId, seats) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const eventResult = await client.query(
      "SELECT * FROM events WHERE id = $1 FOR UPDATE",
      [eventId]
    );
    const event = eventResult.rows[0];
    if (!event) throw new Error("Event not found");

    if (event.available_seats < seats) {
      throw new Error("Not enough available seats");
    }

    await client.query(
      "UPDATE events SET available_seats = available_seats - $1 WHERE id = $2",
      [seats, eventId]
    );

  
    const bookingResult = await client.query(
      `INSERT INTO bookings (event_id, user_id, seats_booked)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [eventId, userId, seats]
    );

    await client.query("COMMIT");
    return bookingResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// List bookings by user
export async function findBookingsByUser(userId) {
  const result = await pool.query(
    `SELECT b.*, e.title, e.date 
     FROM bookings b
     JOIN events e ON b.event_id = e.id
     WHERE b.user_id = $1
     ORDER BY b.booked_at DESC`,
    [userId]
  );
  return result.rows;
}

// Find booking by ID
export async function findBookingById(id) {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

// Delete booking + restore seats
export async function deleteBooking(id, userId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingResult = await client.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    const booking = bookingResult.rows[0];
    if (!booking) throw new Error("Booking not found or not authorized");

    // Restore seats
    await client.query(
      "UPDATE events SET available_seats = available_seats + $1 WHERE id = $2",
      [booking.seats_booked, booking.event_id]
    );

    // Delete booking
    await client.query("DELETE FROM bookings WHERE id = $1", [id]);

    await client.query("COMMIT");
    return booking;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

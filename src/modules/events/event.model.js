
import pool from "../../config/db.js";


export async function findEvents(start, end, limit, offset) {
  if (start && end) {
    const result = await pool.query(
      `SELECT * FROM events 
       WHERE date BETWEEN $1 AND $2 
       ORDER BY date ASC 
       LIMIT $3 OFFSET $4`,
      [start, end, limit, offset]
    );
    return result.rows;
  } else {
    const result = await pool.query(`SELECT * FROM events ORDER BY date ASC LIMIT $1 OFFSET $2`,[limit, offset]);
    return result.rows;
  }
}

export async function findEventById(id) {
  const result = await pool.query(
    `
    SELECT e.*, COALESCE(SUM(b.seats_booked), 0) AS seats_booked
    FROM events e
    LEFT JOIN bookings b ON e.id = b.event_id
    WHERE e.id = $1
    GROUP BY e.id
    `,
    [id]
  );
  return result.rows[0];
}


export async function createEvent({ title, description, date, total_seats, created_by }) {
  const result = await pool.query(
    `INSERT INTO events (title, description, date, total_seats, available_seats, created_by)
     VALUES ($1, $2, $3, $4, $4, $5)
     RETURNING *`,
    [title, description, date, total_seats, created_by]
  );
  return result.rows[0];
}


export async function updateEvent(id, { title, description, date, total_seats }) {
  const result = await pool.query(
    `UPDATE events
     SET title = $1, description = $2, date = $3, total_seats = $4
     WHERE id = $5
     RETURNING *`,
    [title, description, date, total_seats, id]
  );
  return result.rows[0];
}


export async function getBookedSeats(eventId) {
  const result = await pool.query(
    `SELECT COALESCE(SUM(seats_booked), 0) AS booked FROM bookings WHERE event_id = $1`,
    [eventId]
  );
  return result.rows[0].booked;
}

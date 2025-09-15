
import { Router } from "express";
import { bookingController } from "./booking.controller.js";
import authenticateToken from "../../middleware/auth.js";

const router = Router();

router.post("/events/:id/book", authenticateToken, bookingController.createBooking);
router.get("/bookings", authenticateToken, bookingController.listBookings);
router.delete("/bookings/:id", authenticateToken, bookingController.cancelBooking);

export default router;

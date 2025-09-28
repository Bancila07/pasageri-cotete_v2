import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactInquirySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Routes endpoints
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Schedules endpoints
  app.get("/api/schedules", async (req, res) => {
    try {
      const { from, to, date } = req.query;
      
      if (from && to) {
        const fromDate = date ? new Date(date as string) : undefined;
        const schedules = await storage.getAvailableSchedules(
          from as string, 
          to as string, 
          fromDate
        );
        res.json(schedules);
      } else {
        const schedules = await storage.getSchedules();
        res.json(schedules);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Pricing calculation endpoint
  app.post("/api/calculate-price", async (req, res) => {
    try {
      const { scheduleId, serviceType, quantity } = req.body;
      
      // Basic validation
      if (!scheduleId || !serviceType || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get schedule details to calculate price
      const schedules = await storage.getSchedules();
      const schedule = schedules.find(s => s.id === scheduleId);
      
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      let basePrice = 0;
      switch (serviceType) {
        case 'passenger':
          basePrice = parseFloat(schedule.basePricePassenger || "0");
          break;
        case 'package':
          basePrice = parseFloat(schedule.basePricePackage || "0");
          break;
        case 'car':
          basePrice = parseFloat(schedule.basePriceCar || "0");
          break;
        default:
          return res.status(400).json({ error: "Invalid service type" });
      }

      const totalPrice = basePrice * quantity;
      
      res.json({
        basePrice,
        quantity,
        totalPrice,
        currency: "EUR"
      });
    } catch (error) {
      console.error("Error calculating price:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Booking endpoints
  app.post("/api/bookings", async (req, res) => {
    try {
      // Validate request body - but ignore totalPrice as we'll calculate it server-side
      const { totalPrice, ...bookingDataWithoutPrice } = req.body;
      const validationResult = insertBookingSchema.omit({ totalPrice: true }).safeParse(bookingDataWithoutPrice);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const bookingData = validationResult.data;
      
      // Get schedule to calculate price server-side
      const schedules = await storage.getSchedules();
      const schedule = schedules.find(s => s.id === bookingData.scheduleId);
      
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      // Calculate server-side price (security: never trust client price)
      let quantity = 1;
      let basePrice = 0;

      switch (bookingData.serviceType) {
        case 'passenger':
          quantity = bookingData.passengerCount || 1;
          basePrice = parseFloat(schedule.basePricePassenger || "0");
          break;
        case 'package':
          quantity = parseFloat(bookingData.packageWeight || "0");
          basePrice = parseFloat(schedule.basePricePackage || "0");
          break;
        case 'car':
          quantity = 1;
          basePrice = parseFloat(schedule.basePriceCar || "0");
          break;
        default:
          return res.status(400).json({ error: "Invalid service type" });
      }

      const serverCalculatedPrice = (basePrice * quantity).toFixed(2);

      // Security fix: Check seat availability properly (including 0 seats)
      if (bookingData.serviceType === 'passenger') {
        const requiredSeats = bookingData.passengerCount || 1;
        if (schedule.availableSeats === null || schedule.availableSeats < requiredSeats) {
          return res.status(400).json({ 
            error: "Not enough seats available",
            availableSeats: schedule.availableSeats || 0,
            requestedSeats: requiredSeats
          });
        }
      }

      // Create booking with server-calculated price
      const bookingWithPrice = {
        ...bookingData,
        totalPrice: serverCalculatedPrice
      };

      const booking = await storage.createBooking(bookingWithPrice);

      // Update seat availability for passenger bookings
      if (booking.serviceType === 'passenger' && booking.passengerCount) {
        await storage.updateScheduleAvailability(booking.scheduleId, booking.passengerCount);
      }

      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      await storage.updateBookingStatus(req.params.id, status);
      
      const updatedBooking = await storage.getBooking(req.params.id);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Contact inquiry endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertContactInquirySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const inquiry = await storage.createContactInquiry(validationResult.data);
      
      // TODO: Send email notification here
      console.log("New contact inquiry received:", inquiry);
      
      res.status(201).json({ 
        message: "Contact inquiry submitted successfully",
        id: inquiry.id 
      });
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const inquiries = await storage.getContactInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Seed data endpoint (for development)
  app.post("/api/seed", async (req, res) => {
    try {
      // Create sample routes
      const moldovaGermanyRoute = await storage.createRoute({
        fromCity: "Chișinău",
        toCity: "Berlin",
        fromCountry: "Moldova",
        toCountry: "Germania",
        distance: 1200,
        estimatedDuration: 18,
        isActive: true
      });

      const moldovaHollandRoute = await storage.createRoute({
        fromCity: "Chișinău",
        toCity: "Amsterdam",
        fromCountry: "Moldova",
        toCountry: "Olanda",
        distance: 1400,
        estimatedDuration: 20,
        isActive: true
      });

      const moldovaBelgiumRoute = await storage.createRoute({
        fromCity: "Chișinău",
        toCity: "Brussels",
        fromCountry: "Moldova",
        toCountry: "Belgia",
        distance: 1350,
        estimatedDuration: 19,
        isActive: true
      });

      // Create sample schedules for next week
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      await storage.createSchedule({
        routeId: moldovaGermanyRoute.id,
        departureTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000),
        vehicleType: "autocar",
        maxPassengers: 55,
        availableSeats: 55,
        basePricePassenger: "45.00",
        basePricePackage: "8.00",
        basePriceCar: "350.00",
        status: "scheduled",
        driverInfo: { primary: "Ion Popescu", secondary: "Vasile Ionescu" }
      });

      await storage.createSchedule({
        routeId: moldovaHollandRoute.id,
        departureTime: new Date(dayAfterTomorrow.setHours(9, 0, 0, 0)),
        arrivalTime: new Date(dayAfterTomorrow.getTime() + 20 * 60 * 60 * 1000),
        vehicleType: "autocar",
        maxPassengers: 55,
        availableSeats: 55,
        basePricePassenger: "50.00",
        basePricePackage: "9.00",
        basePriceCar: "380.00",
        status: "scheduled",
        driverInfo: { primary: "Gheorghe Munteanu", secondary: "Mihai Ciobanu" }
      });

      res.json({ message: "Sample data created successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

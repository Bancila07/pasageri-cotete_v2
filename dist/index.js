var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  bookingsRelations: () => bookingsRelations,
  contactInquiries: () => contactInquiries,
  insertBookingSchema: () => insertBookingSchema,
  insertContactInquirySchema: () => insertContactInquirySchema,
  insertRouteSchema: () => insertRouteSchema,
  insertScheduleSchema: () => insertScheduleSchema,
  insertUserSchema: () => insertUserSchema,
  routes: () => routes,
  routesRelations: () => routesRelations,
  schedules: () => schedules,
  schedulesRelations: () => schedulesRelations,
  users: () => users
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  fromCountry: text("from_country").notNull(),
  toCountry: text("to_country").notNull(),
  distance: integer("distance"),
  // in kilometers
  estimatedDuration: integer("estimated_duration"),
  // in hours
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull().references(() => routes.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  // 'bus', 'van', etc.
  maxPassengers: integer("max_passengers").default(55),
  availableSeats: integer("available_seats").default(55),
  basePricePassenger: decimal("base_price_passenger", { precision: 10, scale: 2 }),
  basePricePackage: decimal("base_price_package", { precision: 10, scale: 2 }),
  // per kg
  basePriceCar: decimal("base_price_car", { precision: 10, scale: 2 }),
  status: text("status").default("scheduled"),
  // 'scheduled', 'in_transit', 'completed', 'cancelled'
  driverInfo: json("driver_info"),
  // {primary: "Name", secondary: "Name"}
  createdAt: timestamp("created_at").defaultNow()
});
var bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduleId: varchar("schedule_id").notNull().references(() => schedules.id),
  serviceType: text("service_type").notNull(),
  // 'passenger', 'package', 'car'
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  // Passenger-specific fields
  passengerCount: integer("passenger_count"),
  passengerNames: json("passenger_names"),
  // array of names
  // Package-specific fields
  packageWeight: decimal("package_weight", { precision: 10, scale: 2 }),
  packageDescription: text("package_description"),
  // Car-specific fields
  carMake: text("car_make"),
  carModel: text("car_model"),
  carYear: integer("car_year"),
  carPlateNumber: text("car_plate_number"),
  // Common fields
  pickupAddress: text("pickup_address"),
  deliveryAddress: text("delivery_address"),
  specialRequests: text("special_requests"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").default("pending"),
  // 'pending', 'paid', 'refunded'
  bookingStatus: text("booking_status").default("confirmed"),
  // 'confirmed', 'cancelled', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"),
  // 'new', 'in_progress', 'resolved'
  createdAt: timestamp("created_at").defaultNow()
});
var routesRelations = relations(routes, ({ many }) => ({
  schedules: many(schedules)
}));
var schedulesRelations = relations(schedules, ({ one, many }) => ({
  route: one(routes, {
    fields: [schedules.routeId],
    references: [routes.id]
  }),
  bookings: many(bookings)
}));
var bookingsRelations = relations(bookings, ({ one }) => ({
  schedule: one(schedules, {
    fields: [bookings.scheduleId],
    references: [schedules.id]
  })
}));
var insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true
});
var insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true
});
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, gte, desc, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // Route methods
  async createRoute(route) {
    const [newRoute] = await db.insert(routes).values(route).returning();
    return newRoute;
  }
  async getRoutes() {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }
  async getRoute(id) {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route || void 0;
  }
  // Schedule methods
  async createSchedule(schedule) {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }
  async getSchedules() {
    return await db.select().from(schedules).orderBy(desc(schedules.departureTime));
  }
  async getSchedulesByRoute(routeId) {
    return await db.select().from(schedules).where(eq(schedules.routeId, routeId)).orderBy(schedules.departureTime);
  }
  async getAvailableSchedules(fromCity, toCity, fromDate) {
    const query = db.select({
      id: schedules.id,
      routeId: schedules.routeId,
      departureTime: schedules.departureTime,
      arrivalTime: schedules.arrivalTime,
      vehicleType: schedules.vehicleType,
      maxPassengers: schedules.maxPassengers,
      availableSeats: schedules.availableSeats,
      basePricePassenger: schedules.basePricePassenger,
      basePricePackage: schedules.basePricePackage,
      basePriceCar: schedules.basePriceCar,
      status: schedules.status,
      driverInfo: schedules.driverInfo,
      createdAt: schedules.createdAt
    }).from(schedules).innerJoin(routes, eq(schedules.routeId, routes.id)).where(
      and(
        eq(routes.fromCity, fromCity),
        eq(routes.toCity, toCity),
        eq(routes.isActive, true),
        eq(schedules.status, "scheduled"),
        fromDate ? gte(schedules.departureTime, fromDate) : void 0
      )
    ).orderBy(schedules.departureTime);
    return await query;
  }
  async updateScheduleAvailability(scheduleId, seatsToReduce) {
    await db.update(schedules).set({
      availableSeats: sql2`${schedules.availableSeats} - ${seatsToReduce}`
    }).where(eq(schedules.id, scheduleId));
  }
  // Booking methods
  async createBooking(booking) {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }
  async getBookings() {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  async getBooking(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || void 0;
  }
  async updateBookingStatus(id, status) {
    await db.update(bookings).set({
      bookingStatus: status,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(bookings.id, id));
  }
  // Contact inquiry methods
  async createContactInquiry(inquiry) {
    const [newInquiry] = await db.insert(contactInquiries).values(inquiry).returning();
    return newInquiry;
  }
  async getContactInquiries() {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }
  async updateContactInquiryStatus(id, status) {
    await db.update(contactInquiries).set({ status }).where(eq(contactInquiries.id, id));
  }
  // Legacy user methods (keep for compatibility)
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/api/routes", async (req, res) => {
    try {
      const routes2 = await storage.getRoutes();
      res.json(routes2);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/schedules", async (req, res) => {
    try {
      const { from, to, date } = req.query;
      if (from && to) {
        const fromDate = date ? new Date(date) : void 0;
        const schedules2 = await storage.getAvailableSchedules(
          from,
          to,
          fromDate
        );
        res.json(schedules2);
      } else {
        const schedules2 = await storage.getSchedules();
        res.json(schedules2);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/calculate-price", async (req, res) => {
    try {
      const { scheduleId, serviceType, quantity } = req.body;
      if (!scheduleId || !serviceType || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const schedules2 = await storage.getSchedules();
      const schedule = schedules2.find((s) => s.id === scheduleId);
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }
      let basePrice = 0;
      switch (serviceType) {
        case "passenger":
          basePrice = parseFloat(schedule.basePricePassenger || "0");
          break;
        case "package":
          basePrice = parseFloat(schedule.basePricePackage || "0");
          break;
        case "car":
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
  app2.post("/api/bookings", async (req, res) => {
    try {
      const { totalPrice, ...bookingDataWithoutPrice } = req.body;
      const validationResult = insertBookingSchema.omit({ totalPrice: true }).safeParse(bookingDataWithoutPrice);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.errors
        });
      }
      const bookingData = validationResult.data;
      const schedules2 = await storage.getSchedules();
      const schedule = schedules2.find((s) => s.id === bookingData.scheduleId);
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }
      let quantity = 1;
      let basePrice = 0;
      switch (bookingData.serviceType) {
        case "passenger":
          quantity = bookingData.passengerCount || 1;
          basePrice = parseFloat(schedule.basePricePassenger || "0");
          break;
        case "package":
          quantity = parseFloat(bookingData.packageWeight || "0");
          basePrice = parseFloat(schedule.basePricePackage || "0");
          break;
        case "car":
          quantity = 1;
          basePrice = parseFloat(schedule.basePriceCar || "0");
          break;
        default:
          return res.status(400).json({ error: "Invalid service type" });
      }
      const serverCalculatedPrice = (basePrice * quantity).toFixed(2);
      if (bookingData.serviceType === "passenger") {
        const requiredSeats = bookingData.passengerCount || 1;
        if (schedule.availableSeats === null || schedule.availableSeats < requiredSeats) {
          return res.status(400).json({
            error: "Not enough seats available",
            availableSeats: schedule.availableSeats || 0,
            requestedSeats: requiredSeats
          });
        }
      }
      const bookingWithPrice = {
        ...bookingData,
        totalPrice: serverCalculatedPrice
      };
      const booking = await storage.createBooking(bookingWithPrice);
      if (booking.serviceType === "passenger" && booking.passengerCount) {
        await storage.updateScheduleAvailability(booking.scheduleId, booking.passengerCount);
      }
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/bookings", async (req, res) => {
    try {
      const bookings2 = await storage.getBookings();
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/bookings/:id", async (req, res) => {
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
  app2.patch("/api/bookings/:id/status", async (req, res) => {
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
  app2.post("/api/contact", async (req, res) => {
    try {
      const validationResult = insertContactInquirySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.errors
        });
      }
      const inquiry = await storage.createContactInquiry(validationResult.data);
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
  app2.get("/api/contact", async (req, res) => {
    try {
      const inquiries = await storage.getContactInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/seed", async (req, res) => {
    try {
      const moldovaGermanyRoute = await storage.createRoute({
        fromCity: "Chi\u0219in\u0103u",
        toCity: "Berlin",
        fromCountry: "Moldova",
        toCountry: "Germania",
        distance: 1200,
        estimatedDuration: 18,
        isActive: true
      });
      const moldovaHollandRoute = await storage.createRoute({
        fromCity: "Chi\u0219in\u0103u",
        toCity: "Amsterdam",
        fromCountry: "Moldova",
        toCountry: "Olanda",
        distance: 1400,
        estimatedDuration: 20,
        isActive: true
      });
      const moldovaBelgiumRoute = await storage.createRoute({
        fromCity: "Chi\u0219in\u0103u",
        toCity: "Brussels",
        fromCountry: "Moldova",
        toCountry: "Belgia",
        distance: 1350,
        estimatedDuration: 19,
        isActive: true
      });
      const now = /* @__PURE__ */ new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1e3);
      const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1e3);
      await storage.createSchedule({
        routeId: moldovaGermanyRoute.id,
        departureTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1e3),
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
        arrivalTime: new Date(dayAfterTomorrow.getTime() + 20 * 60 * 60 * 1e3),
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Routes table - defines available transportation routes
export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  fromCountry: text("from_country").notNull(),
  toCountry: text("to_country").notNull(),
  distance: integer("distance"), // in kilometers
  estimatedDuration: integer("estimated_duration"), // in hours
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schedules table - defines departure/arrival times for routes
export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull().references(() => routes.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  vehicleType: text("vehicle_type").notNull(), // 'bus', 'van', etc.
  maxPassengers: integer("max_passengers").default(55),
  availableSeats: integer("available_seats").default(55),
  basePricePassenger: decimal("base_price_passenger", { precision: 10, scale: 2 }),
  basePricePackage: decimal("base_price_package", { precision: 10, scale: 2 }), // per kg
  basePriceCar: decimal("base_price_car", { precision: 10, scale: 2 }),
  status: text("status").default("scheduled"), // 'scheduled', 'in_transit', 'completed', 'cancelled'
  driverInfo: json("driver_info"), // {primary: "Name", secondary: "Name"}
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings table - customer reservations
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduleId: varchar("schedule_id").notNull().references(() => schedules.id),
  serviceType: text("service_type").notNull(), // 'passenger', 'package', 'car'
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  
  // Passenger-specific fields
  passengerCount: integer("passenger_count"),
  passengerNames: json("passenger_names"), // array of names
  
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
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'paid', 'refunded'
  bookingStatus: text("booking_status").default("confirmed"), // 'confirmed', 'cancelled', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact inquiries table
export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"), // 'new', 'in_progress', 'resolved'
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const routesRelations = relations(routes, ({ many }) => ({
  schedules: many(schedules),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  route: one(routes, {
    fields: [schedules.routeId],
    references: [routes.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  schedule: one(schedules, {
    fields: [bookings.scheduleId],
    references: [schedules.id],
  }),
}));

// Create insert schemas
export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
});

// Export types
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;

// Legacy user schema (can be removed if not needed)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

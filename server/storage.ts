import { 
  routes, schedules, bookings, contactInquiries, users,
  type Route, type InsertRoute,
  type Schedule, type InsertSchedule,
  type Booking, type InsertBooking,
  type ContactInquiry, type InsertContactInquiry,
  type User, type InsertUser 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Route management
  createRoute(route: InsertRoute): Promise<Route>;
  getRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;

  // Schedule management
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  getSchedules(): Promise<Schedule[]>;
  getSchedulesByRoute(routeId: string): Promise<Schedule[]>;
  getAvailableSchedules(fromCity: string, toCity: string, fromDate?: Date): Promise<Schedule[]>;
  updateScheduleAvailability(scheduleId: string, seatsToReduce: number): Promise<void>;

  // Booking management
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<void>;

  // Contact inquiries
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  updateContactInquiryStatus(id: string, status: string): Promise<void>;

  // Legacy user methods (keep for compatibility)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Route methods
  async createRoute(route: InsertRoute): Promise<Route> {
    const [newRoute] = await db.insert(routes).values(route).returning();
    return newRoute;
  }

  async getRoutes(): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }

  async getRoute(id: string): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route || undefined;
  }

  // Schedule methods
  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  async getSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules).orderBy(desc(schedules.departureTime));
  }

  async getSchedulesByRoute(routeId: string): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(eq(schedules.routeId, routeId))
      .orderBy(schedules.departureTime);
  }

  async getAvailableSchedules(fromCity: string, toCity: string, fromDate?: Date): Promise<Schedule[]> {
    const query = db
      .select({
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
        createdAt: schedules.createdAt,
      })
      .from(schedules)
      .innerJoin(routes, eq(schedules.routeId, routes.id))
      .where(
        and(
          eq(routes.fromCity, fromCity),
          eq(routes.toCity, toCity),
          eq(routes.isActive, true),
          eq(schedules.status, "scheduled"),
          fromDate ? gte(schedules.departureTime, fromDate) : undefined
        )
      )
      .orderBy(schedules.departureTime);

    return await query;
  }

  async updateScheduleAvailability(scheduleId: string, seatsToReduce: number): Promise<void> {
    await db
      .update(schedules)
      .set({ 
        availableSeats: sql`${schedules.availableSeats} - ${seatsToReduce}` 
      })
      .where(eq(schedules.id, scheduleId));
  }

  // Booking methods
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    await db
      .update(bookings)
      .set({ 
        bookingStatus: status,
        updatedAt: new Date()
      })
      .where(eq(bookings.id, id));
  }

  // Contact inquiry methods
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [newInquiry] = await db.insert(contactInquiries).values(inquiry).returning();
    return newInquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }

  async updateContactInquiryStatus(id: string, status: string): Promise<void> {
    await db
      .update(contactInquiries)
      .set({ status })
      .where(eq(contactInquiries.id, id));
  }

  // Legacy user methods (keep for compatibility)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();

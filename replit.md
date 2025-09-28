# TransEuropa - Modern Transportation Booking Platform

## Overview

TransEuropa is a comprehensive transportation booking platform that facilitates travel and cargo services between Moldova and Western European countries (Germany, Netherlands, Belgium). The platform provides a modern web interface for booking passenger transport, package delivery, and automobile transport services. Built with a focus on user experience, the application draws design inspiration from established travel platforms like Booking.com and Airbnb while incorporating logistics tracking elements similar to DHL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React 18** with **TypeScript** for type safety and modern development practices. The architecture follows a component-based approach with:

- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Custom component library built on Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with a custom design system featuring navy/blue color palette for trust and professionalism
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The server-side follows a **Node.js Express** architecture with TypeScript:

- **Web Framework**: Express.js with middleware for request logging and error handling
- **API Design**: RESTful endpoints for routes, schedules, bookings, and contact inquiries
- **Business Logic**: Service layer pattern with storage abstraction for data operations
- **Development Tools**: Vite integration for hot module replacement and development experience

### Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations:

- **Database Schema**: Comprehensive relational model covering routes, schedules, bookings, and contact inquiries
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Data Modeling**: Zod schemas for runtime validation aligned with database models

### Component Architecture
The UI follows a **design system approach** with:

- **Base Components**: Reusable UI primitives (buttons, inputs, cards) with consistent styling
- **Composite Components**: Business-specific components (Hero, Services, Contact sections)
- **Layout System**: Responsive design with Tailwind's spacing units and breakpoints
- **Theme System**: CSS custom properties for consistent color theming and dark mode support

### Booking System Design
The core business logic centers around a **multi-service booking system**:

- **Route Management**: City-to-city routes with distance and duration tracking
- **Schedule System**: Time-based departures with vehicle capacity management
- **Service Types**: Differentiated pricing and features for passengers, packages, and car transport
- **Availability Tracking**: Real-time seat/capacity management with booking confirmations

### Performance Optimizations
The application implements several performance strategies:

- **Query Caching**: TanStack Query with stale-time strategies for reduced API calls
- **Code Splitting**: Vite-based bundling with automatic code splitting
- **Image Optimization**: Static asset management with proper caching headers
- **Development Experience**: Hot reload, error overlays, and development banners for Replit environment

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling and WebSocket support for real-time capabilities

### UI and Styling Libraries
- **Radix UI**: Comprehensive set of low-level UI primitives for accessibility and keyboard navigation
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Modern icon library with consistent design language

### Development and Build Tools
- **Vite**: Fast build tool with HMR, TypeScript support, and optimized production builds
- **TypeScript**: Static type checking across the entire application stack
- **ESBuild**: Fast JavaScript bundler for server-side code compilation

### Form and Data Management
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation library for runtime type checking and form validation
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates

### Communication Services
The application is prepared for integration with:
- **Email Services**: For booking confirmations and contact form submissions
- **SMS/WhatsApp**: For booking notifications and customer communication
- **Payment Gateways**: For online booking payments and transaction processing

### Monitoring and Analytics
The architecture supports integration with:
- **Error Tracking**: For production error monitoring and debugging
- **Analytics**: For user behavior tracking and business intelligence
- **Performance Monitoring**: For application performance metrics and optimization
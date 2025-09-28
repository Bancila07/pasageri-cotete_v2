# Design Guidelines for Modern Transportation Booking Platform

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern travel booking platforms like Booking.com and Airbnb, combined with logistics companies like DHL for the package tracking elements. The design emphasizes trust, efficiency, and international connectivity.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Deep Navy: 220 85% 15% (trust, reliability, professional transport)
- Bright Blue: 210 90% 55% (modern, digital efficiency)

**Accent Colors:**
- Emerald Green: 150 75% 45% (success states, confirmations)
- Warm Orange: 25 85% 60% (call-to-action, urgency for bookings)

**Background Treatments:**
- Subtle blue-to-navy gradients for hero sections
- Light neutral backgrounds (210 15% 97%) for content areas
- Dark mode: Navy base with lighter blue accents

### Typography
**Font Stack:** Inter (Google Fonts) for modern, international readability
- Headlines: 600-700 weight, larger scales for hero content
- Body: 400-500 weight for optimal reading
- Buttons/CTAs: 500-600 weight for emphasis

### Layout System
**Spacing Units:** Consistent use of Tailwind units 2, 4, 6, 8, 12, 16
- Compact spacing (2-4) for form elements and small components
- Medium spacing (6-8) for section padding and component separation
- Generous spacing (12-16) for hero sections and major layout breaks

### Component Library

**Navigation:**
- Fixed header with language/country selector (flag icons)
- Clean horizontal navigation with service categories
- Mobile: Hamburger menu with smooth slide-out

**Hero Section:**
- Full-viewport hero with subtle overlay gradient
- Split layout: compelling headline + booking form widget
- Background: Professional transportation imagery

**Service Cards:**
- Clean card design with service icons
- Hover states with subtle elevation
- Clear pricing and feature highlights

**Booking Forms:**
- Multi-step wizard for complex bookings
- Real-time validation and pricing updates
- Progress indicators for user guidance

**Data Displays:**
- Route timeline visualization
- Pricing tables with clear comparisons
- Schedule grids with availability indicators

## Images
- **Hero Image:** Large, professional image of modern coach/transport vehicle on European highway, with subtle dark overlay for text readability
- **Service Icons:** Use Heroicons for transport, package, and facility icons
- **Country Flags:** Small flag icons for language/destination selection
- **Facility Images:** Clean, modern photos showcasing bus interior amenities (WiFi, TV, comfortable seating)

## Key Design Principles
1. **Trust & Professionalism:** Clean lines, consistent spacing, professional imagery
2. **International Appeal:** Multi-language support, cultural sensitivity in imagery
3. **Booking Efficiency:** Streamlined forms, clear pricing, minimal friction
4. **Mobile-First:** Responsive design prioritizing mobile booking experience
5. **Information Hierarchy:** Clear service categorization, prominent pricing, easy contact access

## Animations
Minimal and purposeful:
- Subtle fade-ins for page sections
- Smooth transitions for language switching
- Loading states for booking form submissions
- No distracting animations that could impact perceived reliability

This design approach balances the professional nature of transportation services with modern digital expectations, creating a trustworthy platform that facilitates easy international bookings.
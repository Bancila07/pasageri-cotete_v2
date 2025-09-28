import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/stock_images/modern_luxury_coach__2d4d27b5.jpg";

const routes = [
  { from: "Chișinău", to: "Berlin", flag: "🇩🇪" },
  { from: "Chișinău", to: "Amsterdam", flag: "🇳🇱" },
  { from: "Chișinău", to: "Brussels", flag: "🇧🇪" },
  { from: "Berlin", to: "Chișinău", flag: "🇲🇩" },
  { from: "Amsterdam", to: "Chișinău", flag: "🇲🇩" },
  { from: "Brussels", to: "Chișinău", flag: "🇲🇩" }
];

export default function Hero() {
  const [bookingData, setBookingData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1',
    serviceType: 'passenger'
  });

  const handleBooking = () => {
    console.log('Booking submitted:', bookingData);
    // TODO: Remove mock functionality - implement real booking
  };

  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Modern luxury coach on European highway"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Transport Sigur și Confortabil
              <span className="block text-chart-2">Moldova - Europa</span>
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed">
              Curse regulate de transport pasageri și colete între Moldova, Germania, Olanda și Belgia. 
              Rezervă online și călătorește în siguranță maximă.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <MapPin className="w-5 h-5" />
                <span>Transport la adresă</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Users className="w-5 h-5" />
                <span>2 șoferi profesioniști</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Calendar className="w-5 h-5" />
                <span>Curse regulate</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-foreground">Rezervă Călătoria</h3>
              
              <div className="space-y-4">
                {/* Service Type Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tip serviciu</label>
                  <Select value={bookingData.serviceType} onValueChange={(value) => setBookingData({...bookingData, serviceType: value})}>
                    <SelectTrigger data-testid="select-service-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passenger">🚌 Transport Pasageri</SelectItem>
                      <SelectItem value="package">📦 Transport Colete</SelectItem>
                      <SelectItem value="car">🚗 Transport Automobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Route Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">De la</label>
                    <Select value={bookingData.from} onValueChange={(value) => setBookingData({...bookingData, from: value})}>
                      <SelectTrigger data-testid="select-from">
                        <SelectValue placeholder="Oraș plecare" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chisinau">🇲🇩 Chișinău</SelectItem>
                        <SelectItem value="berlin">🇩🇪 Berlin</SelectItem>
                        <SelectItem value="amsterdam">🇳🇱 Amsterdam</SelectItem>
                        <SelectItem value="brussels">🇧🇪 Brussels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">La</label>
                    <Select value={bookingData.to} onValueChange={(value) => setBookingData({...bookingData, to: value})}>
                      <SelectTrigger data-testid="select-to">
                        <SelectValue placeholder="Oraș destinație" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chisinau">🇲🇩 Chișinău</SelectItem>
                        <SelectItem value="berlin">🇩🇪 Berlin</SelectItem>
                        <SelectItem value="amsterdam">🇳🇱 Amsterdam</SelectItem>
                        <SelectItem value="brussels">🇧🇪 Brussels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date and Passengers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Data plecării</label>
                    <Input 
                      type="date" 
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      data-testid="input-date"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {bookingData.serviceType === 'passenger' ? 'Pasageri' : 'Cantitate'}
                    </label>
                    <Select value={bookingData.passengers} onValueChange={(value) => setBookingData({...bookingData, passengers: value})}>
                      <SelectTrigger data-testid="select-passengers">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBooking}
                  data-testid="button-book-now"
                >
                  Verifică Disponibilitatea
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
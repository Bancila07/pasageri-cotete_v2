import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@assets/stock_images/modern_luxury_coach__2d4d27b5.jpg";

interface Schedule {
  id: string;
  departureTime: string;
  arrivalTime: string;
  basePricePassenger: string;
  basePricePackage: string;
  basePriceCar: string;
  availableSeats: number;
}

export default function Hero() {
  const [bookingData, setBookingData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1',
    serviceType: 'passenger'
  });
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showSchedules, setShowSchedules] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available schedules based on route selection
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ['/api/schedules', bookingData.from, bookingData.to, bookingData.date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (bookingData.from) params.append('from', bookingData.from);
      if (bookingData.to) params.append('to', bookingData.to);
      if (bookingData.date) params.append('date', bookingData.date);
      
      const response = await fetch(`/api/schedules?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch schedules');
      return response.json();
    },
    enabled: !!(bookingData.from && bookingData.to),
    staleTime: 30000, // 30 seconds
  });

  // Calculate price mutation
  const calculatePriceMutation = useMutation({
    mutationFn: async ({ scheduleId, serviceType, quantity }: { scheduleId: string, serviceType: string, quantity: number }) => {
      const response = await fetch('/api/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId, serviceType, quantity })
      });
      if (!response.ok) throw new Error('Failed to calculate price');
      return response.json();
    }
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Rezervare confirmată!",
        description: "Rezervarea dumneavoastră a fost înregistrată cu succes. Veți primi un email de confirmare în curând.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      setBookingData({ from: '', to: '', date: '', passengers: '1', serviceType: 'passenger' });
      setSelectedSchedule(null);
      setShowSchedules(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare la rezervare",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSearchSchedules = () => {
    if (!bookingData.from || !bookingData.to || !bookingData.date) {
      toast({
        title: "Câmpuri incomplete",
        description: "Vă rugăm să completați toate câmpurile pentru a căuta curse disponibile.",
        variant: "destructive",
      });
      return;
    }
    setShowSchedules(true);
  };

  const handleScheduleSelect = async (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    
    // Calculate price for this schedule
    const quantity = bookingData.serviceType === 'passenger' 
      ? parseInt(bookingData.passengers) 
      : bookingData.serviceType === 'package' 
        ? parseInt(bookingData.passengers) // Using passengers field as quantity for packages
        : 1; // For cars

    try {
      await calculatePriceMutation.mutateAsync({
        scheduleId: schedule.id,
        serviceType: bookingData.serviceType,
        quantity
      });
    } catch (error) {
      console.error('Price calculation failed:', error);
    }
  };

  const handleFinalBooking = () => {
    if (!selectedSchedule) return;

    // Create booking data
    const booking = {
      scheduleId: selectedSchedule.id,
      serviceType: bookingData.serviceType,
      customerName: "Test Customer", // TODO: Add form for customer details
      customerEmail: "test@example.com",
      customerPhone: "+373695726526",
      passengerCount: bookingData.serviceType === 'passenger' ? parseInt(bookingData.passengers) : undefined,
      packageWeight: bookingData.serviceType === 'package' ? parseFloat(bookingData.passengers) : undefined, // Using passengers as weight for demo
      pickupAddress: `${bookingData.from} City Center`,
      deliveryAddress: `${bookingData.to} City Center`
      // Note: totalPrice removed - server calculates this for security
    };

    bookingMutation.mutate(booking);
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
                    <Select value={bookingData.from} onValueChange={(value) => setBookingData({...bookingData, from: value, to: ''})}>
                      <SelectTrigger data-testid="select-from">
                        <SelectValue placeholder="Oraș plecare" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chișinău">🇲🇩 Chișinău</SelectItem>
                        <SelectItem value="Berlin">🇩🇪 Berlin</SelectItem>
                        <SelectItem value="Amsterdam">🇳🇱 Amsterdam</SelectItem>
                        <SelectItem value="Brussels">🇧🇪 Brussels</SelectItem>
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
                        <SelectItem value="Chișinău">🇲🇩 Chișinău</SelectItem>
                        <SelectItem value="Berlin">🇩🇪 Berlin</SelectItem>
                        <SelectItem value="Amsterdam">🇳🇱 Amsterdam</SelectItem>
                        <SelectItem value="Brussels">🇧🇪 Brussels</SelectItem>
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
                      min={new Date().toISOString().split('T')[0]}
                      data-testid="input-date"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {bookingData.serviceType === 'passenger' ? 'Pasageri' : 
                       bookingData.serviceType === 'package' ? 'Greutate (kg)' : 'Vehicule'}
                    </label>
                    <Select value={bookingData.passengers} onValueChange={(value) => setBookingData({...bookingData, passengers: value})}>
                      <SelectTrigger data-testid="select-passengers">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingData.serviceType === 'package' 
                          ? [5, 10, 15, 20, 25, 30, 40, 50].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num} kg</SelectItem>
                            ))
                          : [1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!showSchedules ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleSearchSchedules}
                    disabled={schedulesLoading}
                    data-testid="button-search-schedules"
                  >
                    {schedulesLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Se caută...
                      </>
                    ) : (
                      'Verifică Disponibilitatea'
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Curse disponibile:</h4>
                    {schedules && Array.isArray(schedules) && schedules.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {schedules.map((schedule: Schedule) => (
                          <Card 
                            key={schedule.id} 
                            className={`p-3 cursor-pointer hover-elevate ${selectedSchedule?.id === schedule.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => handleScheduleSelect(schedule)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">
                                  {new Date(schedule.departureTime).toLocaleString('ro-RO')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {schedule.availableSeats} locuri disponibile
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-primary">
                                  €{bookingData.serviceType === 'passenger' 
                                    ? schedule.basePricePassenger 
                                    : bookingData.serviceType === 'package'
                                    ? schedule.basePricePackage + '/kg'
                                    : schedule.basePriceCar}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Nu sunt curse disponibile pentru această rută și dată.
                      </p>
                    )}

                    {calculatePriceMutation.data && selectedSchedule && (
                      <Card className="p-4 bg-primary/5">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Preț de bază:</span>
                            <span>€{calculatePriceMutation.data.basePrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cantitate:</span>
                            <span>{calculatePriceMutation.data.quantity}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total:</span>
                            <span className="text-primary">€{calculatePriceMutation.data.totalPrice}</span>
                          </div>
                        </div>
                      </Card>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSchedules(false)}
                        className="flex-1"
                      >
                        Înapoi
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleFinalBooking}
                        disabled={!selectedSchedule || bookingMutation.isPending}
                        data-testid="button-confirm-booking"
                      >
                        {bookingMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Se rezervă...
                          </>
                        ) : (
                          'Confirmă Rezervarea'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
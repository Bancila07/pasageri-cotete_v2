import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bus, Package, Car, ArrowRight } from "lucide-react";
import passengerImage from "@assets/stock_images/comfortable_modern_b_5349da18.jpg";
import packageImage from "@assets/stock_images/professional_deliver_087636d2.jpg";
import carImage from "@assets/stock_images/car_transport_traile_5b79582b.jpg";

const services = [
  {
    id: 'passenger',
    title: 'Transport Pasageri',
    description: 'Călătorește în siguranță maximă oriunde în Germania, Belgia sau Olanda la prețuri atractive. Confort garantat pe toată durata călătoriei.',
    icon: Bus,
    image: passengerImage,
    features: ['Locuri confortabile', 'WiFi gratuit', 'Sistem de divertisment', '2 șoferi profesioniști'],
    price: 'de la €35',
    color: 'chart-2'
  },
  {
    id: 'package',
    title: 'Transport Colete',
    description: 'Suntem un partener de încredere și vă garantăm livrarea cu acuratețe a coletelor în toată Europa.',
    icon: Package,
    image: packageImage,
    features: ['Livrare la adresă', 'Asigurare inclusă', 'Tracking în timp real', 'Manipulare profesională'],
    price: 'de la €5/kg',
    color: 'chart-3'
  },
  {
    id: 'car',
    title: 'Transport Automobile',
    description: 'Doriți să vă procurați o mașină sau să aduceți acasă mașina dvs? Vă oferim servicii de transport și suport informațional.',
    icon: Car,
    image: carImage,
    features: ['Transport pe platformă', 'Asigurare completă', 'Inspecție pre-transport', 'Livrare la adresă'],
    price: 'de la €300',
    color: 'chart-4'
  }
];

export default function ServicesSection() {
  const handleServiceSelect = (serviceId: string) => {
    console.log('Service selected:', serviceId);
    // TODO: Remove mock functionality - implement service selection
  };

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Serviciile Noastre
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferim servicii complete de transport pentru pasageri, colete și automobile 
            între Moldova și țările din Europa Occidentală
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="group hover-elevate cursor-pointer h-full">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className={`w-12 h-12 bg-${service.color} text-white rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <span className="text-lg font-semibold text-primary">{service.price}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group/btn"
                    onClick={() => handleServiceSelect(service.id)}
                    data-testid={`button-select-${service.id}`}
                  >
                    Rezervă Acum
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Countries served */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6">Țări deservite</h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg hover-elevate">
              <span className="text-3xl">🇲🇩</span>
              <span className="font-medium">Moldova</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg hover-elevate">
              <span className="text-3xl">🇩🇪</span>
              <span className="font-medium">Germania</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg hover-elevate">
              <span className="text-3xl">🇳🇱</span>
              <span className="font-medium">Olanda</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg hover-elevate">
              <span className="text-3xl">🇧🇪</span>
              <span className="font-medium">Belgia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
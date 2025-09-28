import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Tv, Coffee, Shield, MapPin, Star } from "lucide-react";

const facilities = [
  {
    icon: Tv,
    title: 'Sistem de Divertisment',
    description: 'Vizionați cele mai recente filme și emisiuni, astfel încât timpul va trece repede și interesant.',
    color: 'chart-2'
  },
  {
    icon: Coffee,
    title: 'Opriri pentru Masă',
    description: 'Facem opriri scurte pentru prânz la cafenelele sau restaurantele cele mai preferate.',
    color: 'chart-3'
  },
  {
    icon: Shield,
    title: 'Doi Șoferi Profesioniști',
    description: 'Transportul este condus de 2 șoferi care se înlocuiesc, astfel încât călătoria să fie cât mai rapidă și sigură.',
    color: 'chart-4'
  },
  {
    icon: Wifi,
    title: 'WiFi Gratuit',
    description: 'Pe parcursul călătoriei, vă puteți bucura de acces gratuit la internet prin WiFi.',
    color: 'chart-2'
  },
  {
    icon: MapPin,
    title: 'Transport la Adresă',
    description: 'Aducem pe fiecare pasager la adresa necesară, oferind serviciu complet de la ușă la ușă.',
    color: 'chart-3'
  },
  {
    icon: Star,
    title: 'Confort Premium',
    description: 'Toate vehiculele noastre îndeplinesc standardele moderne de confort și siguranță.',
    color: 'chart-4'
  }
];

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Facilitățile Noastre
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vă asigurăm confort și plăcere pe toată durata călătoriei cu servicii moderne și profesionale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => {
            const IconComponent = facility.icon;
            return (
              <Card key={index} className="group hover-elevate h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-${facility.color}/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-8 h-8 text-${facility.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {facility.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quality guarantee */}
        <div className="mt-16 text-center">
          <div className="bg-primary/5 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Garanția Calității
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Cu peste 10 ani de experiență în transportul internațional, vă oferim servicii de cea mai înaltă calitate. 
              Echipa noastră profesională și vehiculele moderne vă garantează o călătorie sigură și confortabilă.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Pasageri transportați</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Punctualitate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">Rating clienți</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
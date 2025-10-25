import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users, Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/stock_images/modern_luxury_coach__2d4d27b5.jpg";

const PHONE_MAIN = "+373 695 726 52";
const PHONE_CLEAN = "+37369572652";
const EMAIL_MAIN = "rezervari@transeuropa.md";
const ADDRESS = "Chișinău, bd. Dacia 10";
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");
const openWhatsApp = (phone: string) => window.open(`https://wa.me/${normalizePhone(phone).replace("+","")}`, "_blank");
const openViber = (phone: string) => (window.location.href = `viber://chat?number=${encodeURIComponent(normalizePhone(phone))}`);

export default function Hero() {
  const [ ] = useState();

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

            {/* Contact Card (în loc de formular) */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-5">
                  {/* Telefon */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Telefon</h4>
                      <div className="space-y-1">
                        <button
                            className="text-muted-foreground hover:text-primary cursor-pointer"
                            onClick={() => (window.location.href = `tel:${PHONE_CLEAN}`)}
                            data-testid="contact-phone-main"
                        >
                          {PHONE_MAIN}
                        </button>
                      </div>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => (window.location.href = `tel:${PHONE_CLEAN}`)}
                        data-testid="button-call"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <div className="space-y-1">
                        <button
                            className="text-muted-foreground hover:text-primary cursor-pointer"
                            onClick={() => (window.location.href = `mailto:${EMAIL_MAIN}`)}
                            data-testid="contact-email"
                        >
                          {EMAIL_MAIN}
                        </button>
                      </div>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => (window.location.href = `mailto:${EMAIL_MAIN}`)}
                        data-testid="button-email"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* WhatsApp & Viber */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">Mesagerie</h4>
                      <div className="flex gap-3">
                        <Button
                            className="flex-1"
                            onClick={() => openWhatsApp(PHONE_MAIN)}
                            data-testid="button-whatsapp"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => openViber(PHONE_MAIN)}
                            data-testid="button-viber"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Viber
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Adresă */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Adresă</h4>
                      <button
                          className="text-muted-foreground hover:text-primary text-left"
                          onClick={() => window.open(MAPS_LINK, "_blank")}
                          data-testid="contact-address"
                      >
                        {ADDRESS}
                      </button>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(MAPS_LINK, "_blank")}
                        data-testid="button-map"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  );
}

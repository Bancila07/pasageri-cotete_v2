import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const contactMethods = [
  {
    icon: Phone,
    title: 'Telefon Moldova',
    content: ['+373 695 726 52', '+373 795 677 47'],
    type: 'phone'
  },
  {
    icon: Phone,
    title: 'Telefon România',
    content: ['+40 742 591 929'],
    type: 'phone'
  },
  {
    icon: Mail,
    title: 'Email',
    content: ['bancila-victor@mail.ru', 'bancila_victor@yahoo.com'],
    type: 'email'
  },
  {
    icon: MapPin,
    title: 'Adresa',
    content: ['Strada Bucovinei 1/2', 'Chișinău, Moldova'],
    type: 'address'
  },
  {
    icon: Clock,
    title: 'Program',
    content: ['Luni - Duminică', '24/7 Disponibili'],
    type: 'schedule'
  }
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const { toast } = useToast();

  // Contact form submission mutation
  const contactMutation = useMutation({
    mutationFn: async (contactData: typeof formData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit contact form');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mesaj trimis cu succes!",
        description: "Vă vom contacta în cel mai scurt timp posibil. Vă mulțumim pentru încredere!",
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare la trimiterea mesajului",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Câmpuri incomplete",
        description: "Vă rugăm să completați toate câmpurile obligatorii.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleQuickContact = (type: string, value: string) => {
    console.log('Quick contact:', type, value);
    // TODO: Remove mock functionality - implement real contact
  };

  return (
    <section id="contact" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Contactează-ne
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Puteți beneficia de o consultație cu privire la toate întrebările oricând. 
            Echipa noastră este disponibilă 24/7 pentru a vă ajuta.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">Informații de Contact</h3>
            
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">{method.title}</h4>
                        <div className="space-y-1">
                          {method.content.map((item, idx) => (
                            <div 
                              key={idx}
                              className="text-muted-foreground hover:text-primary cursor-pointer"
                              onClick={() => handleQuickContact(method.type, item)}
                              data-testid={`contact-${method.type}-${idx}`}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      {method.type === 'phone' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickContact('phone', method.content[0])}
                          data-testid={`button-call-${index}`}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      )}
                      {method.type === 'email' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickContact('email', method.content[0])}
                          data-testid={`button-email-${index}`}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Quick Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                className="flex-1"
                onClick={() => handleQuickContact('whatsapp', '+373695726526')}
                data-testid="button-whatsapp"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleQuickContact('telegram', 'TransEuropa')}
                data-testid="button-telegram"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Telegram
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Trimite un Mesaj</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nume</label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Numele dvs"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Telefon</label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+373 XXX XXX XXX"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplu.com"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subiect</label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder="Alegeți subiectul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Rezervare transport</SelectItem>
                      <SelectItem value="info">Informații generale</SelectItem>
                      <SelectItem value="complaint">Reclamație</SelectItem>
                      <SelectItem value="suggestion">Sugestie</SelectItem>
                      <SelectItem value="other">Altceva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mesaj</label>
                  <Textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Descrieți cerința dvs..."
                    rows={4}
                    required
                    data-testid="textarea-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    'Trimite Mesajul'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
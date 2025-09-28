import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

const footerSections = [
  {
    title: 'Servicii',
    links: [
      { text: 'Transport Pasageri', href: '#services' },
      { text: 'Transport Colete', href: '#services' },
      { text: 'Transport Automobile', href: '#services' },
      { text: 'Rezervări Online', href: '#booking' }
    ]
  },
  {
    title: 'Destinații',
    links: [
      { text: 'Moldova - Germania', href: '#routes' },
      { text: 'Moldova - Olanda', href: '#routes' },
      { text: 'Moldova - Belgia', href: '#routes' },
      { text: 'Ruta întoarcere', href: '#routes' }
    ]
  },
  {
    title: 'Informații',
    links: [
      { text: 'Despre noi', href: '#about' },
      { text: 'Facilități', href: '#facilities' },
      { text: 'Prețuri', href: '#pricing' },
      { text: 'Termeni și condiții', href: '#terms' }
    ]
  }
];

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/victor.bancila.3', label: 'Facebook', target: '_blank' },
];

export default function Footer() {
  const handleSocialClick = (platform: string) => {
    console.log('Social link clicked:', platform);
    // TODO: Remove mock functionality - implement real social links
  };

  const handleQuickContact = (type: string) => {
    console.log('Quick contact:', type);
    // TODO: Remove mock functionality - implement real contact
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-foreground text-primary rounded-lg flex items-center justify-center font-bold">
                TE
              </div>
              <div>
                <h3 className="text-xl font-bold">TransEuropa</h3>
                <p className="text-sm opacity-90">Transport Professional</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Transport sigur și confortabil între Moldova și Europa Occidentală. 
              Peste 10 ani de experiență în servicii de transport internațional.
            </p>

            {/* Quick Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 opacity-80" />
                <a href="tel:+37369572652" className="hover:underline text-sm">
                  +373 695 726 52
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 opacity-80" />
                <span className="text-sm">bancila-victor@mail.ru</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 opacity-80" />
                <span className="text-sm">Strada Bucovinei 1/2, Chișinău</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 opacity-80" />
                <span className="text-sm">24/7 Disponibili</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm hover-elevate p-1 -m-1 rounded"
                      data-testid={`link-${section.title.toLowerCase()}-${linkIndex}`}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-sm text-primary-foreground/80">
              © 2024 TransEuropa. Toate drepturile rezervate.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary-foreground/80">Urmărește-ne:</span>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                      <Button
                          key={index}
                          asChild
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                          data-testid={`button-social-${social.label.toLowerCase()}`}
                          aria-label={social.label}
                      >
                        <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                          <IconComponent className="w-4 h-4" />
                        </a>
                      </Button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-3">
              <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { window.location.href = 'tel:+37369572652'; }}
                  data-testid="button-call-footer"
                  aria-label="Sună acum +373 695 726 52"
              >
                <Phone className="w-4 h-4 mr-2" />
                Sună acum
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleQuickContact('book')}
                data-testid="button-book-footer"
              >
                Rezervă
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
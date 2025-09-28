import { Button } from "@/components/ui/button";
import { Globe, Menu, Phone } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: 'ro', name: 'Română', flag: '🇲🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];

export default function Header() {
  const [selectedLanguage, setSelectedLanguage] = useState('ro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-muted-foreground border-b border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <a href="tel:+37369572652" className="hover:underline">
                +373 695 726 52
              </a>
            </div>
            <span>•</span>
            <span>bancila-victor@mail.ru</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none"
              data-testid="select-language"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold">
              PC
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Pasageri-Colete</h1>
              <p className="text-xs text-muted-foreground">Transport Professional</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" data-testid="nav-desktop">
            <a href="#services" className="text-foreground hover-elevate px-3 py-2 rounded-md">Servicii</a>
            <a href="#routes" className="text-foreground hover-elevate px-3 py-2 rounded-md">Rute</a>
            <a href="#facilities" className="text-foreground hover-elevate px-3 py-2 rounded-md">Facilități</a>
            <a href="#contact" className="text-foreground hover-elevate px-3 py-2 rounded-md">Contact</a>
            <Button size="sm" data-testid="button-reserve">
              Rezervă Acum
            </Button>
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border" data-testid="nav-mobile">
            <div className="flex flex-col gap-2">
              <a href="#services" className="text-foreground hover-elevate px-3 py-3 rounded-md">Servicii</a>
              <a href="#routes" className="text-foreground hover-elevate px-3 py-3 rounded-md">Rute</a>
              <a href="#facilities" className="text-foreground hover-elevate px-3 py-3 rounded-md">Facilități</a>
              <a href="#contact" className="text-foreground hover-elevate px-3 py-3 rounded-md">Contact</a>
              <Button className="mt-2" data-testid="button-reserve-mobile">
                Rezervă Acum
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
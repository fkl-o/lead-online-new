import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  BarChart3,
  Euro,
  Percent,
  Sparkles,
  Users,
  Mail,
  Minus,
  Plus
} from "lucide-react";

// Einheitlicher Button Style
const buttonStyle = "h-12 border-2 border-brand-600/20 data-[state=on]:bg-rose-50 data-[state=on]:text-brand-600 data-[state=on]:border-brand-600/100 data-[state=on]:shadow-[0_0_0_2px_#be123c] transition-all duration-200 ease-in-out";

// Modal Props
type ModalProps = {
  open: boolean;
  onClose: () => void;
};

// Komponente
const AutomationModal = ({ open, onClose }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [budgetValue, setBudgetValue] = useState(10000);
  const [quoteValue, setQuoteValue] = useState(15);
  const [margin, setMargin] = useState(2500);
  const [salutation, setSalutation] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    document.body.style.overflow = "";
    setTimeout(() => {
      setIsMounted(false);
      onClose();
      setBudgetValue(10000);
      setQuoteValue(15);
      setMargin(2500);
      setSalutation(null);
      setName('');
      setEmail('');
      setPrivacyAgreed(false);
    }, 300);
  }, [onClose]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const handleSalutationClick = (value: string) => setSalutation(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!margin) return alert("Bitte geben Sie die Marge pro Sale ein.");
    if (!salutation) return alert("Bitte wählen Sie eine Anrede aus.");
    if (!name) return alert("Bitte geben Sie Ihren Namen ein.");
    if (!email) return alert("Bitte geben Sie Ihre E-Mail-Adresse ein.");
    if (!privacyAgreed) return alert("Bitte stimmen Sie den Datenschutzhinweisen zu.");
    alert("Automation-Anfrage abgeschickt!");
    handleClose();
  };

  if (!isMounted) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        onClick={stopPropagation}
        className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-600" />
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
              Kostenlose Potenzial-Analyse
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
          <div className="px-1 pb-4">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Budget */}
              <div>
                <Label htmlFor="budget" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-brand-600" />
                  Monatliches Marketing-Budget
                </Label>
                <Input
                  type="range"
                  id="budget"
                  name="budget"
                  min="4000"
                  max="50000"
                  step="500"
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary-600 mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {budgetValue.toLocaleString('de-DE')} €
                </p>
              </div>

              {/* Abschlussquote */}
              <div>
                <Label htmlFor="quote" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-brand-600" />
                  Abschlussquote (Leads → Aufträge)
                </Label>
                <Input
                  type="range"
                  id="quote"
                  name="quote"
                  min="3"
                  max="50"
                  step="1"
                  value={quoteValue}
                  onChange={(e) => setQuoteValue(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary-600 mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {quoteValue} %
                </p>
              </div>

              {/* Marge */}
              <div>
                <Label htmlFor="margin" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  Marge pro Sale (Gewinn je Auftrag in €)
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMargin(Math.max(0, margin - 10))}
                    className="h-full rounded-none border-r"
                  >
                    <Minus className="h-4 w-4 text-brand-600" />
                  </Button>
                  <Input
                    type="number"
                    id="margin"
                    name="margin"
                    inputMode="numeric"
                    className="flex-1 border-0 rounded-none text-center focus-visible:ring-0 focus-visible:ring-offset-0 h-full [appearance:textfield]"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMargin(margin + 10)}
                    className="h-full rounded-none border-l"
                  >
                    <Plus className="h-4 w-4 text-brand-600" />
                  </Button>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Anrede + Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                  <Label className="font-semibold text-slate-700 block mb-3">Anrede</Label>
                  <div className="flex gap-2">
                    {['herr', 'frau'].map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        type="button"
                        className={`flex-1 ${buttonStyle}`}
                        data-state={salutation === option ? "on" : "off"}
                        onClick={() => handleSalutationClick(option)}
                      >
                        <input
                          type="radio"
                          name="salutation"
                          value={option}
                          className="sr-only"
                          checked={salutation === option}
                          onChange={() => {}}
                        />
                        {option === 'herr' ? 'Herr' : 'Frau'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="name" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-600" />
                    Name
                  </Label>
                  <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* E-Mail */}
              <div>
                <Label htmlFor="email" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-600" />
                  E-Mail
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Datenschutz */}
              <div className="flex items-start space-x-3 bg-rose-50 p-3 rounded-lg border border-brand-600/20">
                <Checkbox
                  id="privacy"
                  checked={privacyAgreed}
                  onCheckedChange={(checked) => setPrivacyAgreed(!!checked)}
                  required
                  className="h-5 w-5 mt-0.5"
                />
                <Label htmlFor="privacy" className="text-sm text-slate-700 cursor-pointer">
                  Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner Daten zu.
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-4 rounded-lg transition-all"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                ROI-Analyse anfordern
              </Button>
            </form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AutomationModal;

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Briefcase,
  Globe,
  Users,
  Sparkles,
  Mail,
  Truck,
  Headphones,
  Megaphone,
  Euro
} from "lucide-react";
import { leadApi } from '@/lib/api';
import { useSnackbar } from '@/components/ui/snackbar';

// Einheitlicher Button-Style
const buttonStyle = "h-12 border-2 border-brand-600/20 data-[state=on]:bg-rose-50 data-[state=on]:text-brand-600 data-[state=on]:border-brand-600/100 data-[state=on]:shadow-[0_0_0_2px_#be123c] transition-all duration-200 ease-in-out";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

type SelectableButtonProps = {
  icon?: React.ReactNode;
  label: string;
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  isRadio?: boolean;
  name: string;
};

const SelectableButton = ({ icon, label, value, isSelected, onClick, isRadio, name }: SelectableButtonProps) => (
  <Button
    variant="outline"
    type="button"
    className={`flex-1 gap-2 ${buttonStyle}`}
    data-state={isSelected ? "on" : "off"}
    onClick={() => onClick(value)}
  >
    {isRadio && (
      <input
        type="radio"
        name={name}
        value={value}
        className="sr-only"
        checked={isSelected}
        onChange={() => {}}
      />
    )}
    {icon && icon}
    <span>{label}</span>
  </Button>
);

const DigitalizationModal = ({ open, onClose }: ModalProps) => {
  const { showSnackbar } = useSnackbar();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [url, setUrl] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [urgency, setUrgency] = useState('sofort');
  const [salutation, setSalutation] = useState<string | null>(null);  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setUrl('');
      setAreas([]);
      setUrgency('sofort');
      setSalutation(null);
      setName('');
      setEmail('');
      setPrivacyAgreed(false);
    }, 300);
  }, [onClose]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const toggleArea = (area: string) => {
    setAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return showSnackbar("Bitte geben Sie Ihre Unternehmens-URL ein.", "error");
    if (areas.length === 0) return showSnackbar("Bitte wählen Sie mindestens einen Bereich aus.", "error");
    if (!salutation) return showSnackbar("Bitte wählen Sie eine Anrede aus.", "error");
    if (!name) return showSnackbar("Bitte geben Sie Ihren Namen ein.", "error");
    if (!email) return showSnackbar("Bitte geben Sie Ihre E-Mail-Adresse ein.", "error");
    if (!privacyAgreed) return showSnackbar("Bitte stimmen Sie den Datenschutzhinweisen zu.", "error");
    setIsSubmitting(true);
    try {
      // Prepare lead data for backend
      const leadData = {
        name: name.trim(),
        email: email.trim(),
        salutation: salutation as 'herr' | 'frau',
        source: 'digitalization' as const,
        leadType: 'warm' as const,
        priority: (urgency === 'sofort' ? 'high' : urgency === '1-3 Monate' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        serviceDetails: {
          digitalization: {
            currentUrl: url,
            areas: areas,
            urgency: urgency,
            timeline: urgency
          }
        },
        privacyConsent: privacyAgreed,
        marketingConsent: false
      };

      const response = await leadApi.createLead(leadData);
      
      if (response.success) {
        showSnackbar("Vielen Dank! Ihre Digitalisierungs-Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.", "success");
        handleClose();
      } else {
        throw new Error(response.message || 'Fehler beim Senden der Anfrage');
      }
    } catch (error) {
      console.error('Error submitting digitalization lead:', error);
      showSnackbar("Es gab einen Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.", "error");
    } finally {
      setIsSubmitting(false);
    }
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
            <Briefcase className="h-6 w-6 text-brand-600" />
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
              15-minütiges Strategiegespräch
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
          <div className="px-1 pb-4">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* URL */}
              <div>
                <Label htmlFor="digi-url" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-600" />
                  Unternehmens-URL
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <div className="flex items-center bg-muted/50 px-3 text-sm text-muted-foreground rounded-l-md border-r">
                    https://
                  </div>
                  <Input
                    type="text"
                    id="digi-url"
                    placeholder="ihre-firma.de"
                    className="flex-1 border-0 rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Bereiche */}
              <div>
                <Label className="font-semibold text-slate-700 block mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  Bereiche für Digitalisierung
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "Logistik", icon: <Truck className="h-4 w-4 text-brand-600" /> },
                    { value: "Vertrieb", icon: <Briefcase className="h-4 w-4 text-brand-600" /> },
                    { value: "Kundenservice", icon: <Headphones className="h-4 w-4 text-brand-600" /> },
                    { value: "Marketing", icon: <Megaphone className="h-4 w-4 text-brand-600" /> },
                    { value: "HR", icon: <Users className="h-4 w-4 text-brand-600" /> },
                    { value: "Finanzen", icon: <Euro className="h-4 w-4 text-brand-600" /> },
                  ].map(option => (
                    <SelectableButton
                      key={option.value}
                      label={option.value}
                      value={option.value}
                      icon={option.icon}
                      isSelected={areas.includes(option.value)}
                      onClick={toggleArea}
                      name="areas"
                    />
                  ))}
                </div>
              </div>

              {/* Dringlichkeit */}
              <div>
                <Label className="font-semibold text-slate-700 block mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-600" />
                  Dringlichkeit
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {["sofort", "1-3 Monate", "3-6 Monate"].map(option => (
                    <SelectableButton
                      key={option}
                      label={option}
                      value={option}
                      isSelected={urgency === option}
                      onClick={setUrgency}
                      isRadio={true}
                      name="urgency"
                    />
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Anrede + Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                  <Label className="font-semibold text-slate-700 block mb-3">Anrede</Label>
                  <div className="flex gap-2">
                    {['herr', 'frau'].map(option => (
                      <SelectableButton
                        key={option}
                        label={option === 'herr' ? 'Herr' : 'Frau'}
                        value={option}
                        isSelected={salutation === option}
                        onClick={setSalutation}
                        isRadio={true}
                        name="salutation"
                      />
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="digi-name" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-600" />
                    Name
                  </Label>
                  <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                    <Input
                      type="text"
                      id="digi-name"
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
                <Label htmlFor="digi-email" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-600" />
                  E-Mail
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    type="email"
                    id="digi-email"
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
              </div>              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Wird gesendet...' : 'Gespräch anfordern'}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DigitalizationModal;
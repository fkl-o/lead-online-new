import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Globe,
  ArrowUp,
  Users,
  BarChart3,
  Zap,
  Briefcase,
  Sparkles,
  Mail
} from "lucide-react";
import { leadApi } from '@/lib/api';

const buttonStyle =
  "h-12 border-2 border-brand-600/20 data-[state=on]:bg-rose-50 data-[state=on]:text-brand-600 data-[state=on]:border-brand-600/100 data-[state=on]:shadow-[0_0_0_2px_#be123c] transition-all duration-200 ease-in-out";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

type SelectableButtonProps = {
  icon?: React.ReactNode;
  label: string;
  subLabel?: string;
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  isRadio?: boolean;
  name: string;
};

const SelectableButton = ({
  icon,
  label,
  subLabel,
  value,
  isSelected,
  onClick,
  isRadio,
  name
}: SelectableButtonProps) => (
  <div className={subLabel ? "space-y-2" : ""}>
    <Button
      variant="outline"
      type="button"
      className={`w-full gap-2 ${subLabel ? "h-14" : ""} ${buttonStyle}`}
      data-state={isSelected ? "on" : "off"}
      onClick={() => onClick(value)}
    >
      {isRadio ? (
        <input
          type="radio"
          name={name}
          value={value}
          className="sr-only"
          checked={isSelected}
          onChange={() => {}}
        />
      ) : (
        <input
          type="checkbox"
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
    {subLabel && (
      <p className="text-xs text-center text-muted-foreground">{subLabel}</p>
    )}
  </div>
);

const WebsiteModal = ({ open, onClose }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSalutation, setSelectedSalutation] = useState<string | null>(null);
  const [name, setName] = useState('');  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
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
      setSelectedGoals([]);
      setSelectedStyle(null);
      setSelectedSalutation(null);
      setName('');
      setEmail('');
      setWebsiteUrl('');
      setPrivacyAgreed(false);
    }, 300);
  }, [onClose]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const handleGoalClick = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleStyleClick = (style: string) => setSelectedStyle(style);
  const handleSalutationClick = (salutation: string) => setSelectedSalutation(salutation);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) return alert("Bitte geben Sie Ihre Unternehmens-URL ein.");
    if (selectedGoals.length === 0) return alert("Bitte wählen Sie mindestens ein Ziel aus.");
    if (!selectedStyle) return alert("Bitte wählen Sie einen Stil aus.");
    if (!selectedSalutation) return alert("Bitte wählen Sie eine Anrede aus.");
    if (!name) return alert("Bitte geben Sie Ihren Namen ein.");
    if (!email) return alert("Bitte geben Sie Ihre E-Mail-Adresse ein.");
    if (!privacyAgreed) return alert("Bitte stimmen Sie den Datenschutzhinweisen zu.");
    
    setIsSubmitting(true);
      try {
      // Prepare lead data for backend
      const leadData = {
        name: name.trim(),
        email: email.trim(),
        salutation: selectedSalutation as 'herr' | 'frau',
        source: 'website' as const,        leadType: 'warm' as const,
        priority: 'medium' as const,
        serviceDetails: {
          website: {
            currentUrl: websiteUrl,
            goals: selectedGoals,
            style: selectedStyle,
            timeline: 'Nicht spezifiziert',
            budget: 'Nicht spezifiziert'
          }
        },        privacyConsent: privacyAgreed,
        marketingConsent: false // Default to false, could be separate checkbox
      };

      const response = await leadApi.createLead(leadData);
      
      if (response.success) {
        alert("Vielen Dank! Ihre Website-Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.");
        handleClose();
      } else {
        throw new Error(response.message || 'Fehler beim Senden der Anfrage');
      }    } catch (error) {
      console.error('Error submitting website lead:', error);
      alert("Es gab einen Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goalsOptions = [
    { value: "conversions", label: "Conversions steigern", icon: <Zap className="h-4 w-4 text-brand-600" /> },
    { value: "traffic", label: "Traffic erhöhen", icon: <ArrowUp className="h-4 w-4 text-brand-600" /> },
    { value: "brand", label: "Markenbekanntheit stärken", icon: <Users className="h-4 w-4 text-brand-600" /> },
    { value: "leads", label: "Leads generieren", icon: <Briefcase className="h-4 w-4 text-brand-600" /> },
  ];

  const styleOptions = [
    { value: "minimal", label: "Modern", subLabel: "Minimalistisch" },
    { value: "flat", label: "Flat", subLabel: "Clean & Flach" },
    { value: "illustrative", label: "Illustrativ", subLabel: "Mit Grafiken" },
    { value: "corporate", label: "Corporate", subLabel: "Professionell" },
    { value: "creative", label: "Kreativ", subLabel: "Experimentell" },
  ];

  const salutationOptions = [
    { value: "herr", label: "Herr" },
    { value: "frau", label: "Frau" },
  ];

  if (!isMounted) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={stopPropagation}
        className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-brand-600" />
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
              Ihr interaktives Homepage-Design
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
          <div className="px-1 pb-4">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <Label htmlFor="web-url" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-600" />
                  Unternehmens-URL
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <div className="flex items-center bg-muted/50 px-3 text-sm text-muted-foreground rounded-l-md border-r">
                    https://
                  </div>
                  <Input
                    type="text"
                    id="web-url"
                    name="web-url"
                    placeholder="ihre-firma.de"
                    className="flex-1 border-0 rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="font-semibold text-slate-700 block mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-brand-600" />
                  Ziele Ihrer neuen Homepage
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goalsOptions.map((option) => (
                    <SelectableButton
                      key={option.value}
                      icon={option.icon}
                      label={option.label}
                      value={option.value}
                      isSelected={selectedGoals.includes(option.value)}
                      onClick={handleGoalClick}
                      name="goals"
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="style" className="font-semibold text-slate-700 block mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  Gewünschter Stil
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {styleOptions.map((option) => (
                    <SelectableButton
                      key={option.value}
                      label={option.label}
                      subLabel={option.subLabel}
                      value={option.value}
                      isSelected={selectedStyle === option.value}
                      onClick={handleStyleClick}
                      isRadio={true}
                      name="style"
                    />
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                  <Label className="font-semibold text-slate-700 block mb-3">Anrede</Label>
                  <div className="flex gap-2">
                    {salutationOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        type="button"
                        className={`flex-1 ${buttonStyle}`}
                        data-state={selectedSalutation === option.value ? "on" : "off"}
                        onClick={() => handleSalutationClick(option.value)}
                      >
                        <input
                          type="radio"
                          name="salutation"
                          value={option.value}
                          className="sr-only"
                          checked={selectedSalutation === option.value}
                          onChange={() => {}}
                        />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="web-name" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-600" />
                    Name
                  </Label>
                  <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                    <Input
                      type="text"
                      id="web-name"
                      name="name"
                      className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="web-email" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-600" />
                  E-Mail
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    type="email"
                    id="web-email"
                    name="email"
                    className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

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
              </div>              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Wird gesendet...' : 'Website-Design anfordern'}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default WebsiteModal;

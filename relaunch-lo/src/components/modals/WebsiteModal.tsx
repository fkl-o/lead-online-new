import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Globe, ArrowUp, Users, BarChart3, Zap, Briefcase, Sparkles, Mail } from "lucide-react";

// Define a constant for the button styling - with enhanced active state
const buttonStyle = "h-12 border-2 border-brand-600/20 data-[state=on]:bg-rose-50 data-[state=on]:text-brand-600 data-[state=on]:border-brand-600/100 data-[state=on]:shadow-[0_0_0_2px_#be123c] transition-all duration-200 ease-in-out";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

// Reusable component for selectable buttons (Goals, Style, Salutation)
type SelectableButtonProps = {
  icon?: React.ReactNode;
  label: string;
  subLabel?: string;
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  isRadio?: boolean; // To distinguish between checkbox and radio behavior
  name: string; // Name for the hidden input for accessibility
};

const SelectableButton = ({ icon, label, subLabel, value, isSelected, onClick, isRadio, name }: SelectableButtonProps) => {
  return (
    <div className={subLabel ? "space-y-2" : ""}>
      <Button
        variant="outline"
        type="button" // Important for preventing default form submission
        className={`w-full gap-2 ${subLabel ? "h-14" : ""} ${buttonStyle} ${subLabel ? "relative" : ""}`}
        data-state={isSelected ? "on" : "off"}
        onClick={() => onClick(value)}
      >
        {isRadio ? (
          <input
            type="radio"
            name={name}
            value={value}
            className="sr-only" // Visually hidden but accessible
            checked={isSelected}
            onChange={() => {}} // Dummy onChange as state is managed by button click
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
      {subLabel && <p className="text-xs text-center text-muted-foreground">{subLabel}</p>}
    </div>
  );
};

const WebsiteModal = ({ open, onClose }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSalutation, setSelectedSalutation] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
    }

    // Cleanup function to always reset overflow when modal closes or component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      // Reset form state when closing the modal
      setSelectedGoals([]);
      setSelectedStyle(null);
      setSelectedSalutation(null);
      setName('');
      setEmail('');
      setWebsiteUrl('');
      setPrivacyAgreed(false);
    }, 250);
  }, [onClose]);

  const handleGoalClick = useCallback((goal: string) => {
    setSelectedGoals((prevGoals) =>
      prevGoals.includes(goal)
        ? prevGoals.filter((g) => g !== goal)
        : [...prevGoals, goal]
    );
  }, []);

  const handleStyleClick = useCallback((style: string) => {
    setSelectedStyle(style);
  }, []);

  const handleSalutationClick = useCallback((salutation: string) => {
    setSelectedSalutation(salutation);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!websiteUrl) {
      alert("Bitte geben Sie Ihre Unternehmens-URL ein.");
      return;
    }
    if (selectedGoals.length === 0) {
      alert("Bitte wählen Sie mindestens ein Ziel für Ihre Homepage aus.");
      return;
    }
    if (!selectedStyle) {
      alert("Bitte wählen Sie einen gewünschten Stil aus.");
      return;
    }
    if (!selectedSalutation) {
      alert("Bitte wählen Sie eine Anrede aus.");
      return;
    }
    if (!name) {
      alert("Bitte geben Sie Ihren Namen ein.");
      return;
    }
    if (!email) {
      alert("Bitte geben Sie Ihre E-Mail-Adresse ein.");
      return;
    }
    if (!privacyAgreed) {
      alert("Bitte stimmen Sie den Datenschutzhinweisen zu.");
      return;
    }

    const formData = {
      url: websiteUrl,
      goals: selectedGoals,
      style: selectedStyle,
      salutation: selectedSalutation,
      name: name,
      email: email,
    };

    console.log("Form data submitted:", formData);
    // In a real application, you would send this data to your backend API.
    // Example using fetch:
    /*
    fetch('/api/submit-website-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      alert("Website-Anfrage erfolgreich abgeschickt!");
      handleClose();
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      alert("Fehler beim Abschicken der Anfrage. Bitte versuchen Sie es später erneut.");
    });
    */

    alert("Website-Anfrage abgeschickt!");
    handleClose();
  };

  const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  // Data for rendering selectable buttons
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

  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      className={`modal fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-250 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >      <div
        onClick={stopPropagation}
        className={`modal-content bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-transform duration-250 ${isVisible ? 'scale-100' : 'scale-95'}`}
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
        </div>        <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
          <div className="px-1 pb-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="web-url" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-600" />
                  Unternehmens-URL
                </Label>                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
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

              <hr className="border-gray-200" />              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                  <Label className="font-semibold text-slate-700 block mb-3">Anrede</Label>
                  <div className="flex gap-2">
                    {salutationOptions.map((option) => (
                      <SelectableButton
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        isSelected={selectedSalutation === option.value}
                        onClick={handleSalutationClick}
                        isRadio={true}
                        name="salutation"
                      />
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="web-name" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-600" />
                    Name
                  </Label>                  <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
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
                </Label>                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
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
              </div>              <div className="flex items-start space-x-3 bg-rose-50 p-3 rounded-lg border border-brand-600/20">
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
              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-4 rounded-lg transition-all"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Website-Design anfordern
              </Button>
            </form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default WebsiteModal;
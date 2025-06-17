import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const WebsiteModal = ({ open, onClose }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Website-Anfrage abgeschickt!");
    handleClose();
  };
  
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  if (!open) return null;

  return (
    <div 
      onClick={handleClose} 
      className={`modal fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        onClick={stopPropagation} 
        className={`modal-content bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-250 ${isVisible ? 'scale-100' : 'scale-95'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
            Ihr interaktives Homepage-Design
          </h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-800 transition-colors">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="web-url" className="font-semibold text-slate-700 block mb-2">Unternehmens-URL</Label>
            <Input 
              type="url" 
              id="web-url" 
              name="web-url" 
              placeholder="https://ihre-firma.de" 
              className="w-full" 
              required 
            />
          </div>
          
          <div>
            <Label className="font-semibold text-slate-700 block mb-2">Ziele Ihrer neuen Homepage</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <Checkbox name="goals" className="h-4 w-4" />
                <span>Conversions steigern</span>
              </label>
              <label className="flex items-center space-x-3">
                <Checkbox name="goals" className="h-4 w-4" />
                <span>Traffic erhöhen</span>
              </label>
              <label className="flex items-center space-x-3">
                <Checkbox name="goals" className="h-4 w-4" />
                <span>Markenbekanntheit stärken</span>
              </label>
              <label className="flex items-center space-x-3">
                <Checkbox name="goals" className="h-4 w-4" />
                <span>Leads generieren</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="style" className="font-semibold text-slate-700 block mb-2">Gewünschter Stil</Label>
            <Select name="style">
              <SelectTrigger id="style" className="w-full">
                <SelectValue placeholder="Stilrichtung auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Modern & Minimal</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="illustrative">Illustrativ</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="creative">Kreativ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="web-salutation" className="font-semibold text-slate-700 block mb-2">Anrede</Label>
              <Select name="salutation">
                <SelectTrigger id="web-salutation" className="w-full">
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="herr">Herr</SelectItem>
                  <SelectItem value="frau">Frau</SelectItem>
                  <SelectItem value="divers">Divers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="web-name" className="font-semibold text-slate-700 block mb-2">Name</Label>
              <Input 
                type="text" 
                id="web-name" 
                name="name" 
                className="w-full" 
                required 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="web-email" className="font-semibold text-slate-700 block mb-2">E-Mail</Label>
            <Input 
              type="email" 
              id="web-email" 
              name="email" 
              className="w-full" 
              required 
            />
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <Checkbox required className="h-4 w-4" />
              <span>Ich habe die Datenschutzhinweise gelesen.</span>
            </label>
          </div>          <Button 
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-4 rounded-lg transition-all"
          >
            Design anfordern
          </Button>
        </form>
      </div>
    </div>
  );
};
export default WebsiteModal;

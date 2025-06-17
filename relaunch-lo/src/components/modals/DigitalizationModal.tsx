import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

type ModalProps = {
  onClose: () => void;
};

const DigitalizationModal = ({ onClose }: ModalProps) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 250);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Digitalisierungs-Anfrage abgeschickt!");
        handleClose();
    };

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
     <div onClick={handleClose} className={`modal fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div onClick={stopPropagation} className={`modal-content bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-250 ${isVisible ? 'scale-100' : 'scale-95'}`}>
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">15-minütiges Strategiegespräch</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="digi-url">Unternehmens-URL</Label>
                    <Input type="url" id="digi-url" name="url" placeholder="https://ihre-firma.de" required />
                </div>
                 <div>
                    <Label>Bereiche für Digitalisierung</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                        <div className="flex items-center space-x-2"><Checkbox id="area-logistik" /><label htmlFor="area-logistik" className="text-sm font-medium">Logistik</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="area-vertrieb" /><label htmlFor="area-vertrieb" className="text-sm font-medium">Vertrieb</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="area-service" /><label htmlFor="area-service" className="text-sm font-medium">Kundenservice</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="area-marketing" /><label htmlFor="area-marketing" className="text-sm font-medium">Marketing</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="area-hr" /><label htmlFor="area-hr" className="text-sm font-medium">HR</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="area-finanzen" /><label htmlFor="area-finanzen" className="text-sm font-medium">Finanzen</label></div>
                    </div>
                </div>
                <div>
                     <Label>Dringlichkeit</Label>
                     <RadioGroup defaultValue="sofort" className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="sofort" id="urg-1" /><Label htmlFor="urg-1">Sofort</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="1-3m" id="urg-2" /><Label htmlFor="urg-2">1-3 Monate</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="3-6m" id="urg-3" /><Label htmlFor="urg-3">3-6 Monate</Label></div>
                     </RadioGroup>
                </div>
                <hr className="border-neutral-200" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                     <div className="space-y-2">
                        <Label>Anrede</Label>
                        <RadioGroup defaultValue="herr" className="flex items-center pt-2 space-x-4"><div className="flex items-center space-x-2"><RadioGroupItem value="herr" id="r-digi-1" /><Label htmlFor="r-digi-1">Herr</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="frau" id="r-digi-2" /><Label htmlFor="r-digi-2">Frau</Label></div></RadioGroup>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="digi-name">Vollständiger Name</Label>
                        <Input id="digi-name" required />
                    </div>
                </div>
                <div>
                    <Label htmlFor="digi-email">E-Mail</Label>
                    <Input type="email" id="digi-email" required />
                </div>
                <div className="flex items-start space-x-3 pt-2">
                    <Checkbox id="terms-digi" required className="mt-1" />
                    <label htmlFor="terms-digi" className="text-sm text-neutral-600">Ich habe die <a href="#" className="text-brand-600 hover:underline">Datenschutzhinweise</a> gelesen und akzeptiere sie.</label>
                </div>
                <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 text-base">Gespräch anfordern</Button>
            </form>
        </div>
    </div>
  );
};

export default DigitalizationModal;
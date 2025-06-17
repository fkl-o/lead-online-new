import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const AutomationModal = ({ onClose }: ModalProps) => {
    const [budgetValue, setBudgetValue] = useState(10000);
    const [quoteValue, setQuoteValue] = useState(15);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 250);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Automation-Anfrage abgeschickt!");
        handleClose();
    };
    
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
     <div onClick={handleClose} className={`modal fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div onClick={stopPropagation} className={`modal-content bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-250 ${isVisible ? 'scale-100' : 'scale-95'}`}>
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">Kostenlose Potenzial-Analyse</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                     <Label htmlFor="budget">Monatliches Marketing-Budget: <span className="font-bold text-secondary-600">{budgetValue.toLocaleString('de-DE')} €</span></Label>
                     <Input type="range" id="budget" name="budget" min="4000" max="50000" step="500" value={budgetValue} onChange={(e) => setBudgetValue(Number(e.target.value))} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary-600 mt-2" />
                </div>
                <div>
                     <Label htmlFor="quote">Abschlussquote (Leads → Aufträge): <span className="font-bold text-secondary-600">{quoteValue} %</span></Label>
                     <Input type="range" id="quote" name="quote" min="3" max="50" step="1" value={quoteValue} onChange={(e) => setQuoteValue(Number(e.target.value))} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary-600 mt-2" />
                </div>
                <div>
                    <Label htmlFor="margin">Marge pro Sale (Gewinn je Auftrag in €)</Label>
                    <Input type="number" id="margin" name="margin" placeholder="z.B. 2500" className="form-input" required />
                </div>
                 <hr className="border-neutral-200" />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Anrede</Label>
                        <RadioGroup defaultValue="herr" className="flex items-center pt-2 space-x-4"><div className="flex items-center space-x-2"><RadioGroupItem value="herr" id="r-auto-1" /><Label htmlFor="r-auto-1">Herr</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="frau" id="r-auto-2" /><Label htmlFor="r-auto-2">Frau</Label></div></RadioGroup>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="auto-name">Vollständiger Name</Label>
                        <Input id="auto-name" required />
                    </div>
                </div>
                 <div>
                    <Label htmlFor="auto-email">E-Mail</Label>
                    <Input type="email" id="auto-email" required />
                </div>
                <div className="flex items-start space-x-3 pt-2">
                    <Checkbox id="terms-auto" required className="mt-1" />
                    <label htmlFor="terms-auto" className="text-sm text-neutral-600">Ich habe die <a href="#" className="text-brand-600 hover:underline">Datenschutzhinweise</a> gelesen und akzeptiere sie.</label>
                </div>
                <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 text-base">ROI-Analyse anfordern</Button>
            </form>
        </div>
    </div>
  );
};

export default AutomationModal;
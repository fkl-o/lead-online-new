import { useState } from 'react';
import { X } from 'lucide-react';

const AutomationModal = ({ onClose }) => {
  const [budgetValue, setBudgetValue] = useState(10000);
  const [quoteValue, setQuoteValue] = useState(15);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formular abgeschickt!');
    onClose();
  };

  return (
    <div className="modal fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="modal-content bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform scale-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">Kostenlose Potenzial-Analyse</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                     <label htmlFor="budget" className="form-label">Monatliches Marketing-Budget: <span className="font-bold text-secondary-600">{budgetValue.toLocaleString('de-DE')} €</span></label>
                     <input type="range" id="budget" name="budget" min="4000" max="50000" step="500" value={budgetValue} onChange={(e) => setBudgetValue(e.target.value)} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary-600" />
                </div>
                <div>
                     <label htmlFor="quote" className="form-label">Abschlussquote (Leads → Aufträge): <span className="font-bold text-secondary-600">{quoteValue} %</span></label>
                     <input type="range" id="quote" name="quote" min="3" max="50" step="1" value={quoteValue} onChange={(e) => setQuoteValue(e.target.value)} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary-600" />
                </div>
                <div>
                    <label htmlFor="margin" className="form-label">Marge pro Sale (Gewinn je Auftrag in €)</label>
                    <input type="number" id="margin" name="margin" placeholder="z.B. 2500" className="form-input" required />
                </div>
                 <hr className="border-neutral-200" />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="form-label">Anrede</label>
                         <div className="segmented-control">
                            <input type="radio" id="auto-herr" name="salutation-auto" value="Herr" defaultChecked /><label htmlFor="auto-herr">Herr</label>
                            <input type="radio" id="auto-frau" name="salutation-auto" value="Frau" /><label htmlFor="auto-frau">Frau</label>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="auto-name" className="form-label">Name</label>
                        <input type="text" id="auto-name" name="name" className="form-input" required />
                    </div>
                </div>
                 <div>
                    <label htmlFor="auto-email" className="form-label">E-Mail</label>
                    <input type="email" id="auto-email" name="email" className="form-input" required />
                </div>
                <div className="privacy-check">
                    <label><input type="checkbox" required /><span>Ich habe die <a href="#" className="text-brand-600 hover:underline">Datenschutzhinweise</a> gelesen und akzeptiere sie.</span></label>
                </div>
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-4 rounded-lg transition-all">ROI-Analyse anfordern</button>
            </form>
        </div>
    </div>
  );
};

export default AutomationModal;
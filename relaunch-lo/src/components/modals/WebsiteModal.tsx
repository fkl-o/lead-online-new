import { X, TrendingUp, MousePointerClick, Gem, Users } from 'lucide-react';

const WebsiteModal = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier würde die Logik zum Absenden des Formulars folgen
    alert('Formular abgeschickt!');
    onClose();
  };

  return (
    <div className="modal fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="modal-content bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900">Ihr interaktives Homepage-Design</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="web-url" className="form-label">Unternehmens-URL</label>
            <input type="url" id="web-url" name="web-url" placeholder="https://ihre-firma.de" className="form-input" required />
          </div>
          <div>
            <label className="form-label">Ziele Ihrer neuen Homepage</label>
            <div className="choice-card-group">
              <div className="choice-card"><input type="checkbox" id="goal1" name="goals" value="conversions" /><label htmlFor="goal1"><TrendingUp className="icon" /><span className="label-text">Conversions steigern</span></label></div>
              <div className="choice-card"><input type="checkbox" id="goal2" name="goals" value="traffic" /><label htmlFor="goal2"><MousePointerClick className="icon" /><span className="label-text">Traffic erhöhen</span></label></div>
              <div className="choice-card"><input type="checkbox" id="goal3" name="goals" value="branding" /><label htmlFor="goal3"><Gem className="icon" /><span className="label-text">Markenbekanntheit</span></label></div>
              <div className="choice-card"><input type="checkbox" id="goal4" name="goals" value="leads" /><label htmlFor="goal4"><Users className="icon" /><span className="label-text">Leads generieren</span></label></div>
            </div>
          </div>
          <div>
            <label htmlFor="style" className="form-label">Gewünschter Stil</label>
            <select id="style" name="style" className="form-input bg-white" required>
              <option>Modern & Minimal</option><option>Flat</option><option>Illustrativ</option><option>Corporate</option><option>Kreativ</option>
            </select>
          </div>
          <hr className="border-neutral-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="form-label">Anrede</label>
              <div className="segmented-control">
                <input type="radio" id="web-herr" name="salutation-web" value="Herr" defaultChecked /><label htmlFor="web-herr">Herr</label>
                <input type="radio" id="web-frau" name="salutation-web" value="Frau" /><label htmlFor="web-frau">Frau</label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="web-name" className="form-label">Name</label>
              <input type="text" id="web-name" name="name" className="form-input" required />
            </div>
          </div>
          <div>
            <label htmlFor="web-email" className="form-label">E-Mail</label>
            <input type="email" id="web-email" name="email" className="form-input" required />
          </div>
          <div className="privacy-check">
            <label><input type="checkbox" required /><span>Ich habe die <a href="#" className="text-brand-600 hover:underline">Datenschutzhinweise</a> gelesen und akzeptiere sie.</span></label>
          </div>
          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-4 rounded-lg transition-all">Design anfordern</button>
        </form>
      </div>
    </div>
  );
};

export default WebsiteModal;

import { useState } from 'react';
import { X, Truck, Handshake, Headphones, Megaphone, Users2, Landmark } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

interface DigitalizationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DigitalizationModal({ open, onClose }: DigitalizationModalProps) {
  const [url, setUrl] = useState<string>('');
  const [areas, setAreas] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<'sofort' | '1-3m' | '3-6m'>('sofort');
  const [salutation, setSalutation] = useState<'Herr' | 'Frau'>('Herr');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [accepted, setAccepted] = useState<boolean>(false);

  const toggleArea = (value: string) => {
    setAreas(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Einreichungslogik hier
    alert('Formular abgeschickt!');
    onClose();
  };

  const areaOptions = [
    { id: 'area1', value: 'logistik', label: 'Logistik', icon: Truck },
    { id: 'area2', value: 'vertrieb', label: 'Vertrieb', icon: Handshake },
    { id: 'area3', value: 'kundenservice', label: 'Service', icon: Headphones },
    { id: 'area4', value: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'area5', value: 'hr', label: 'HR', icon: Users2 },
    { id: 'area6', value: 'finanzen', label: 'Finanzen', icon: Landmark },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="max-w-2xl rounded-2xl p-8">
        <DialogHeader className="flex justify-between items-start pb-4">
          <DialogTitle className="text-2xl font-bold">
            15-minütiges Strategiegespräch
          </DialogTitle>
          <DialogClose asChild>
            <button className="text-slate-500 hover:text-slate-800 transition-colors">
              <X size={24} />
            </button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Unternehmens-URL */}
          <div>
            <Label htmlFor="digi-url" className="font-semibold">
              Unternehmens-URL
            </Label>
            <Input
              id="digi-url"
              type="url"
              placeholder="https://ihre-firma.de"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
          </div>

          {/* Bereiche für Digitalisierung */}
          <div>
            <Label className="font-semibold">Bereiche für Digitalisierung</Label>
            <div className="grid sm:grid-cols-3 gap-4 mt-2">
              {areaOptions.map(({ id, value, label, icon: Icon }) => (
                <Card
                  key={id}
                  onClick={() => toggleArea(value)}
                  className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-all $
                    {areas.includes(value)
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-neutral-200 bg-white'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <CardContent className="p-0">
                    <Checkbox
                      id={id}
                      checked={areas.includes(value)}
                      onCheckedChange={() => toggleArea(value)}
                      className="pointer-events-none"
                    />
                    <Label htmlFor={id} className="ml-2">
                      {label}
                    </Label>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Dringlichkeit */}
          <div>
            <Label className="font-semibold">Dringlichkeit</Label>
            <RadioGroup
              value={urgency}
              onValueChange={value => setUrgency(value as any)}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem id="urgency-1" value="sofort" />
                <Label htmlFor="urgency-1">Sofort</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem id="urgency-2" value="1-3m" />
                <Label htmlFor="urgency-2">1-3 Monate</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem id="urgency-3" value="3-6m" />
                <Label htmlFor="urgency-3">3-6 Monate</Label>
              </div>
            </RadioGroup>
          </div>

          <hr className="border-neutral-200" />

          {/* Anrede & Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="font-semibold">Anrede</Label>
              <RadioGroup
                value={salutation}
                onValueChange={value => setSalutation(value as any)}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem id="digi-herr" value="Herr" />
                  <Label htmlFor="digi-herr">Herr</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem id="digi-frau" value="Frau" />
                  <Label htmlFor="digi-frau">Frau</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="digi-name" className="font-semibold">
                Name
              </Label>
              <Input
                id="digi-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* E-Mail */}
          <div>
            <Label htmlFor="digi-email" className="font-semibold">
              E-Mail
            </Label>
            <Input
              id="digi-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Datenschutzhinweis */}
          <div className="flex items-center">
            <Checkbox
              id="privacy"
              checked={accepted}
              onCheckedChange={setAccepted}
              required
            />
            <Label htmlFor="privacy" className="ml-2">
              Ich habe die <a href="#" className="text-brand-600 hover:underline">Datenschutzhinweise</a> gelesen und akzeptiere sie.
            </Label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full py-4">
            Gespräch anfordern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

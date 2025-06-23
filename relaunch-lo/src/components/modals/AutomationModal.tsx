import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { leadApi } from '@/lib/api';

import {
  X,
  Calculator,
  Euro,
  Sparkles,
  DollarSign,
  Mail,
  Users
} from "lucide-react";

// Einheitlicher Button-Style - bleibt unverändert
const buttonStyle = "h-12 border-2 border-brand-600/20 data-[state=on]:bg-rose-50 data-[state=on]:text-brand-600 data-[state=on]:border-brand-600/100 data-[state=on]:shadow-[0_0_0_2px_#be123c] transition-all duration-200 ease-in-out";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const AutomationModal = ({ open, onClose }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // ROI Calculator states
  const [monthlyBudget, setMonthlyBudget] = useState<number>(4000); // Default min 4000
  const [conversionRate, setConversionRate] = useState<number>(25); // Default in percent
  const [marginPerSale, setMarginPerSale] = useState<number>(1500); // Default

  // State for the calculated monthly data and overall summaries
  const [monthlyProjections, setMonthlyProjections] = useState<any[]>([]); // Data for the table/cards
  const [totalRoiOver5Months, setTotalRoiOver5Months] = useState<number | null>(null);
  const [totalProfitOver5Months, setTotalProfitOver5Months] = useState<number | null>(null);
  // Contact form states
  const [salutation, setSalutation] = useState<string | null>(null);
  const [name, setName] = useState('');
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
      // Reset all states to initial values
      setMonthlyBudget(4000);
      setConversionRate(25);
      setMarginPerSale(1500);
      setMonthlyProjections([]);
      setTotalRoiOver5Months(null);
      setTotalProfitOver5Months(null);
      setSalutation(null);
      setName('');
      setEmail('');
      setPrivacyAgreed(false);
    }, 300);
  }, [onClose]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const calculateProjections = useCallback(() => {
    const budgetInput = Number(monthlyBudget);
    const rateInput = Number(conversionRate);
    const marginInput = Number(marginPerSale);

    if (isNaN(budgetInput) || budgetInput < 0 || isNaN(rateInput) || rateInput < 0 || isNaN(marginInput) || marginInput < 0) {
      setMonthlyProjections([]);
      setTotalRoiOver5Months(null);
      setTotalProfitOver5Months(null);
      return;
    }

    const projections = [];
    const fixedAgencyCosts = 4500; //

    const monthlyLeadPrices = [60, 60, 48, 36, 30]; //

    let cumulativeProfit = 0;
    let cumulativeInvestment = 0;

    for (let i = 0; i < 5; i++) { // Project for 5 months
      const currentLeadPrice = monthlyLeadPrices[i];
      const currentWerbebudget = budgetInput; // Werbebudget is consistent with slider input

      const numLeads = currentWerbebudget / currentLeadPrice;
      const sales = numLeads * (rateInput / 100);
      const grossProfitPerSale = marginInput;

      const kostenProAbschluss = sales > 0 ? currentWerbebudget / sales : 0;
      const gewinn = sales * grossProfitPerSale; // 'Gewinn' in screenshot implies Gross Profit from Sales

      const totalInvestmentForMonth = currentWerbebudget + fixedAgencyCosts;
      let monthlyRoi = 0;
      if (totalInvestmentForMonth > 0) {
          monthlyRoi = ((gewinn - fixedAgencyCosts) / totalInvestmentForMonth) * 100;
      }

      projections.push({
        month: i + 1,
        werbebudget: currentWerbebudget,
        avg_margin: grossProfitPerSale,
        lead_price: currentLeadPrice,
        num_leads: numLeads,
        conversion_rate: rateInput,
        cost_per_sale: kostenProAbschluss,
        sales: sales,
        profit: gewinn,
        agency_costs: fixedAgencyCosts,
        roi: monthlyRoi
      });

      cumulativeProfit += (gewinn - fixedAgencyCosts);
      cumulativeInvestment += totalInvestmentForMonth;
    }
    setMonthlyProjections(projections);

    if (cumulativeInvestment > 0) {
        setTotalRoiOver5Months((cumulativeProfit / cumulativeInvestment) * 100);
    } else {
        setTotalRoiOver5Months(null);
    }
    setTotalProfitOver5Months(cumulativeProfit);

  }, [monthlyBudget, conversionRate, marginPerSale]);

  useEffect(() => {
    calculateProjections();
  }, [monthlyBudget, conversionRate, marginPerSale, calculateProjections]);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salutation) return alert("Bitte wählen Sie eine Anrede aus.");
    if (!name) return alert("Bitte geben Sie Ihren Namen ein.");
    if (!email) return alert("Bitte geben Sie Ihre E-Mail-Adresse ein.");
    if (!privacyAgreed) return alert("Bitte stimmen Sie den Datenschutzhinweisen zu.");
    
    setIsSubmitting(true);
    
    try {
      // Prepare lead data for backend
      const leadData = {
        name: name.trim(),
        email: email.trim(),
        salutation: salutation as 'herr' | 'frau',
        source: 'automation' as const,        leadType: 'hot' as const, // Marketing automation leads are typically hot
        priority: 'high' as const,
        serviceDetails: {
          automation: {
            monthlyBudget: monthlyBudget,
            conversionRate: conversionRate,
            marginPerSale: marginPerSale,
            estimatedRoi: totalRoiOver5Months !== null ? totalRoiOver5Months : undefined,
            estimatedProfit: totalProfitOver5Months !== null ? totalProfitOver5Months : undefined
          }
        },
        estimatedValue: totalProfitOver5Months || 0,
        privacyConsent: privacyAgreed,
        marketingConsent: false
      };

      const response = await leadApi.createLead(leadData);
      
      if (response.success) {
        alert("Vielen Dank! Ihre Anfrage für ein Strategiegespräch wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.");
        handleClose();
      } else {
        throw new Error(response.message || 'Fehler beim Senden der Anfrage');
      }
    } catch (error) {
      console.error('Error submitting automation lead:', error);
      alert("Es gab einen Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div
      onClick={handleClose}
      // px-0.5 auf kleinen Screens für maximale Breite
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-0.5 sm:px-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        onClick={stopPropagation}
        // max-w-full auf kleinen Screens für maximale Breite, sm:max-w-2xl für größere
        // min-w-[300px] hinzugefügt, um auf sehr kleinen Geräten eine Mindestbreite zu gewährleisten
        className={`bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-full sm:max-w-2xl min-w-[300px] flex flex-col overflow-hidden max-h-[95vh] transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
              ROI-Prognose für Marketing Automation
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* ScrollArea um den gesamten Inhalt des Modals (außer Header/Footer) */}
        {/* Wichtig: `overflow-y-auto` für vertikales Scrollen des Inhalts. */}
        {/* `overflow-x-hidden` für den ScrollArea Container selbst, da die Tabelle darin scrollt. */}
        <ScrollArea className="flex-1 overflow-y-auto overflow-x-hidden pr-2 thin-scrollbar" type="always">
          <div className="px-1 pb-2"> {/* Inner padding */}
            <div className="space-y-6">

              {/* Input section for ROI Calculator */}
              <div className="p-4 rounded-lg border border-brand-600/20 bg-rose-50 space-y-3">
                <p className="text-sm text-gray-700 mb-4">Geben Sie Ihre Zahlen ein, um eine Prognose des Return on Investment (ROI) für Ihre Marketing Automation zu erhalten.</p>

                {/* Sliders and Input stacked vertically */}
                <div className="space-y-4">
                    {/* Monatliches Werbebudget - Custom styled native slider */}
                    <div className="space-y-1">
                        <Label htmlFor="monthly-budget" className="font-semibold text-xs sm:text-sm text-slate-700 block flex items-center gap-1">
                            <Euro className="h-3 w-3 text-brand-600" />
                            Werbebudget (€): <span className="font-bold text-brand-600 text-base">{monthlyBudget.toLocaleString('de-DE')} €</span>
                        </Label>
                        <input
                            type="range"
                            id="monthly-budget"
                            min="4000"
                            max="20000"
                            step="500"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer
                                       bg-gray-200 [--range-shdw:theme(colors.brand.600)]
                                       [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--range-shdw)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(var(--range-shdw)_/0.2)]
                                       [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-lg
                                       [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-[var(--range-shdw)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none
                                       [&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-lg"
                        />
                    </div>

                    {/* Abschlussquote Leads zu Aufträgen - Custom styled native slider */}
                    <div className="space-y-1">
                        <Label htmlFor="conversion-rate" className="font-semibold text-xs sm:text-sm text-slate-700 block flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-brand-600" />
                            Abschlussquote Leads zu Aufträgen (%): <span className="font-bold text-brand-600 text-base">{conversionRate.toLocaleString('de-DE')} %</span>
                        </Label>
                        <input
                            type="range"
                            id="conversion-rate"
                            min="0"
                            max="100"
                            step="1"
                            value={conversionRate}
                            onChange={(e) => setConversionRate(Number(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer
                                       bg-gray-200 [--range-shdw:theme(colors.brand.600)]
                                       [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--range-shdw)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(var(--range-shdw)_/0.2)]
                                       [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-lg
                                       [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-[var(--range-shdw)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none
                                       [&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-lg"
                        />
                    </div>

                    {/* Marge pro Verkauf - remains Input */}
                    <div className="space-y-1">
                        <Label htmlFor="margin-per-sale" className="font-semibold text-xs sm:text-sm text-slate-700 block flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-brand-600" />
                            Ø Marge pro Verkauf (€)
                        </Label>
                        <Input
                            type="number"
                            id="margin-per-sale"
                            placeholder="1500"
                            value={marginPerSale === 0 ? '' : marginPerSale}
                            onChange={(e) => setMarginPerSale(Number(e.target.value))}
                            className="h-9 text-sm"
                            min="0"
                        />
                    </div>
                </div>
              </div>

              {/* Summary and Detailed Monthly Prognosis Table/Cards */}
              {(totalRoiOver5Months !== null && totalProfitOver5Months !== null && monthlyProjections.length > 0) ? (
                <div className="bg-brand-50 p-4 rounded-lg border border-brand-600/20 space-y-4">
                  <h4 className="text-base sm:text-lg font-bold text-brand-700 flex items-center justify-center gap-2">
                    <Calculator className="h-5 w-5 text-brand-600" />
                    Ihre ROI-Prognose
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm border border-brand-200 text-center">
                      <p className="text-xs text-gray-600">Gesamt-ROI über 5 Monate:</p>
                      <p className="text-2xl font-extrabold text-brand-600">{totalRoiOver5Months.toFixed(0)} %</p>
                    </div>
                    <div className="p-2 bg-white rounded-md shadow-sm border border-brand-200 text-center">
                      <p className="text-xs text-gray-600">Geschätzter Gesamtgewinn:</p>
                      <p className="text-2xl font-extrabold text-brand-600">{totalProfitOver5Months.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>

                  {/* Detaillierte monatliche Prognose - Responsive Ansicht */}
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold text-neutral-800 mb-2 flex items-center gap-1">
                      <Calculator className="h-4 w-4 text-brand-600" />
                      Monatliche Details
                    </h5>

                    {/* Mobile: Cards Ansicht (unter sm) */}
                    <div className="sm:hidden space-y-3">
                        {monthlyProjections.map((p) => (
                            <div key={p.month} className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-xs space-y-1">
                                <p className="font-bold text-brand-700">Monat {p.month}</p>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                    <p>Budget: {p.werbebudget.toLocaleString('de-DE')} €</p>
                                    <p>Marge: {p.avg_margin.toLocaleString('de-DE')} €</p>
                                    <p>Leads: {p.num_leads.toFixed(0)}</p>
                                    <p>Abschlussq.: {p.conversion_rate.toFixed(0)} %</p>
                                    <p>Verkäufe: {p.sales.toFixed(2)}</p>
                                    <p>Gewinn: {p.profit.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                                    <p className="col-span-2 text-brand-600 font-bold">ROI: {p.roi.toFixed(0)} %</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Tabellen Ansicht (ab sm) */}
                    <div className="hidden sm:block overflow-x-auto text-xs">
                      <table className="min-w-max bg-white border border-gray-200 rounded-lg shadow-sm w-full"> {/* w-full hinzugefügt */}
                        <thead>
                          <tr>
                            <th className="py-1.5 px-2 text-left font-semibold text-gray-700 bg-gray-100 whitespace-nowrap"></th>
                            {monthlyProjections.map((_, index) => (
                              <th key={index} className="py-1.5 px-2 text-left font-semibold text-gray-700 bg-gray-100 whitespace-nowrap">
                                M. {index + 1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Each row condensed */}
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Werbebudget</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.werbebudget.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Ø Marge</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.avg_margin.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Lead-Preis</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.lead_price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Leads</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.num_leads.toFixed(0)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Abschlussq.</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.conversion_rate.toFixed(0)} %
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Kosten/Abschluss</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.cost_per_sale.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Verkäufe</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.sales.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Gewinn</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.profit.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b border-gray-200 font-medium whitespace-nowrap">Agentur K.</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.agency_costs.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                            ))}
                          </tr>
                          <tr className="font-bold bg-gray-50">
                            <td className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">ROI</td>
                            {monthlyProjections.map((proj, index) => (
                              <td key={index} className="py-1 px-2 border-b border-gray-200 whitespace-nowrap">
                                {proj.roi.toFixed(0)} %
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Hinweis in eigener Box mit Hintergrundfarbe */}
                  <div className="mt-4 p-3 rounded-lg border border-brand-600/20 bg-rose-50 text-xs text-gray-600 text-left">
                      <em>Hinweis: Dies ist eine vereinfachte Prognose basierend auf den von Ihnen eingegebenen Werten und der Erfahrung aus ähnlichen Projekten. Für eine detaillierte Analyse besprechen wir Ihre spezifischen Zahlen gerne in einem persönlichen Strategiegespräch.</em>
                  </div>
                </div>
              ) : (
                // Die Hinweismeldung, wenn keine gültigen Daten eingegeben sind
                <div className="mt-6 p-4 rounded-lg border border-brand-600/20 bg-rose-50 text-center text-gray-500 italic text-sm">
                    Bitte geben Sie gültige Werte ein, um die Prognose zu sehen.
                </div>
              )}

              <hr className="border-gray-200 my-6" />

              {/* Contact form */}
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <h4 className="text-base sm:text-lg font-semibold text-neutral-900 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-brand-600" />
                    Vereinbaren Sie Ihr Strategiegespräch
                </h4>
                <p className="text-sm text-gray-700">Füllen Sie die Felder aus, um einen Termin für Ihr kostenloses 15-minütiges Strategiegespräch zu vereinbaren.</p>

                {/* Anrede + Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 items-start">
                  <div className="md:col-span-1">
                    <Label className="font-semibold text-xs sm:text-sm text-slate-700 block mb-2">Anrede</Label>
                    <div className="flex gap-2">
                      {['herr', 'frau'].map(option => (
                        <Button
                          key={option}
                          variant="outline"
                          type="button"
                          className={`flex-1 h-9 text-sm ${buttonStyle}`}
                          data-state={salutation === option ? "on" : "off"}
                          onClick={() => setSalutation(option)}
                        >
                          {option === 'herr' ? 'Herr' : 'Frau'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="contact-name" className="font-semibold text-xs sm:text-sm text-slate-700 block mb-2 flex items-center gap-1">
                      <Users className="h-3 w-3 text-brand-600" />
                      Name
                    </Label>
                    <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                      <Input
                        type="text"
                        id="contact-name"
                        className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* E-Mail */}
                <div>
                  <Label htmlFor="contact-email" className="font-semibold text-xs sm:text-sm text-slate-700 block mb-2 flex items-center gap-1">
                    <Mail className="h-3 w-3 text-brand-600" />
                    E-Mail
                  </Label>
                  <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                    <Input
                      type="email"
                      id="contact-email"
                      className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Datenschutz */}
                <div className="flex items-start space-x-2 bg-rose-50 p-2 rounded-lg border border-brand-600/20">
                  <Checkbox
                    id="privacy-contact"
                    checked={privacyAgreed}
                    onCheckedChange={(checked) => setPrivacyAgreed(!!checked)}
                    required
                    className="h-4 w-4 mt-0.5"
                  />
                  <Label htmlFor="privacy-contact" className="text-xs text-slate-700 cursor-pointer">
                    Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner Daten zu.
                  </Label>
                </div>                {/* Submit Contact */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-3 rounded-lg transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  {isSubmitting ? 'Wird gesendet...' : 'Strategiegespräch anfordern'}
                </Button>
              </form>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AutomationModal;
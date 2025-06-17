const TrustSection = () => {
  return (
    <section id="trust" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Vertrauen, das Ergebnisse schafft</h2>
                 <p className="text-slate-600 text-lg">Wir sind stolz darauf, mit innovativen Marken und ambitionierten Startups zusammenzuarbeiten.</p>
            </div>
            {/* Kundenlogos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center mb-20">
                <img src="https://placehold.co/150x60/ffffff/cbd5e1?text=Logo" alt="Kundenlogo 1" className="mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                <img src="https://placehold.co/150x60/ffffff/cbd5e1?text=Logo" alt="Kundenlogo 2" className="mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                <img src="https://placehold.co/150x60/ffffff/cbd5e1?text=Logo" alt="Kundenlogo 3" className="mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                <img src="https://placehold.co/150x60/ffffff/cbd5e1?text=Logo" alt="Kundenlogo 4" className="mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                <img src="https://placehold.co/150x60/ffffff/cbd5e1?text=Logo" alt="Kundenlogo 5" className="mx-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
            </div>
            {/* Testimonials & Statistik */}
            <div className="grid lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
                <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200 h-full flex flex-col">
                    <p className="text-slate-700 italic mb-6 flex-grow">"Dank unserer Analyse stieg unser Marketing-ROI um 25 %."</p>
                    <div className="flex items-center">
                        <img src="https://placehold.co/40x40/be123c/ffffff?text=M" alt="Kundenfoto" className="w-10 h-10 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-neutral-900">Max Mustermann</p>
                            <p className="text-slate-500 text-sm">Marketing Leiter, Future Corp</p>
                        </div>
                    </div>
                </div>
                 <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200 h-full flex flex-col">
                    <p className="text-slate-700 italic mb-6 flex-grow">"Das Strategiegespräch hat uns den Weg zur vollautomatisierten Fertigung geebnet."</p>
                    <div className="flex items-center">
                        <img src="https://placehold.co/40x40/060b23/ffffff?text=A" alt="Kundenfoto" className="w-10 h-10 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-neutral-900">Anna Schmidt</p>
                            <p className="text-slate-500 text-sm">CEO, Innovatech</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary-600/10 p-8 rounded-xl border border-secondary-600/20 text-center flex flex-col justify-center h-full">
                     <p className="text-6xl font-extrabold text-secondary-600">95%</p>
                     <p className="text-secondary-600 text-lg font-semibold mt-2">Kundenzufriedenheit</p>
                     <p className="text-slate-500 mt-4 text-sm">basierend auf über 200 erfolgreichen Projekten</p>
                </div>
            </div>
        </div>
    </section>
  );
};

export default TrustSection;
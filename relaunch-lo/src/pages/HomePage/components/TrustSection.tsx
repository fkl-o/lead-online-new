import { useScrollReveal } from '../../../hooks/use-scroll-reveal';
import { Quote } from 'lucide-react'; // z.B. Icon aus lucide-react, optional

const TrustSection = () => {
  const headingRef = useScrollReveal();
  const logosRef = useScrollReveal({ delay: 150 });
  const testimonialsRef = useScrollReveal({ delay: 300 });

  return (
    <section
      id="trust"
      className="py-24 md:py-32 bg-white relative overflow-hidden"
    >
      {/* dezentes Muster */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-white to-white pointer-events-none"></div>

      <div className="container mx-auto px-6 relative">
        <div
          ref={headingRef}
          className="text-center max-w-3xl mx-auto mb-20 reveal"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
            Vertrauen, das Ergebnisse schafft
          </h2>
          <p className="text-slate-600 text-lg md:text-xl">
            Wir sind stolz darauf, mit innovativen Marken und ambitionierten
            Startups zusammenzuarbeiten.
          </p>
        </div>

        {/* Kundenlogos */}
        <div
          ref={logosRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 items-center mb-24 reveal"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <img
              key={num}
              src={`https://placehold.co/150x60/ffffff/cbd5e1?text=Logo`}
              alt={`Kundenlogo ${num}`}
              className="mx-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 hover:scale-105 duration-300"
            />
          ))}
        </div>

        {/* Testimonials & Statistik */}
        <div
          ref={testimonialsRef}
          className="grid lg:grid-cols-3 gap-10 items-start max-w-7xl mx-auto reveal"
        >
          {[ 
            {
              text: `"Dank unserer Analyse stieg unser Marketing-ROI um 25 %."`,
              name: "Max Mustermann",
              role: "Marketing Leiter, Future Corp",
              img: "https://placehold.co/40x40/be123c/ffffff?text=M",
            },
            {
              text: `"Das Strategiegespräch hat uns den Weg zur vollautomatisierten Fertigung geebnet."`,
              name: "Anna Schmidt",
              role: "CEO, Innovatech",
              img: "https://placehold.co/40x40/060b23/ffffff?text=A",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm h-full flex flex-col relative"
            >
              <Quote className="w-6 h-6 text-secondary-600 absolute top-6 right-6 opacity-20" />
              <p className="text-slate-700 italic mb-6 flex-grow">
                {t.text}
              </p>
              <div className="flex items-center mt-auto">
                <img
                  src={t.img}
                  alt="Kundenfoto"
                  className="w-12 h-12 rounded-full mr-4 ring-2 ring-secondary-600/50"
                />
                <div>
                  <p className="font-bold text-neutral-900">{t.name}</p>
                  <p className="text-slate-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-secondary-600/10 p-10 rounded-2xl border border-secondary-600/20 text-center flex flex-col justify-center h-full shadow-sm">
            <p className="text-7xl font-extrabold text-secondary-600">95%</p>
            <p className="text-secondary-600 text-lg font-semibold mt-2">
              Kundenzufriedenheit
            </p>
            <p className="text-slate-500 mt-4 text-sm">
              Basierend auf über 200 erfolgreichen Projekten
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

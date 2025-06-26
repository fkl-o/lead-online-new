import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { useScrollReveal } from "../../hooks/use-scroll-reveal";
import { SEOHead, createServiceSchema } from "../../components/SEOHead";
import { ContactForm } from "../../components/forms/ContactForm";

const ContactPage = () => {
	const titleRef = useScrollReveal<HTMLHeadingElement>();
	const descRef = useScrollReveal<HTMLParagraphElement>({ delay: 150 });
	const cardsRef = useScrollReveal<HTMLDivElement>({ delay: 200 });

	const contactSchema = createServiceSchema(
		"Kontakt zu LeadGen Pro",
		"Kontaktieren Sie uns für professionelle Webentwicklung, Marketing Automation und Digitalisierung"
	);

	return (
		<>
			<SEOHead
				title="Kontakt | LeadGen Pro"
				description="Kontaktieren Sie LeadGen Pro für professionelle Webentwicklung, Marketing Automation und Digitalisierung. Wir freuen uns auf Ihre Nachricht!"
				keywords={['Kontakt', 'Beratung', 'Webentwicklung', 'Marketing Automation', 'Deutschland']}
				structuredData={contactSchema}
			/>
			
			<section 
				className="pt-28 pb-20 md:pt-40 md:pb-32 relative overflow-hidden bg-white min-h-screen" 
				role="main"
				aria-labelledby="contact-title"
			>
				<div className="absolute inset-0 hero-pattern" aria-hidden="true"></div>
				<div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
					<h1
						id="contact-title"
						ref={titleRef}
						className="reveal text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 leading-tight tracking-tighter mb-6 text-center max-w-5xl mx-auto"
					>
						Kontaktieren Sie uns
					</h1>
					<p
						ref={descRef}
						className="reveal max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-16 text-center"
					>
						Haben Sie Fragen oder möchten Sie mehr über unsere Dienstleistungen
						erfahren? Wir freuen uns auf Ihre Nachricht!
					</p>

					<div
						ref={cardsRef}
						className="reveal grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full"
						role="list"
						aria-label="Kontaktmöglichkeiten"
					>					{/* E-Mail Card */}
					<Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
						<CardHeader className="p-0">
							<div className="flex justify-between items-start mb-4">
								<Mail className="w-10 h-10 text-brand-600" />
							</div>
							<CardTitle className="font-bold text-2xl text-gray-900 mb-2">
								E-Mail
							</CardTitle>
							<CardDescription className="font-semibold text-gray-700 mb-4">
								Schreiben Sie uns eine Nachricht
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow p-0">
							<div className="space-y-3 mb-6">
								<p className="font-mono text-brand-600 font-semibold">
									info@leadgenpro.com
								</p>
								<p className="text-slate-600">
									Wir antworten in der Regel innerhalb eines Werktags mit einer
									ausführlichen Beratung zu Ihrem Projekt.
								</p>
							</div>
						</CardContent>
						<CardFooter className="p-0">
							<Button
								asChild
								className="mt-auto w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-lg"
							>
								<a href="mailto:info@leadgenpro.com">E-Mail senden</a>
							</Button>
						</CardFooter>
					</Card>					{/* Telefon Card */}
					<Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
						<CardHeader className="p-0">
							<div className="flex justify-between items-start mb-4">
								<Phone className="w-10 h-10 text-brand-600" />
							</div>
							<CardTitle className="font-bold text-2xl text-gray-900 mb-2">
								Telefon
							</CardTitle>
							<CardDescription className="font-semibold text-gray-700 mb-4">
								Direkter Kontakt zu unseren Experten
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow p-0">
							<div className="space-y-3 mb-6">
								<p className="font-mono text-brand-600 font-semibold">
									+49 123 456 789
								</p>
								<p className="text-slate-600">
									Sprechen Sie direkt mit unseren Experten und erhalten Sie
									sofortige Beratung zu Ihrem digitalen Projekt.
								</p>
							</div>
						</CardContent>
						<CardFooter className="p-0">
							<Button
								asChild
								className="mt-auto w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-lg"
							>
								<a href="tel:+49123456789">Jetzt anrufen</a>
							</Button>
						</CardFooter>
					</Card>					{/* Adresse Card */}
					<Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col md:col-span-2 lg:col-span-1">
						<CardHeader className="p-0">
							<div className="flex justify-between items-start mb-4">
								<MapPin className="w-10 h-10 text-brand-600" />
							</div>
							<CardTitle className="font-bold text-2xl text-gray-900 mb-2">
								Büro
							</CardTitle>
							<CardDescription className="font-semibold text-gray-700 mb-4">
								Besuchen Sie uns nach Terminvereinbarung
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow p-0">
							<div className="space-y-3 mb-6">
								<p className="font-mono text-brand-600 font-semibold">
									Musterstraße 123
									<br />
									12345 Musterstadt
								</p>
								<p className="text-slate-600">
									Vereinbaren Sie einen persönlichen Termin für eine ausführliche
									Beratung in unserem Büro.
								</p>
							</div>
						</CardContent>
						<CardFooter className="p-0">
							<Button
								asChild
								className="mt-auto w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-lg"
							>
								<a
									href="https://www.google.com/maps"
									target="_blank"
									rel="noopener noreferrer"
								>
									Route planen
								</a>
							</Button>
						</CardFooter>
					</Card>
				</div>

				{/* Kontaktformular Section */}
				<div className="mt-16 max-w-2xl mx-auto">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Schreiben Sie uns eine Nachricht
						</h2>
						<p className="text-lg text-gray-600">
							Nutzen Sie unser Kontaktformular für eine schnelle und direkte Anfrage.
						</p>
					</div>
					<ContactForm />
				</div>
			</div>
		</section>
		</>
	);
};

export default ContactPage;

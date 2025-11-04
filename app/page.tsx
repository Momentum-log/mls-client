import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
	return (
		<div className="min-h-screen bg-white">
			<Navbar/>
			<main>
				{/* Hero Section */}
				<section className="relative bg-brand-blue text-white py-24 lg:py-32">
					<div className="absolute inset-0 bg-black opacity-10"></div>
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
							Logistics,{' '}
							<span className="text-brand-yellow">Simplified.</span>
						</h1>
						<p className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
							Streamline your shipping with our comprehensive logistics solutions. Get instant quotes, track shipments,
							and manage your deliveries effortlessly.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/shipping-estimate"
								className="bg-brand-yellow text-brand-blue px-10 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
							>
								Get an Estimate
							</Link>
							<Link
								href="/services"
								className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-brand-blue transition-all duration-300"
							>
								Our Services
							</Link>
						</div>
					</div>
				</section>
				
				{/* How It Works */}
				<section className="py-20 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-brand-blue mb-4">How It Works</h2>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto">
								Our streamlined process makes logistics easy. Follow these simple steps to get your shipments moving.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
							<div className="text-center group">
								<div
									className="bg-brand-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
									1
								</div>
								<h3 className="text-2xl font-semibold mb-3 text-gray-800">Get a Quote</h3>
								<p className="text-gray-600 leading-relaxed">
									Enter your shipment details and receive instant, competitive pricing tailored to your needs.
								</p>
							</div>
							<div className="text-center group">
								<div
									className="bg-brand-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
									2
								</div>
								<h3 className="text-2xl font-semibold mb-3 text-gray-800">Book Shipment</h3>
								<p className="text-gray-600 leading-relaxed">
									Secure your booking with our secure payment system and get your tracking number immediately.
								</p>
							</div>
							<div className="text-center group">
								<div
									className="bg-brand-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
									3
								</div>
								<h3 className="text-2xl font-semibold mb-3 text-gray-800">Track & Deliver</h3>
								<p className="text-gray-600 leading-relaxed">
									Monitor your shipment in real-time and receive updates until successful delivery.
								</p>
							</div>
						</div>
					</div>
				</section>
				
				{/* Services Overview */}
				<section className="py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-brand-blue mb-4">Our Services</h2>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto">
								Comprehensive logistics solutions designed to meet all your shipping and warehousing needs.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div
								className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
								<div
									className="w-16 h-16 bg-brand-blue rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-yellow transition-colors duration-300">
									<Image src="/file.svg" alt="Local Courier" width={32} height={32} className="text-white"/>
								</div>
								<h3 className="text-2xl font-semibold text-brand-blue mb-3">Local Courier</h3>
								<p className="text-gray-600 mb-6 leading-relaxed">
									Fast and reliable delivery within your city or region. Perfect for urgent local shipments.
								</p>
								<Link
									href="/services"
									className="text-brand-yellow font-semibold hover:text-brand-blue transition-colors duration-300"
								>
									Learn More →
								</Link>
							</div>
							<div
								className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
								<div
									className="w-16 h-16 bg-brand-blue rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-yellow transition-colors duration-300">
									<Image src="/globe.svg" alt="International Freight" width={32} height={32}/>
								</div>
								<h3 className="text-2xl font-semibold text-brand-blue mb-3">International Freight</h3>
								<p className="text-gray-600 mb-6 leading-relaxed">
									Global shipping solutions for your international business needs with customs clearance support.
								</p>
								<Link
									href="/services"
									className="text-brand-yellow font-semibold hover:text-brand-blue transition-colors duration-300"
								>
									Learn More →
								</Link>
							</div>
							<div
								className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
								<div
									className="w-16 h-16 bg-brand-blue rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-yellow transition-colors duration-300">
									<Image src="/window.svg" alt="Warehousing" width={32} height={32}/>
								</div>
								<h3 className="text-2xl font-semibold text-brand-blue mb-3">Warehousing</h3>
								<p className="text-gray-600 mb-6 leading-relaxed">
									Secure storage and inventory management solutions to keep your goods safe and organized.
								</p>
								<Link
									href="/services"
									className="text-brand-yellow font-semibold hover:text-brand-blue transition-colors duration-300"
								>
									Learn More →
								</Link>
							</div>
						</div>
					</div>
				</section>
				
				{/* Call to Action */}
				<section className="py-20 bg-brand-blue text-white">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-4xl font-bold mb-6">Ready to Simplify Your Logistics?</h2>
						<p className="text-xl mb-10 leading-relaxed">
							Join thousands of businesses that trust Momentum Logistics for their shipping needs.
						</p>
						<Link
							href="/shipping-estimate"
							className="bg-brand-yellow text-brand-blue px-10 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
						>
							Get Started Today
						</Link>
					</div>
				</section>
			</main>
			<Footer/>
		</div>
	);
}

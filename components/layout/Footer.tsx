import Link from 'next/link';

export default function Footer() {
	return (
		<footer className="bg-gray-800 text-white py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-semibold text-brand-yellow">Momentum Logistics</h3>
						<p className="mt-2">Streamlining logistics for a better tomorrow.</p>
					</div>
					<div>
						<h4 className="text-md font-semibold">Quick Links</h4>
						<ul className="mt-2 space-y-1">
							<li><Link href="/" className="hover:text-brand-yellow">Home</Link></li>
							<li><Link href="/about" className="hover:text-brand-yellow">About</Link></li>
							<li><Link href="/services" className="hover:text-brand-yellow">Services</Link></li>
							<li><Link href="/contact" className="hover:text-brand-yellow">Contact</Link></li>
						</ul>
					</div>
					<div>
						<h4 className="text-md font-semibold">Services</h4>
						<ul className="mt-2 space-y-1">
							<li><Link href="/services" className="hover:text-brand-yellow">Local Courier</Link></li>
							<li><Link href="/services" className="hover:text-brand-yellow">International Freight</Link></li>
							<li><Link href="/services" className="hover:text-brand-yellow">Warehousing</Link></li>
						</ul>
					</div>
					<div>
						<h4 className="text-md font-semibold">Contact</h4>
						<p className="mt-2">Email: info@momentumlogistics.com</p>
						<p>Phone: +1 (123) 456-7890</p>
					</div>
				</div>
				<div className="mt-8 border-t border-gray-700 pt-4 text-center">
					<p>&copy; 2025 Momentum Logistics Service. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}

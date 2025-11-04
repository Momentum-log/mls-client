import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold text-brand-blue">
							Momentum Logistics
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						<Link href="/" className="text-gray-700 hover:text-brand-blue">
							Home
						</Link>
						<Link href="/about" className="text-gray-700 hover:text-brand-blue">
							About
						</Link>
						<Link href="/services" className="text-gray-700 hover:text-brand-blue">
							Services
						</Link>
						<Link href="/contact" className="text-gray-700 hover:text-brand-blue">
							Contact
						</Link>
						<Link href="/track" className="text-gray-700 hover:text-brand-blue">
							Track
						</Link>
						<Link href="/shipping-estimate"
						      className="bg-brand-yellow text-brand-blue px-4 py-2 rounded-md font-medium hover:bg-yellow-400">
							Get an Estimate
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}

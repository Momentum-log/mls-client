import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-yellow/90 text-foreground py-8">
      <div className="p-2 w-full md:max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand-blue">
              Momentum Logistics
            </h3>
            <p className="mt-2 text-foreground/70">
              Streamlining logistics for a better tomorrow.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-foreground/70">
              <li>
                <Link href="/" className="hover:text-brand-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-blue">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-blue">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-blue">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold">Services</h4>
            <ul className="mt-2 space-y-1 text-foreground/70">
              <li>
                <Link href="/services" className="hover:text-brand-blue">
                  Local Courier
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-blue">
                  International Freight
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-blue">
                  Warehousing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold">Contact</h4>
            <p className="mt-2 text-foreground/70">
              Email: info@momentumlogistics.com
            </p>
            <p className="text-foreground/70">Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 border-t border-foreground/10 pt-4 text-center text-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} Momentum Logistics Service. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

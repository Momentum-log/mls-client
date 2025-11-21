import Link from "next/link";
import Container from "../shared/container";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-yellow text-foreground py-8">
      <Container>
        <div className="pt-32 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/logo-footer.svg"
                alt="Momentum Logistics Logo"
                width={150}
                height={50}
              />
              <p className="mt-2 text-foreground/70 font-medium">
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
      </Container>
    </footer>
  );
}

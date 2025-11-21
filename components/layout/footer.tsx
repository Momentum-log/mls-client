import Link from "next/link";
import Container from "../shared/container";
import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-white py-8">
      <Container>
        <div className="pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Image
                src="/images/logo-footer-ii.svg"
                alt="Momentum Logistics Logo"
                width={150}
                height={50}
                className="brightness-0 invert"
              />
              <p className="text-white/80 font-medium text-sm leading-relaxed">
                Streamlining logistics for a better tomorrow. We deliver
                excellence, one shipment at a time.
              </p>
              <div className="flex gap-4 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-brand-yellow">
                Quick Links
              </h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-brand-yellow">
                Services
              </h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link
                    href="/services"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Local Courier
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    International Freight
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Warehousing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Supply Chain
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-brand-yellow">
                Contact Us
              </h4>
              <ul className="space-y-3 text-white/80 text-sm">
                <li>
                  <span className="block font-semibold text-white">Email:</span>
                  <a
                    href="mailto:info@momentumlogistics.com"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    info@momentumlogistics.com
                  </a>
                </li>
                <li>
                  <span className="block font-semibold text-white">Phone:</span>
                  <a
                    href="tel:+11234567890"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    +1 (123) 456-7890
                  </a>
                </li>
                <li>
                  <span className="block font-semibold text-white">
                    Address:
                  </span>
                  123 Logistics Way, Suite 100
                  <br />
                  New York, NY 10001
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-white/60 text-sm">
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

import Link from "next/link";
import Container from "../shared/container";
import Image from "next/image";
import {
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import CountrySelector from "../shared/country-selector";

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
                  href="https://x.com/momentumlogserv?s=21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/momentumlogservices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/momentum-logistics-services/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/48795069276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" />
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
                    href="/track-shipment"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Track Shipment
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
                Legal
              </h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Cookie Policy
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
                    href="mailto:info@momentumlogservices.com"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    info@momentumlogservices.com
                  </a>
                </li>
                <li>
                  <span className="block font-semibold text-white">Phone:</span>
                  <a
                    href="tel:+48795069276"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    +48 795 069 276
                  </a>
                </li>
                <li>
                  <span className="block font-semibold text-white">
                    Address:
                  </span>
                  Pilota zwirki 17,
                  <br />
                  90-539 Łódź
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/60 text-sm gap-4">
            <p>
              &copy; {new Date().getFullYear()} Momentum Logistics Service. All
              rights reserved.
            </p>
            <CountrySelector />
          </div>
        </div>
      </Container>
    </footer>
  );
}

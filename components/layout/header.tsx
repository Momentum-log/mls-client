import Container from "@/components/shared/container";
import Image from "next/image";
import { FC } from "react";
import Button from "../ui/button";
import Link from "next/link";

const Header: FC = () => {
  return (
    <div className="bg-white text-brand-blue py-2">
      <Container>
        <div className="flex items-center">
          {/* logo */}
          <div className="flex items-center">
            <Image
              src="/images/logo-temp.jpg"
              alt="MLS Logo"
              width={150}
              height={50}
              className="rounded-lg h-10 w-10 object-cover"
            />
            <span className="ml-2 font-bold text-xl">MLS</span>
          </div>

          {/* navbar */}
          <nav className=" mr-8 ml-auto">
            <ul className="flex items-center space-x-4 font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-gray-300 hover:underline decoration-brand-yellow"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-gray-300 hover:underline decoration-brand-yellow"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-300 hover:underline decoration-brand-yellow"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-300 hover:underline decoration-brand-yellow"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* cta */}
          <Button rounded="full" size="md">
            Get a Quote
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Header;

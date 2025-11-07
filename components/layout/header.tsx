"use client";
import Container from "@/components/shared/container";
import Image from "next/image";
import { FC, useState } from "react";
import Button from "../ui/button";
import Link from "next/link";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white text-brand-blue py-4  md:px-8">
      <Container>
        <div className="flex items-center justify-between">
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
          <nav className="hidden md:flex mr-8 ml-auto">
            <ul className="flex items-center space-x-4 font-medium text-lg">
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
          <div className="hidden md:block">
            <Button rounded="full" size="md">
              Get a Quote
            </Button>
          </div>

          {/* mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-brand-blue">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <div
          className={`md:hidden px-4 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen pb-8" : "max-h-0"
          }`}
        >
          <nav className="mt-4">
            <ul className="flex flex-col space-y-4 font-medium text-lg">
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
          <div className="mt-4 -ml-2">
            <Button rounded="full" size="md">
              Get a Quote
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;

"use client";
import Container from "@/components/shared/container";
import { FC, useState, useEffect } from "react";
import Button from "../ui/button";
import Link from "next/link";
import logoLandscape from "@/public/images/logo-landscape.svg";
import logoLandscapeWhite from "@/public/images/logo-landscape-white.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaArrowRight, FaXmark, FaBars, FaUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import HeaderCountrySelector from "@/components/shared/header-country-selector";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/shipping-estimate", label: "Get a Quote" },
  ];

  return (
    <header className="bg-white text-brand-blue py-4 md:px-8 relative z-50">
      <Container>
        <div className="flex items-center justify-between">
          {/* logo */}
          <div className="flex items-center relative z-50">
            <Link href="/" onClick={closeMenu}>
              <div className="relative w-32 md:w-40 h-10">
                <Image
                  src={isMenuOpen ? logoLandscapeWhite : logoLandscape}
                  alt="Momentum Logistics Service Logo"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navbar */}
          <nav className="hidden md:flex mr-8 ml-auto">
            <ul className="flex items-center space-x-8 font-medium text-lg">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`hover:text-brand-yellow transition-colors relative group ${
                      pathname === link.href
                        ? "text-brand-blue font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-brand-yellow transition-all duration-300 ${
                        pathname === link.href
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <HeaderCountrySelector />
            {isAuthenticated ? (
              <Button
                onClick={() => router.push("/app/dashboard")}
                rounded="full"
                size="md"
                className="gap-2"
              >
                <FaUser className="w-4 h-4" />
                Account
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/register")}
                rounded="full"
                size="md"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative z-50">
            <button
              onClick={toggleMenu}
              className={`p-2 focus:outline-none transition-colors duration-300 ${
                isMenuOpen ? "text-white" : "text-brand-blue"
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaXmark className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-brand-blue z-40 transition-all duration-500 ease-in-out md:hidden ${
          isMenuOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        {/* Abstract Background Artifacts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/20 to-transparent"></div>
          <div className="absolute top-1/3 left-10 w-2 h-2 bg-brand-yellow rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-700"></div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="flex flex-col h-full justify-center px-8 relative z-10">
          <nav>
            <ul className="space-y-6">
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  className={`transform transition-all duration-500 delay-[${
                    index * 100
                  }ms] ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between text-3xl font-bold tracking-tight group ${
                      pathname === link.href ? "text-white" : "text-white/60"
                    }`}
                  >
                    <span className="group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    {pathname === link.href && (
                      <FaArrowRight className="w-6 h-6 text-brand-yellow animate-pulse" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`mt-12 transform transition-all duration-500 delay-300 ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {isAuthenticated ? (
              <Button
                onClick={() => router.push("/app/dashboard")}
                rounded="full"
                size="lg"
                className="w-full justify-center bg-brand-yellow text-brand-blue hover:bg-white hover:text-brand-blue border-none gap-2"
              >
                <FaUser className="w-5 h-5" />
                My Account
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/register")}
                rounded="full"
                size="lg"
                className="w-full justify-center bg-brand-yellow text-brand-blue hover:bg-white hover:text-brand-blue border-none"
              >
                Create Account
              </Button>
            )}

            {!isAuthenticated && (
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-white text-lg font-medium hover:text-brand-yellow"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-4">
              {/* Mobile Region Toggle */}
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-sm">Region:</span>
                <HeaderCountrySelector />
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40">
                Momentum Logistics
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

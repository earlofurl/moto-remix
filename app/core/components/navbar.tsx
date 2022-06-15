import { Link } from "@remix-run/react";

export default function Navbar() {
  const navigationLeft = [
    { to: "/strains", name: "Strains" },
    { to: "/find-us", name: "Find" },
  ];

  const navigationRight = [
    { to: "/#contact", name: "Contact" },
    { to: "/#about", name: "About" },
  ];

  return (
    <header className="bg-brand-primary">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Top"
      >
        <div className="flex w-full flex-wrap items-center justify-center border-b border-indigo-500 pt-6 lg:border-none">
          <div className="flex items-center">
            <div className="space-x-3 sm:space-x-5">
              {navigationLeft.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-lg font-semibold text-black hover:text-gray-400 sm:text-2xl"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <Link to="/">
              <span className="sr-only">Moto Perpetuo Farm</span>
              <img
                className="h-10 w-auto px-4"
                src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto,h_75,w_75/v1654565806/Moto_Logo_Badge_Dark_x2xjut.png"
                alt="moto-logo"
              />
            </Link>
            <div className="space-x-3 sm:space-x-5">
              {navigationRight.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-lg font-semibold text-black hover:text-gray-400 sm:text-2xl"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

import { Link } from "@remix-run/react";

export default function Navbar() {
  const navigation = [
    { to: "/strains", name: "Strains" },
    { to: "/find-us", name: "Find" },
    { to: "/#contact", name: "Contact" },
    { to: "/#about", name: "About" },
  ];

  return (
    <header className="bg-brand-primary">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Top"
      >
        <div className="flex w-full items-center justify-center border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex items-center">
            <Link to="#">
              <span className="sr-only">Workflow</span>
              <img
                className="hidden h-10 w-auto pr-4 sm:flex"
                src="https://res.cloudinary.com/ursine-design/image/upload/q_auto,f_auto,h_75,w_75/v1654565806/Moto_Logo_Badge_Dark_x2xjut.png"
                alt="moto-logo"
              />
            </Link>
            <div className="xs:flex-wrap ml-10 space-x-10 sm:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-lg font-semibold text-black hover:text-gray-400"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          {/*<div className="ml-10 space-x-4">*/}
          {/*  <a*/}
          {/*      href="#"*/}
          {/*      className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"*/}
          {/*  >*/}
          {/*    Sign in*/}
          {/*  </a>*/}
          {/*  <a*/}
          {/*      href="#"*/}
          {/*      className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"*/}
          {/*  >*/}
          {/*    Sign up*/}
          {/*  </a>*/}
          {/*</div>*/}
        </div>
        {/*<div className="hidden justify-center space-x-10 py-4">*/}
        {/*  {navigation.map((link) => (*/}
        {/*    <Link*/}
        {/*      key={link.name}*/}
        {/*      to={link.to}*/}
        {/*      className="hover:text-brand-accent-dark text-black"*/}
        {/*    >*/}
        {/*      {link.name}*/}
        {/*    </Link>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </nav>
    </header>
  );
}
{
  /*<div className="relative right-40 flex items-center justify-around">*/
}
{
  /*  <div className="flex contents items-center justify-start space-x-10">*/
}
{
  /*    <Link*/
}
{
  /*      to="/strains"*/
}
{
  /*      className="mx-auto text-2xl font-bold"*/
}
{
  /*    >*/
}
{
  /*      Strain Information*/
}
{
  /*    </Link>*/
}
{
  /*    <Link*/
}
{
  /*      to="/find-us"*/
}
{
  /*      className="mx-auto text-2xl font-bold"*/
}
{
  /*    >*/
}
{
  /*      Find Us*/
}
{
  /*    </Link>*/
}
{
  /*  </div>*/
}
{
  /*</div>*/
}
{
  /*<div className="absolute mx-auto flex items-center justify-center">*/
}
{
  /*  <div className="from-brand-primary z-1 relative flex contents items-center overflow-visible rounded-full bg-gradient-to-b to-transparent pt-10">*/
}
{
  /*    <Link*/
}
{
  /*      to="/"*/
}
{
  /*      className="font-bold"*/
}
{
  /*    >*/
}
{
  /*      <img*/
}
{
  /*        src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto/v1654565806/Moto_Logo_Badge_Dark_x2xjut.png"*/
}
{
  /*        alt="Moto Logo"*/
}
{
  /*        className="h-24 w-24 rounded-full"*/
}
{
  /*      />*/
}
{
  /*    </Link>*/
}
{
  /*  </div>*/
}
{
  /*</div>*/
}
{
  /*<div className="relative left-14 flex items-center justify-around">*/
}
{
  /*  <div className="flex contents items-center justify-start space-x-10">*/
}
{
  /*    <Link*/
}
{
  /*      to="#"*/
}
{
  /*      className="text-2xl font-bold"*/
}
{
  /*    >*/
}
{
  /*      Contact*/
}
{
  /*    </Link>*/
}
{
  /*    <Link*/
}
{
  /*      to="#"*/
}
{
  /*      className="text-2xl font-bold"*/
}
{
  /*    >*/
}
{
  /*      About*/
}
{
  /*    </Link>*/
}
{
  /*  </div>*/
}
{
  /*</div>*/
}

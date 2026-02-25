import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="mt-auto text-white"
      style={{ background: "linear-gradient(135deg, #0f2060 0%, #1a3a8f 100%)" }}
    >
      <div className="container mx-auto px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <img
              src="/footer-logo.png"
              alt="GFinder"
              style={{ height: 44, width: "auto" }}
            />
            <p className="mt-3 max-w-xs text-sm text-blue-200/80">
              Helping communities reunite people with their lost belongings. Report, search, and connect.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-blue-200/80 hover:text-white transition-colors">— Home</Link>
              <Link to="/browse" className="block text-sm text-blue-200/80 hover:text-white transition-colors">Missing</Link>
              <Link to="/report" className="block text-sm text-blue-200/80 hover:text-white transition-colors">Report an item</Link>
            </div>
            <div className="space-y-2">
              <Link to="/how-it-works" className="block text-sm text-blue-200/80 hover:text-white transition-colors">How it works</Link>
              <Link to="/profile" className="block text-sm text-blue-200/80 hover:text-white transition-colors">Profile</Link>
              <Link to="/auth" className="block text-sm text-blue-200/80 hover:text-white transition-colors">Sign In</Link>
            </div>
          </div>

          <div className="text-sm text-blue-200/80">
            <p className="font-medium text-white">info@gfinder.com</p>
            <p className="mt-2">No 161, Guru Nanak Salai, Velachery,</p>
            <p>Chennai - 600042, Tamil Nadu.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-4">
          <p className="text-xs text-blue-200/50 text-center">
            © 2026 GOFIND® – Campus Lost &amp; Found Platform. GOFIND is an academic project developed using TypeScript, HTML, and CSS. This website is not affiliated with or endorsed by any college, organization, or third-party platform. All trademarks and logos belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

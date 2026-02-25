import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Missing" },
    { to: "/report", label: "Report An Item" },
    { to: "/how-it-works", label: "How it Works" },
    { to: "/profile", label: "Profile" },
  ];

  const isHome = location.pathname === "/";

  return (
    <div className="sticky top-0 z-50 px-4 pt-3 pb-0" style={{ background: "transparent" }}>
      {/* Floating pill navbar */}
      <div
        className="mx-auto max-w-5xl rounded-full px-6"
        style={{
          background: isHome ? "rgba(255,255,255,0.18)" : "#ffffff",
          backdropFilter: isHome ? "blur(16px)" : "none",
          WebkitBackdropFilter: isHome ? "blur(16px)" : "none",
          boxShadow: isHome
            ? "0 4px 24px -4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)"
            : "0 4px 24px -4px rgba(0,0,0,0.12)",
          border: isHome ? "1px solid rgba(255,255,255,0.25)" : "none",
        }}
      >
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="GFinder"
              style={{
                height: 32,
                width: "auto",
                filter: isHome ? "brightness(0) invert(1)" : "none",
                transition: "filter 0.2s",
              }}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${location.pathname === link.to
                  ? "font-bold"
                  : isHome
                    ? "text-white/90 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                  }`}
                style={location.pathname === link.to ? { color: isHome ? "#ffffff" : "#2d52cc" } : {}}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link to="/auth">
                <button
                  className="flex items-center gap-1.5 rounded-full border px-5 py-1.5 text-sm font-semibold transition-all hover:opacity-80"
                  style={{ borderColor: "#2d52cc", color: "#2d52cc" }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu btn */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg mt-2"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${location.pathname === link.to
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                  style={location.pathname === link.to ? { background: "linear-gradient(135deg,#2d52cc,#1a3a8f)" } : {}}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { handleSignOut(); setIsOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <button
                    className="flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold w-full mt-1"
                    style={{ borderColor: "#2d52cc", color: "#2d52cc" }}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

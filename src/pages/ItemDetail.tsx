import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Tag, ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import WaveHeader from "@/components/WaveHeader";
import { openWhatsAppChat } from "@/lib/whatsapp";

interface DbItem {
  id: string;
  type: "lost" | "found";
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact_name: string;
  contact_email: string;
  image_url: string | null;
  user_id: string;
  owner_phone?: string;
}

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<DbItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [isWhatsAppDisabled, setIsWhatsAppDisabled] = useState(false);
  const [whatsAppCooldown, setWhatsAppCooldown] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (itemError || !itemData) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await (supabase as any)
        .from("user_profiles")
        .select("phone")
        .eq("id", itemData.user_id)
        .maybeSingle();

      setItem({
        ...itemData,
        owner_phone: profileData?.phone || undefined,
      } as DbItem);

      setLoading(false);
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    if (whatsAppCooldown > 0) {
      const timer = setTimeout(() => setWhatsAppCooldown(whatsAppCooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsWhatsAppDisabled(false);
    }
  }, [whatsAppCooldown]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#2d52cc" }} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Item Not Found</h1>
        <p className="mb-6 text-gray-500">This listing doesn't exist or has been removed.</p>
        <Link to="/browse">
          <button
            className="rounded-full px-8 py-2.5 text-white font-semibold"
            style={{ background: "linear-gradient(135deg,#2d52cc,#1a3a8f)" }}
          >
            Back to Browse
          </button>
        </Link>
      </div>
    );
  }

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent! The owner will be notified.");
    setMessage("");
    setSenderName("");
    setSenderPhone("");
  };

  const handleWhatsAppContact = () => {
    if (!item?.owner_phone) {
      toast.error("Owner's phone number is not available.");
      return;
    }
    const result = openWhatsAppChat(item.owner_phone, item.title, senderName, senderPhone, message, '91');
    if (result.success) {
      toast.success("Opening WhatsApp...");
      setIsWhatsAppDisabled(true);
      setWhatsAppCooldown(10);
    } else {
      toast.error(result.error || "Failed to open WhatsApp");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WaveHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page title area matching Browse page */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Browse Items</h1>
          <p className="mt-1 text-gray-500 text-sm">Search Through All Reported Lost And Found Items</p>
        </div>

        {/* Search & filter row placeholder (decorative, not functional on detail page) */}
        <div className="mb-5 mx-auto max-w-3xl">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 gap-2 shadow-sm">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <span className="text-sm text-gray-400">Search...</span>
          </div>
        </div>

        {/* Filter pills row */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          {["All Types", "Lost", "Found"].map((t) => (
            <span
              key={t}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${t === "All Types" ? "text-white" : "bg-white border border-gray-200 text-gray-600"
                }`}
              style={t === "All Types" ? { background: "linear-gradient(135deg,#2d52cc,#1a3a8f)" } : {}}
            >
              {t}
            </span>
          ))}
          {["All Categories", "Electronics", "Wallet/Purse", "Keys", "Documents/ID", "Clothings", "Jewelry", "Bags/Backpacks", "Other"].map((cat) => (
            <span key={cat} className="rounded-full px-3 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600">
              {cat}
            </span>
          ))}
        </div>

        {/* Back link */}
        <Link
          to="/browse"
          className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back To Missing List
        </Link>

        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* Left side - details + contact form */}
            <div className="p-7">
              <h2 className="mb-3 text-2xl font-bold text-gray-900">{item.title}</h2>

              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase text-white ${item.type === "lost" ? "bg-red-500" : "bg-amber-400"
                    }`}
                >
                  {item.type}
                </span>
                <span className="text-xs text-gray-500">Reported by {item.contact_name}</span>
              </div>

              <div className="mb-5 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag className="h-4 w-4" style={{ color: "#2d52cc" }} />
                  {item.category}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" style={{ color: "#2d52cc" }} />
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" style={{ color: "#2d52cc" }} />
                  {item.location}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-1.5 text-base font-bold text-gray-900">Description</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>

              {/* Contact form */}
              <div>
                <h3 className="text-base font-bold text-gray-900">Contact the user</h3>
                <p className="mb-4 text-xs text-gray-500">
                  (Think this might be your item? Send a message to connect.)
                </p>

                <form onSubmit={handleContact} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        placeholder="Your Name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        placeholder="98765xxxxx"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      placeholder="Talk to user"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#2d52cc,#1a3a8f)" }}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>

                  {item?.owner_phone && (
                    <button
                      type="button"
                      onClick={handleWhatsAppContact}
                      disabled={isWhatsAppDisabled}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-green-500 text-green-600 font-semibold text-sm hover:bg-green-50 transition-colors disabled:opacity-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {isWhatsAppDisabled ? `WhatsApp (${whatsAppCooldown}s)` : "Send via WhatsApp"}
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Right side - image */}
            <div className="bg-gray-50 flex items-center justify-center min-h-[400px]">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: 600 }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-300 p-10">
                  <Tag className="h-16 w-16" />
                  <p className="text-sm">No image available</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemDetail;

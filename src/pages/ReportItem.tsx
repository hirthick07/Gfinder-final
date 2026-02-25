import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { categories } from "@/data/items";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, Loader2, Upload, X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WaveHeader from "@/components/WaveHeader";

const ReportItem = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialType = searchParams.get("type") === "found" ? "found" : "lost";
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    type: initialType as "lost" | "found",
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    contactName: "",
    contactEmail: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to report an item");
      navigate("/auth");
      return;
    }

    if (!form.title || !form.description || !form.category || !form.location || !form.date || !form.contactName || !form.contactEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    let image_url: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(path, imageFile);

      if (uploadError) {
        toast.error("Failed to upload image");
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("items").insert({
      user_id: user.id,
      type: form.type,
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      date: form.date,
      contact_name: form.contactName,
      contact_email: form.contactEmail,
      image_url,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit report");
    } else {
      toast.success("Item reported successfully!");
      navigate("/browse");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WaveHeader />

      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Report An Item</h1>
            <p className="mt-2 text-gray-500">
              Fill In The Details Below To Report A Lost Or
              <br />
              Found Item
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type toggle */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "lost" })}
                className={`rounded-lg px-8 py-2.5 text-sm font-semibold transition-all ${form.type === "lost"
                    ? "text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                style={form.type === "lost" ? { background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" } : {}}
              >
                I Lost An Item
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "found" })}
                className={`rounded-lg px-8 py-2.5 text-sm font-semibold transition-all ${form.type === "found"
                    ? "text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                style={form.type === "found" ? { background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" } : {}}
              >
                I Found An Item
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Title *</label>
                <input
                  placeholder="e.g., Black leather wallet"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger className="h-10 text-sm bg-white border-gray-200">
                    <SelectValue placeholder="Select one option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                placeholder="Provide a detailed description of the item..."
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors resize-none bg-white"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo (optional)</label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-full rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-blue-500 hover:text-blue-500 bg-white"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">Attach Photo</span>
                  <span className="text-xs">Drag an drop a file or browse file</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
                <input
                  placeholder="where was it lost/found?"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 gap-2 bg-white focus-within:border-blue-500 transition-colors">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="flex-1 outline-none text-sm bg-transparent text-gray-700"
                    placeholder="DD / MM / YYY"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                <input
                  placeholder="your Name"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number *</label>
                <input
                  placeholder="984667xxxx"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" }}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportItem;

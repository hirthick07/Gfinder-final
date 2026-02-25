import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { categories } from "@/data/items";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Pencil, Trash2, MapPin, Calendar, Tag, Loader2, X, Upload } from "lucide-react";
import WaveHeader from "@/components/WaveHeader";

interface DbItem {
  id: string;
  user_id: string;
  type: "lost" | "found";
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact_name: string;
  contact_email: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<DbItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    type: "lost" as "lost" | "found",
    contact_name: "",
    contact_email: "",
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load items");
    } else {
      setItems(data as DbItem[]);
    }
    setLoading(false);
  };

  const openEdit = (item: DbItem) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      type: item.type,
      contact_name: item.contact_name,
      contact_email: item.contact_email,
    });
    setEditImagePreview(item.image_url);
    setEditImageFile(null);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!editItem) return;

    let image_url = editItem.image_url;

    if (editImageFile && user) {
      const ext = editImageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(path, editImageFile);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("item-images")
          .getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("items")
      .update({
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        location: editForm.location,
        date: editForm.date,
        type: editForm.type,
        contact_name: editForm.contact_name,
        contact_email: editForm.contact_email,
        image_url,
      })
      .eq("id", editItem.id);

    if (error) {
      toast.error("Failed to update item");
    } else {
      toast.success("Item updated successfully");
      setEditItem(null);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete item");
    } else {
      toast.success("Item deleted");
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      </div>
    );
  }

  // Get initials for avatar
  const emailName = user.email?.split("@")[0] || "U";
  const initials = emailName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <WaveHeader />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="relative">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-white text-xl font-bold"
                style={{ background: "linear-gradient(135deg, #1a3a8f, #2d52cc)" }}
              >
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="h-3 w-3">
                  <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{emailName}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Items grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center shadow-sm">
              <MapPin className="mb-4 h-12 w-12 text-blue-200" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">No items reported yet</h3>
              <p className="mb-4 text-sm text-gray-500">
                Start by reporting a lost or found item
              </p>
              <button
                onClick={() => navigate("/report")}
                className="rounded-lg px-6 py-2 text-white text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" }}
              >
                Report an Item
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100"
                >
                  {item.image_url ? (
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase text-white ${item.type === "lost" ? "bg-red-500" : "bg-amber-400"
                            }`}
                        >
                          {item.type}
                        </span>
                        <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-gray-700 backdrop-blur-sm">
                          Reported by {item.contact_name}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center relative">
                      <Tag className="h-10 w-10 text-gray-300" />
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase text-white ${item.type === "lost" ? "bg-red-500" : "bg-amber-400"
                            }`}
                        >
                          {item.type}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>

                    <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      {item.location}
                    </div>
                    <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {item.category}
                      </span>
                    </div>

                    <p className="mb-4 line-clamp-3 text-sm text-gray-600">{item.description}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors">
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the report.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Item</h2>
                  <p className="text-sm text-gray-500">Update the details of your reported item.</p>
                </div>
                <button
                  onClick={() => setEditItem(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Type toggle */}
              <div className="flex gap-2 mb-4 mt-4">
                {(["lost", "found"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, type: t })}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all ${editForm.type === t
                      ? "text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    style={editForm.type === t ? { background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Item Title *</label>
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                      placeholder="Car Key"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                    <Select value={editForm.category} onValueChange={(val) => setEditForm({ ...editForm, category: val })}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Photo */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs font-medium text-gray-700">Photo</label>
                    <label className="text-xs text-blue-600 cursor-pointer hover:underline">
                      Change
                      <input type="file" accept="image/*" className="hidden" onChange={handleEditImageChange} />
                    </label>
                  </div>
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-full h-44 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">Click to upload photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleEditImageChange} />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-blue-500">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="flex-1 text-sm outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Contact Name *</label>
                    <input
                      value={editForm.contact_name}
                      onChange={(e) => setEditForm({ ...editForm, contact_name: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Contact number</label>
                    <input
                      value={editForm.contact_email}
                      onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdate}
                className="mt-6 w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2d52cc, #1a3a8f)", color: "#FFD700" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

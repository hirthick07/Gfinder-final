import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Loader2 } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import WaveHeader from "@/components/WaveHeader";
import { categories } from "@/data/items";
import { supabase } from "@/integrations/supabase/client";
import type { Item } from "@/data/items";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(
          data.map((d: any) => ({
            id: d.id,
            type: d.type,
            title: d.title,
            description: d.description,
            category: d.category,
            location: d.location,
            date: d.date,
            contactName: d.contact_name,
            contactEmail: d.contact_email,
            image: d.image_url || undefined,
          }))
        );
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [items, search, typeFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <WaveHeader />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Browse Items</h1>
          <p className="mt-2 text-gray-500">
            Search Through All Reported Lost And
            <br />
            Found Items
          </p>
        </div>

        {/* Search bar */}
        <div className="mx-auto mb-5 max-w-3xl">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 gap-2 shadow-sm focus-within:border-blue-400 transition-colors">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              placeholder="Search..."
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />

          {(["all", "lost", "found"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${typeFilter === t
                  ? "text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              style={typeFilter === t ? { background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" } : {}}
            >
              {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}

          <div className="flex flex-wrap gap-1.5 ml-1">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${categoryFilter === "all"
                  ? "text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              style={categoryFilter === "all" ? { background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" } : {}}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${categoryFilter === cat
                    ? "text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                style={categoryFilter === cat ? { background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
          </div>
        ) : (
          <>
            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item, i) => (
                  <ItemCard key={item.id} item={item} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center shadow-sm">
                <Search className="mb-4 h-12 w-12 text-gray-200" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">No items found</h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;

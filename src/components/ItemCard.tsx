import { Item } from "@/data/items";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ItemCardProps {
  item: Item;
  index?: number;
}

const ItemCard = ({ item, index = 0 }: ItemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/item/${item.id}`}>
        <div className="group rounded-xl border bg-card overflow-hidden card-shadow transition-all duration-300 hover:card-hover-shadow hover:-translate-y-1">
          <div className="relative">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-muted flex items-center justify-center">
                <Tag className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <Badge
                variant={item.type === "lost" ? "destructive" : "default"}
                className="text-xs font-semibold uppercase tracking-wider"
              >
                {item.type}
              </Badge>
              <span className="rounded-full bg-background/80 px-2 py-0.5 text-xs text-foreground backdrop-blur-sm">
                Reported by {item.contactName}
              </span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="mb-2 font-serif text-lg text-card-foreground group-hover:text-primary transition-colors">
              {item.title}
            </h3>

            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary" />
                {item.location}
              </span>
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

            <p className="line-clamp-3 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ItemCard;

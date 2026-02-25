export interface Item {
  id: string;
  type: "lost" | "found";
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contactName: string;
  contactEmail: string;
  image?: string;
}

export const categories = [
  "Electronics",
  "Wallet / Purse",
  "Keys",
  "Documents / ID",
  "Clothing",
  "Jewelry",
  "Bags / Backpacks",
  "Pets",
  "Other",
];

export const sampleItems: Item[] = [
  {
    id: "1",
    type: "lost",
    title: "Black Leather Wallet",
    description: "Lost my black leather wallet near the central park area. Contains important cards and some cash. Has initials 'JD' embossed on front.",
    category: "Wallet / Purse",
    location: "Central Park, Main Street",
    date: "2026-02-08",
    contactName: "John",
    contactEmail: "john@example.com",
  },
  {
    id: "2",
    type: "found",
    title: "Set of House Keys",
    description: "Found a set of 3 keys on a red keychain near the bus stop on Oak Avenue. One key appears to be a car key.",
    category: "Keys",
    location: "Oak Avenue Bus Stop",
    date: "2026-02-09",
    contactName: "Sarah",
    contactEmail: "sarah@example.com",
  },
  {
    id: "3",
    type: "lost",
    title: "Silver MacBook Pro 14\"",
    description: "Left my MacBook Pro at the university library, 3rd floor study area. It has a space-themed sticker on the back cover.",
    category: "Electronics",
    location: "City University Library",
    date: "2026-02-07",
    contactName: "Alex",
    contactEmail: "alex@example.com",
  },
  {
    id: "4",
    type: "found",
    title: "Gold Necklace with Pendant",
    description: "Found a gold necklace with a heart-shaped pendant in the women's restroom at Riverside Mall, 2nd floor.",
    category: "Jewelry",
    location: "Riverside Mall",
    date: "2026-02-10",
    contactName: "Maria",
    contactEmail: "maria@example.com",
  },
  {
    id: "5",
    type: "lost",
    title: "Blue Jansport Backpack",
    description: "Lost a blue Jansport backpack on the metro during morning commute. Contains notebooks and a water bottle.",
    category: "Bags / Backpacks",
    location: "Metro Line 3",
    date: "2026-02-06",
    contactName: "Chris",
    contactEmail: "chris@example.com",
  },
  {
    id: "6",
    type: "found",
    title: "Student ID Card",
    description: "Found a student ID card for City University near the coffee shop on Elm Street. Name partially visible.",
    category: "Documents / ID",
    location: "Elm Street Coffee Shop",
    date: "2026-02-09",
    contactName: "Pat",
    contactEmail: "pat@example.com",
  },
];

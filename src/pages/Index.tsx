import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { sampleItems } from "@/data/items";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const stats = [
  {
    value: "17+",
    label: "ITEMS RECOVERED",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-7 w-7"
        style={{ color: "#2d52cc" }}
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    value: "25+",
    label: "ITEMS REPORTED",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-7 w-7"
        style={{ color: "#22c55e" }}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "183+",
    label: "HAPPY STUDENTS",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-7 w-7"
        style={{ color: "#f59e0b" }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 13s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    value: "315+",
    label: "COMMUNITY MEMBERS",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-7 w-7"
        style={{ color: "#ec4899" }}
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

const floatingWords = [
  "Report",
  "Search",
  "Recover",
  "Match",
  "connect",
  "Verify",
];

const Index = () => {
  const recentItems = sampleItems.slice(0, 6);
  const [wordIndex, setWordIndex] = useState(2); // start at "Recover"
  const [prevWordIndex, setPrevWordIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevWordIndex(wordIndex);
      setWordIndex((i) => (i + 1) % floatingWords.length);
      // Clear previous after transition
      setTimeout(() => setPrevWordIndex(null), 700);
    }, 2000);
    return () => clearInterval(timer);
  }, [wordIndex]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden h-[100vh]"
        style={{ marginTop: "-72px"}}
      >
        {/* Full background image — already has blue bg, diamonds, wave, and woman */}
        <img
          src="/home-background-cta.png"
          alt="GFinder hero background"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectPosition: "center top",
            zIndex: 0,
            transformOrigin: "top center",
          }}
        />

        {/* Text content overlaid on the left */}
        {/* White wave at the bottom — sits above the image */}

        <div
          className="container relative mx-auto px-6 flex items-center"
          style={{
            zIndex: 2,
            minHeight: 640,
            paddingTop: 104,
            paddingBottom: 110,
          }}
        >
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p
                className="mb-3"
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "1.7rem",
                  color: "#faee1c",
                  fontStyle: "italic",
                  letterSpacing: "0.02em",
                }}
              >
                நம்ம Campus Students காண !!
              </p>
              <h1
                className="mb-5 text-6xl font-bold leading-tight md:text-5xl lg:text-6xl"
                style={{ color: "#faee1c" }}
              >
                Lost Something?
                <br />
                You Find It.
              </h1>
              <p className="mb-8 max-w-md text-base text-blue-100 md:text-lg">
                We are the digital lost &amp; found platform for campus users,
                and we value safety and simplicity to connect lost items with
                their rightful owners.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/report">
                  <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-800 shadow-lg hover:bg-blue-50 transition-all duration-200">
                    Report Lost Item
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link to="/report?type=found">
                  <button className="flex items-center gap-2 rounded-full border-2 border-white/70 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all duration-200">
                    Report a found item
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="border-b bg-white">
        <div className="container mx-auto grid grid-cols-2 gap-0 divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0 px-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center justify-center gap-3 py-6"
            >
              {stat.icon}
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recover section — centered, full-width sentence */}
      <section className="w-full px-4 py-12 md:py-16 text-center">
        <div className="relative overflow-hidden" style={{ minHeight: 120 }}>
          {/* FOREGROUND: single-line centered sentence with inline word loop */}
          <div
            className="relative flex items-center justify-center gap-x-3 font-bold text-gray-900"
            style={{
              zIndex: 10,
              fontSize: "clamp(1.2rem, 2.4vw, 2.2rem)",
              whiteSpace: "nowrap",
              paddingTop: "1rem",
              paddingBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            <span>The perfect starting point to</span>

            {/* Vertical slot — synced word slides in from below */}
            <span
              className="relative inline-block overflow-hidden"
              style={{ height: "1.2em", minWidth: "8rem" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center font-black"
                  style={{ color: "#2d52cc" }}
                >
                  {floatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>

            <span>what matters the most.</span>
          </div>
        </div>

        <p className="mt-4 mx-auto max-w-lg text-gray-500 text-base md:text-lg">
          GFinder reimagines how you get your belongings back. Our platform
          provides easy-to-use tools for listing, filtering, and recovering your
          lost valuables.
        </p>
      </section>

      {/* Recent Listings */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-blue-600">
              Recent Listings
            </h2>
            <p className="mt-2 text-gray-500">
              Latest items reported by the community
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentItems.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/browse">
              <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                view more <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{ color: "#2d52cc" }}
            >
              How it works
            </h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              Our platform makes it simple to report, search,
              <br className="hidden sm:block" />
              and recover lost belongings
            </p>
          </div>

          {/* Step 01 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 flex flex-col md:flex-row items-center gap-10"
          >
            {/* Text side */}
            <div className="flex-1 md:pr-8">
              <span
                className="block text-5xl font-extrabold mb-3"
                style={{ color: "#2d52cc", lineHeight: 1 }}
              >
                01
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Report lost or found items instantly.
              </h3>
              <p className="text-gray-500 mb-5">
                Lost something? Found something? Post it in seconds with all
                important details like location, date, and description. GOFIND
                makes reporting fast, clear, and organized for everyone.
              </p>
              <ul className="space-y-2">
                {[
                  "Add item name, category and description",
                  "Upload photo for better identification",
                  "Mention exact location and time",
                  "Instantly publish your post to the community",
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "#2d52cc" }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.415L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            {/* Image side */}
            <div className="flex-1 relative flex justify-center">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  width: 380,
                  height: 280,
                  border: "2px dashed #c7d3f7",
                  background: "#f0f4ff",
                }}
              >
                <img
                  src="/home1.png"
                  alt="Person reporting lost item"
                  className="w-full h-full object-cover"
                />
                {/* Floating dashboard card */}
                <div
                  className="absolute top-4 right-4 rounded-xl shadow-lg p-3 text-xs"
                  style={{ background: "white", minWidth: 130 }}
                >
                  <p className="text-gray-400 text-xs">Total users</p>
                  <p className="font-bold text-gray-900 text-base">2,420</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg
                      className="h-3 w-3 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-600 text-xs">
                      +40% Last month
                    </span>
                  </div>
                </div>
                {/* Earn Points badge */}
                <div
                  className="absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #2d52cc, #1a3a8f)",
                  }}
                >
                  🏆 Earn Karma!
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 02 — reversed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 flex flex-col md:flex-row-reverse items-center gap-10"
          >
            {/* Text side */}
            <div className="flex-1 md:pl-8">
              <span
                className="block text-5xl font-extrabold mb-3"
                style={{ color: "#2d52cc", lineHeight: 1 }}
              >
                02
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Search listings and find perfect matches.
              </h3>
              <p className="text-gray-500 mb-5">
                Browse through lost and found posts using filters and keywords.
                Our smart listing system helps you quickly identify items that
                match yours.
              </p>
              <ul className="space-y-2">
                {[
                  "Search by keywords and category",
                  "Filter by date and location",
                  "View recently posted items first",
                  "Quick matching for faster recovery",
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "#2d52cc" }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.415L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            {/* Image side */}
            <div className="flex-1 relative flex justify-center">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  width: 380,
                  height: 280,
                  border: "2px dashed #c7d3f7",
                  background: "#f0f4ff",
                }}
              >
                <img
                  src="/home2.png"
                  alt="Students browsing listings"
                  className="w-full h-full object-cover"
                />
                {/* Quick-find badge */}
                <div
                  className="absolute bottom-4 left-4 rounded-xl shadow-lg p-3 text-xs"
                  style={{ background: "white", minWidth: 140 }}
                >
                  <p className="font-semibold text-gray-800 mb-0.5">
                    ✅ Item Match Found!
                  </p>
                  <p className="text-gray-400">Wallet • Library, Block B</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 03 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            {/* Text side */}
            <div className="flex-1 md:pr-8">
              <span
                className="block text-5xl font-extrabold mb-3"
                style={{ color: "#2d52cc", lineHeight: 1 }}
              >
                03
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Connect securely and recover with confidence.
              </h3>
              <p className="text-gray-500 mb-5">
                Once you find a matching item, you can contact the person safely
                through the platform. GOFIND supports privacy-first
                communication without exposing personal details.
              </p>
              <ul className="space-y-2">
                {[
                  "Privacy-aware communication system",
                  "Direct messaging for faster coordination",
                  "Avoid scams with secure contact flow",
                  "Encourage safe item-return process",
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "#2d52cc" }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.415L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            {/* Image side */}
            <div className="flex-1 relative flex justify-center">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  width: 380,
                  height: 280,
                  border: "2px dashed #c7d3f7",
                  background: "#f0f4ff",
                }}
              >
                <img
                  src="/home3.png"
                  alt="Person recovering item"
                  className="w-full h-full object-cover"
                />
                {/* Process badge */}
                <div
                  className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                  style={{ background: "#22c55e" }}
                >
                  ✓ Process Done
                </div>
                {/* Stats card */}
                <div
                  className="absolute bottom-4 left-4 rounded-xl shadow-lg p-3 text-xs"
                  style={{ background: "white", minWidth: 130 }}
                >
                  <p className="text-gray-400 text-xs">Total contents</p>
                  <p className="font-bold text-gray-900 text-base">2,420</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg
                      className="h-3 w-3 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-600 text-xs">+3.14%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA — Contact.png as background, white card overlaid */}
      <section className="relative overflow-hidden h-[80vh]" style={{ minHeight: 420 }}>
        {/* Background: Contact.png (man + blue bg + waves) */}
        <img
          src="/footer-bg.png"
          alt="GFinder CTA background"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            
            zIndex: 0,
          }}
        />

        {/* Centered white card overlaid */}
        <div
          className="relative container mx-auto px-4 flex items-center justify-center"
          style={{ zIndex: 2, minHeight: 420 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center bg-white rounded-2xl px-12 py-10"
            style={{
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Help Your Community?
            </h2>
            <p className="text-gray-500 mb-6">
              Every item returned is a story of
              <br />
              human kindness.
            </p>
            <Link to="/report">
              <button
                className="inline-flex items-center gap-2 rounded-full w-full justify-center px-10 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #2d52cc, #1a3a8f)",
                }}
              >
                Report An Item Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;

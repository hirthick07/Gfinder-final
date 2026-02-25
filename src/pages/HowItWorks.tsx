import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, MessageCircle, ShieldCheck, Smartphone, MapPin, Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Report",
    desc: "Create a listing with all the details about the item — what it is, where and when it was lost or found.",
    detail: "Add photos, select a category, pin the location, and choose a date. The more detail you provide, the higher the chance of a match.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Discover",
    desc: "Browse or search through existing reports. Use filters to narrow down by category, location, or type.",
    detail: "Our smart search matches keywords, locations, and dates to surface the most relevant results for you instantly.",
    icon: Search,
  },
  {
    step: "03",
    title: "Reunite",
    desc: "Found a match? Send a secure message through the contact form to coordinate the return.",
    detail: "We keep your personal info private. Communicate through our built-in contact form to arrange a safe handoff.",
    icon: MessageCircle,
  },
];

const whyFeatures = [
  {
    icon: FileText,
    title: "Report in Seconds",
    desc: "Fill out a simple form with key details — title, location, date, and a photo. Done in under a minute.",
  },
  {
    icon: Search,
    title: "Instant Search",
    desc: "Find matching reports immediately using smart keyword and location filters — no waiting, no friction.",
  },
  {
    icon: MessageCircle,
    title: "One-Click Contact",
    desc: "Reach out to item owners directly through our built-in form. No sign-up hoops, no back-and-forth.",
  },
];

const platformFeatures = [
  { icon: Search, title: "Smart Search", desc: "Instantly find matching items with intelligent keyword, location, and date filtering." },
  { icon: ShieldCheck, title: "Verified Listings", desc: "Every report is tied to an authenticated user for trust and accountability." },
  { icon: MessageCircle, title: "Secure Messaging", desc: "Contact item owners through private forms — no personal info exposed." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Fully responsive experience on any device — report items on the go." },
  { icon: MapPin, title: "Location Pinning", desc: "Tag exact locations on reports so nearby users can spot matches quickly." },
  { icon: Bell, title: "Instant Alerts", desc: "Get notified when a new report matches your lost or found item criteria." },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            Simple &amp; Effective
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-4 max-w-2xl text-4xl text-foreground md:text-5xl"
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl text-lg text-muted-foreground"
          >
            Three Simple Steps To Report, Search, And Recover Lost Belongings
          </motion.p>
        </div>
      </section>

      {/* Interactive Stepper */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Center Timeline with Alternating Content */}
          <div className="relative">
            {/* Center vertical line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" />
            <motion.div
              className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 hero-gradient"
              initial={false}
              animate={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Timeline Steps */}
            <div className="space-y-16 md:space-y-24">
              {steps.map((s, i) => (
                <div key={s.step} className="relative">
                  {/* Center Button */}
                  <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                    <button
                      onClick={() => setActiveStep(i)}
                      className="group"
                    >
                      <motion.div
                        animate={{ scale: activeStep === i ? 1.15 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border-2 shadow-lg transition-colors duration-300 ${i <= activeStep
                          ? "hero-gradient border-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                          }`}
                      >
                        <s.icon className="h-5 w-5 md:h-6 md:w-6" />
                      </motion.div>
                    </button>
                  </div>

                  {/* Content Card - Alternating Sides */}
                  <div className={`flex ${i % 2 === 0 ? 'justify-end pl-[52%]' : 'justify-start pr-[52%]'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      onClick={() => setActiveStep(i)}
                      className={`w-full cursor-pointer rounded-2xl border bg-card p-6 md:p-8 card-shadow transition-all duration-300 ${activeStep === i ? 'ring-2 ring-primary/50 card-hover-shadow' : 'hover:card-hover-shadow'
                        }`}
                    >
                      <span className="font-serif text-3xl md:text-4xl text-primary">{s.step}.</span>
                      <div className="mt-4">
                        <h3 className="mb-3 text-xl md:text-2xl text-foreground">{s.title}</h3>
                        <p className="mb-3 text-sm md:text-base leading-relaxed text-muted-foreground">{s.desc}</p>
                        <p className="text-xs md:text-sm leading-relaxed text-muted-foreground/80">{s.detail}</p>
                      </div>

                      {activeStep === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 flex items-center justify-between border-t border-border pt-4"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStep(Math.max(0, activeStep - 1));
                            }}
                            disabled={activeStep === 0}
                            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            Previous
                          </button>
                          {activeStep < steps.length - 1 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveStep(activeStep + 1);
                              }}
                              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <Link to="/report" onClick={(e) => e.stopPropagation()}>
                              <Button variant="hero" size="sm">
                                Get Started
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-center text-3xl text-foreground md:text-4xl"
          >
            Why Choose Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-md text-center text-muted-foreground"
          >
            Built With Care For People Who Care
          </motion.p>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {whyFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col items-center gap-4 rounded-2xl border bg-card p-7 text-center transition-shadow duration-300 hover:card-hover-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:hero-gradient">
                  <f.icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                </div>
                <div>
                  <h3 className="mb-2 font-serif text-xl text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Platform Features
            </span>
            <h2 className="mb-3 text-3xl text-foreground md:text-4xl">
              Everything You Need
            </h2>
            <p className="text-muted-foreground">
              Powerful tools designed to make finding and returning lost items effortless
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border bg-card p-6 transition-shadow duration-300 hover:card-hover-shadow"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:hero-gradient">
                  <feature.icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-serif text-lg text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — card overlaps white-to-blue diagonal transition */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a3a8f 0%, #1e40af 100%)" }}
      >
        {/* White triangle covers the top-left */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: "white",
            clipPath: "polygon(0 0, 58% 0, 28% 100%, 0 100%)",
            zIndex: 0,
          }}
        />

        {/* Card floats over the diagonal */}
        <section className="relative container mx-auto px-4 py-16 md:py-20 flex justify-center" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white p-10 text-center"
            style={{
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mb-6 text-gray-500">Help your community by reporting lost or found items today.</p>
            <Link to="/report">
              <Button variant="hero" size="lg">
                Start Reporting
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;

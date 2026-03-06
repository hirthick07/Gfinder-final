/**
 * Blue gradient wave header used on inner pages (Browse, Report, HowItWorks, Profile, ItemDetail).
 * The navbar is floating/sticky so this just adds visual color + the wave transition to white.
 */
const WaveHeader = () => {
  return (
    <div
      className="relative overflow-hidden -mt-3 top-[-72px]"
      style={{ background: "linear-gradient(135deg, #1a3a8f 0%, #2d52cc 60%, #3b5fe0 100%)" }}
    >
      <div className="h-36" />
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        preserveAspectRatio="none"
        style={{ display: "block", marginBottom: -2 }}
      >
        <path d="M0 20C180 20 240 100 480 100C720 100 720 0 960 0C1200 0 1260 80 1440 80V120H0V20Z" fill="#f9fafb" />
      </svg>
    </div>
  );
};

export default WaveHeader;

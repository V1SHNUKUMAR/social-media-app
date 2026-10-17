export const Logo = ({ className = "", showText = true }) => (
  <div className={`inline-flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 100 100" className="size-9 shrink-0" role="img" aria-label="Moments">
      <defs>
        <linearGradient id="moments-g" x1="10" y1="0" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="0.55" stopColor="#C04CF0" />
          <stop offset="1" stopColor="#F0529C" />
        </linearGradient>
        <linearGradient id="moments-s" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="28" fill="url(#moments-g)" />
      <rect width="100" height="100" rx="28" fill="url(#moments-s)" />
      <path
        d="M27 72 V34 L50 57 L73 34 V72"
        fill="none"
        stroke="#fff"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="76" cy="23" r="5.5" fill="#fff" />
    </svg>
    {showText && (
      <span className="text-2xl font-extrabold tracking-tight text-foreground">
        Moments
      </span>
    )}
  </div>
);

export default Logo;
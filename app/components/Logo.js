export default function Logo({ size = '1.5rem', withText = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      {/* SVG Icon Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer hexagon/shield shape */}
        <path
          d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
          fill="url(#logo-gradient)"
          fillOpacity="0.15"
          stroke="url(#logo-gradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner dynamic arrow/boost shape */}
        <path
          d="M12 24L20 14L28 24H23V30H17V24H12Z"
          fill="url(#logo-gradient)"
          filter="url(#logo-glow)"
        />

        {/* Sparkle top right */}
        <circle cx="28" cy="12" r="2.5" fill="#ec4899" filter="url(#logo-glow)" />
      </svg>

      {/* Brand Text */}
      {withText && (
        <div style={{
          fontSize: size,
          fontWeight: 900,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}>
          SocialBooster<span style={{ WebkitTextFillColor: '#fff' }}>.</span>
        </div>
      )}
    </div>
  );
}

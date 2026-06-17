type LogoMarkProps = {
  className?: string
}

/**
 * AgroSkyTech logo mark — Concept #2 "Satellite Field View".
 * Circular emblem: a top-down agricultural drone (quadcopter) over a
 * patterned crop field. Clean vector style, no maple leaf, no airplane.
 * Scales cleanly from small header sizes up.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="AgroSkyTech logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer emblem ring */}
      <circle cx="24" cy="24" r="23" className="fill-forest" />
      <circle cx="24" cy="24" r="23" className="stroke-gold" strokeWidth="1.5" />

      {/* Field view (clipped to inner circle) */}
      <defs>
        <clipPath id="logo-field-clip">
          <circle cx="24" cy="24" r="19" />
        </clipPath>
      </defs>
      <g clipPath="url(#logo-field-clip)">
        {/* Field base */}
        <rect x="5" y="5" width="38" height="38" className="fill-forest" />
        {/* Crop rows in perspective */}
        <g className="stroke-gold" strokeWidth="1.4" opacity="0.55">
          <line x1="4" y1="30" x2="44" y2="27" />
          <line x1="4" y1="35" x2="44" y2="31" />
          <line x1="4" y1="40" x2="44" y2="35" />
          <line x1="4" y1="45" x2="44" y2="39" />
        </g>
        <g className="stroke-cream" strokeWidth="0.8" opacity="0.35">
          <line x1="4" y1="32.5" x2="44" y2="29" />
          <line x1="4" y1="37.5" x2="44" y2="33" />
          <line x1="4" y1="42.5" x2="44" y2="37" />
        </g>
      </g>

      {/* Top-down drone */}
      <g>
        {/* Diagonal arms */}
        <g className="stroke-cream" strokeWidth="2" strokeLinecap="round">
          <line x1="24" y1="20" x2="16.5" y2="13.5" />
          <line x1="24" y1="20" x2="31.5" y2="13.5" />
          <line x1="24" y1="20" x2="16.5" y2="26.5" />
          <line x1="24" y1="20" x2="31.5" y2="26.5" />
        </g>
        {/* Rotors */}
        <g className="fill-cream">
          <circle cx="16.5" cy="13.5" r="3.4" />
          <circle cx="31.5" cy="13.5" r="3.4" />
          <circle cx="16.5" cy="26.5" r="3.4" />
          <circle cx="31.5" cy="26.5" r="3.4" />
        </g>
        <g className="fill-forest">
          <circle cx="16.5" cy="13.5" r="1.5" />
          <circle cx="31.5" cy="13.5" r="1.5" />
          <circle cx="16.5" cy="26.5" r="1.5" />
          <circle cx="31.5" cy="26.5" r="1.5" />
        </g>
        {/* Body */}
        <circle cx="24" cy="20" r="4.6" className="fill-gold" />
        <circle cx="24" cy="20" r="1.8" className="fill-forest" />
      </g>
    </svg>
  )
}

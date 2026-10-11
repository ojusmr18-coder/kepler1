import * as React from "react";

// Soft Cartoon Style Icons (Cute, Rounded, Friendly)

export function CartoonHome({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Chimney */}
      <rect x="15" y="4" width="2.5" height="4.5" rx="1.2" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="16.25" cy="2.5" r="1" fill="#FED7AA" opacity="0.8" />
      {/* Cute Chubby House Body */}
      <path
        d="M5 11.5L10.8 6.2C11.5 5.6 12.5 5.6 13.2 6.2L19 11.5C19.6 12.1 19.3 13 18.5 13H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V13H5.5C4.7 13 4.4 12.1 5 11.5Z"
        fill="#FFEDD5"
        stroke="#F97316"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arched Door */}
      <path
        d="M10 21V15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15V21"
        fill="#FED7AA"
        stroke="#EA580C"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Door Knob */}
      <circle cx="13" cy="17" r="0.6" fill="#C2410C" />
      {/* Attic Round Window */}
      <circle cx="12" cy="10" r="1.8" fill="#FFFFFF" stroke="#F97316" strokeWidth="1.3" />
      <path d="M12 8.2V11.8M10.2 10H13.8" stroke="#F97316" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

export function CartoonBook({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Back Cover Depth */}
      <path
        d="M4 17.5C6.5 17 9.5 17.5 12 19C14.5 17.5 17.5 17 20 17.5V6.5C17.5 6 14.5 6.5 12 8C9.5 6.5 6.5 6 4 6.5V17.5Z"
        fill="#DDD6FE"
        stroke="#7C3AED"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Book Pages */}
      <path
        d="M4.5 16.5C6.8 16 9.5 16.4 11.8 17.8V6.8C9.5 5.5 6.8 5 4.5 5.5V16.5Z"
        fill="#FAF5FF"
        stroke="#8B5CF6"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 16.5C17.2 16 14.5 16.4 12.2 17.8V6.8C14.5 5.5 17.2 5 19.5 5.5V16.5Z"
        fill="#FFFFFF"
        stroke="#8B5CF6"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bookmark Ribbon */}
      <path
        d="M12 7V13.5L13.5 12.2L15 13.5V7"
        fill="#F43F5E"
        stroke="#E11D48"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Soft Page Lines */}
      <path d="M6.5 9H9.5M6.5 12H9" stroke="#C4B5FD" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14.5 9H17.5M15 12H17.5" stroke="#C4B5FD" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function CartoonAsk({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Antenna */}
      <path d="M12 4V6.5" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="3.2" r="1.4" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.2" />
      {/* Robot Face / Speech Bubble */}
      <rect
        x="3.5"
        y="6.5"
        width="17"
        height="13"
        rx="5.5"
        fill="#CCFBF1"
        stroke="#0D9488"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ears */}
      <rect x="2" y="10" width="1.8" height="4" rx="0.9" fill="#2DD4BF" />
      <rect x="20.2" y="10" width="1.8" height="4" rx="0.9" fill="#2DD4BF" />
      {/* Eyes */}
      <ellipse cx="8.5" cy="12" rx="1.5" ry="1.8" fill="#0F766E" />
      <circle cx="9" cy="11.4" r="0.6" fill="#FFFFFF" />
      <ellipse cx="15.5" cy="12" rx="1.5" ry="1.8" fill="#0F766E" />
      <circle cx="16" cy="11.4" r="0.6" fill="#FFFFFF" />
      {/* Rosy Cheeks */}
      <circle cx="6.8" cy="14.2" r="1" fill="#F43F5E" opacity="0.4" />
      <circle cx="17.2" cy="14.2" r="1" fill="#F43F5E" opacity="0.4" />
      {/* Cheerful Smile */}
      <path d="M10.2 14.5C11 15.6 13 15.6 13.8 14.5" stroke="#0F766E" strokeWidth="1.4" strokeLinecap="round" />
      {/* Sparkle Twinkle */}
      <path
        d="M18.8 4.2C18.8 4.2 19.3 5.4 20.2 5.8C19.3 6.2 18.8 7.4 18.8 7.4C18.8 7.4 18.3 6.2 17.4 5.8C18.3 5.4 18.8 4.2 18.8 4.2Z"
        fill="#F59E0B"
      />
    </svg>
  );
}

export function CartoonTest({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Clipboard Backboard */}
      <rect
        x="4"
        y="4"
        width="16"
        height="17.5"
        rx="3"
        fill="#FEF3C7"
        stroke="#D97706"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paper Sheet */}
      <rect
        x="6"
        y="6.5"
        width="12"
        height="13.5"
        rx="1.8"
        fill="#FFFFFF"
        stroke="#F59E0B"
        strokeWidth="1.2"
      />
      {/* Clip at Top */}
      <rect x="8.5" y="2.5" width="7" height="3.2" rx="1.6" fill="#FBBF24" stroke="#B45309" strokeWidth="1.3" />
      <circle cx="12" cy="4" r="0.9" fill="#78350F" />
      {/* Checkmarks & Lines */}
      <path d="M8 10L9.5 11.5L12 9" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 10.5H16" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8 14.2L9.5 15.7L12 13.2" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 14.7H16" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" />
      {/* Cute Gold Star Stamp */}
      <path
        d="M10 17.8L10.6 19L11.9 19.2L11 20.1L11.2 21.4L10 20.8L8.8 21.4L9 20.1L8.1 19.2L9.4 19L10 17.8Z"
        fill="#F59E0B"
        stroke="#D97706"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CartoonImprove({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Soft Pastel Background Pill / Badge */}
      <circle cx="12" cy="12" r="9" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.4" opacity="0.3" />
      {/* Cartoon Rocket Body */}
      <path
        d="M12 3.5C9.5 6 8.5 10 9 14.5L12 16L15 14.5C15.5 10 14.5 6 12 3.5Z"
        fill="#FFFFFF"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rocket Nose Tip */}
      <path
        d="M12 3.5C10.8 4.7 10.2 6.2 10 8H14C13.8 6.2 13.2 4.7 12 3.5Z"
        fill="#EF4444"
        stroke="#DC2626"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* Rocket Porthole */}
      <circle cx="12" cy="10.8" r="1.8" fill="#67E8F9" stroke="#0284C7" strokeWidth="1.2" />
      <circle cx="12.5" cy="10.3" r="0.5" fill="#FFFFFF" />
      {/* Rocket Fins */}
      <path d="M8.8 13.2L6.5 15.5C6.2 15.8 6.4 16.5 6.9 16.5H9L8.8 13.2Z" fill="#F87171" stroke="#DC2626" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M15.2 13.2L17.5 15.5C17.8 15.8 17.6 16.5 17.1 16.5H15L15.2 13.2Z" fill="#F87171" stroke="#DC2626" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Rocket Flame */}
      <path
        d="M10.8 16C10.8 17.5 11.4 19.5 12 21C12.6 19.5 13.2 17.5 13.2 16H10.8Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M11.4 16C11.4 17 11.7 18.2 12 19.2C12.3 18.2 12.6 17 12.6 16H11.4Z" fill="#EF4444" />
      {/* Speed sparkles */}
      <circle cx="5" cy="7" r="1" fill="#10B981" />
      <circle cx="19" cy="8" r="0.8" fill="#10B981" />
    </svg>
  );
}

export function CartoonPapers({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Back Paper */}
      <rect
        x="7"
        y="3"
        width="13"
        height="17"
        rx="2.5"
        fill="#FCE7F3"
        stroke="#DB2777"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front Paper with Folded Corner */}
      <path
        d="M4 6.5C4 5.4 4.9 4.5 6 4.5H13.5L17.5 8.5V19.5C17.5 20.6 16.6 21.5 15.5 21.5H6C4.9 21.5 4 20.6 4 19.5V6.5Z"
        fill="#FFFFFF"
        stroke="#E11D48"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Folded Corner Triangle */}
      <path
        d="M13.5 4.5V7.5C13.5 8.1 13.9 8.5 14.5 8.5H17.5"
        fill="#FBCFE8"
        stroke="#E11D48"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Text Lines */}
      <path d="M7 11.5H14.5" stroke="#F472B6" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M7 14.5H13" stroke="#F472B6" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M7 17.5H11" stroke="#F472B6" strokeWidth="1.3" strokeLinecap="round" />
      {/* Cute A+ Badge */}
      <circle cx="14.8" cy="16.5" r="2.4" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1.1" />
      <path d="M14.8 15V18M13.8 16.5H15.8" stroke="#E11D48" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// Cartoon Allie AI Avatar Mascot
export function CartoonAllieAvatar({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} {...props}>
      {/* Cute Antenna */}
      <path d="M18 7V3.5" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="18" cy="2.5" r="2" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.5" />
      {/* Cute Headphones / Earmuffs */}
      <rect x="2.5" y="14" width="3.5" height="8" rx="1.75" fill="#818CF8" stroke="#4F46E5" strokeWidth="1.6" />
      <rect x="30" y="14" width="3.5" height="8" rx="1.75" fill="#818CF8" stroke="#4F46E5" strokeWidth="1.6" />
      <path d="M4.5 15C4.5 9 10 5.5 18 5.5C26 5.5 31.5 9 31.5 15" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
      {/* Mascot Face Body */}
      <rect
        x="5"
        y="9"
        width="26"
        height="22"
        rx="9"
        fill="#F0FDFA"
        stroke="#0D9488"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Cute Glass Visor / Screen */}
      <rect x="8.5" y="12.5" width="19" height="11.5" rx="5" fill="#0F172A" />
      {/* Visor Glare */}
      <path d="M10 14.5L14 14.5" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />
      {/* Sparkling Friendly Cyan Eyes */}
      <ellipse cx="14" cy="18" rx="2" ry="2.6" fill="#2DD4BF" />
      <circle cx="14.8" cy="17" r="0.9" fill="#FFFFFF" />
      <ellipse cx="22" cy="18" rx="2" ry="2.6" fill="#2DD4BF" />
      <circle cx="22.8" cy="17" r="0.9" fill="#FFFFFF" />
      {/* Cute Happy Mouth */}
      <path d="M16.5 21.2C17.3 22.2 18.7 22.2 19.5 21.2" stroke="#2DD4BF" strokeWidth="1.6" strokeLinecap="round" />
      {/* Rosy Cheeks */}
      <circle cx="8" cy="22" r="1.8" fill="#FB7185" opacity="0.6" />
      <circle cx="28" cy="22" r="1.8" fill="#FB7185" opacity="0.6" />
    </svg>
  );
}

// Cartoon Paper Airplane Send Icon
export function CartoonSend({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path
        d="M21.5 2.5L10 14M21.5 2.5L14.5 21.5C14.1 22.5 12.8 22.5 12.4 21.5L9.5 14.5L2.5 11.6C1.5 11.2 1.5 9.9 2.5 9.5L21.5 2.5Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="14" r="1.2" fill="currentColor" />
    </svg>
  );
}

// Cartoon Twinkle Sparkle Star
export function CartoonSparkle({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path
        d="M12 2C12 2 13.5 7.5 17 9.5C13.5 11.5 12 17 12 17C12 17 10.5 11.5 7 9.5C10.5 7.5 12 2 12 2Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="4.5" r="1.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
      <circle cx="4.5" cy="17.5" r="1.2" fill="#F472B6" />
    </svg>
  );
}

// Cartoon Microphone
export function CartoonMic({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Mic Capsule */}
      <rect
        x="8.5"
        y="2.5"
        width="7"
        height="12"
        rx="3.5"
        fill="#E0F2FE"
        stroke="#0284C7"
        strokeWidth="1.8"
      />
      {/* Sound Grille Lines */}
      <path d="M9.5 6.5H14.5M9.5 9.5H14.5" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
      {/* Outer Cradle */}
      <path
        d="M5.5 10C5.5 13.6 8.4 16.5 12 16.5C15.6 16.5 18.5 13.6 18.5 10"
        stroke="#0284C7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Stand Base */}
      <path d="M12 16.5V20.5M8.5 20.5H15.5" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// Cartoon Zap / Score Booster Icon (Chubby, Rounded, Energetic Lightning Bolt with Sparkles)
export function CartoonZap({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      {/* Soft Glow Ambient Aura */}
      <circle cx="12" cy="12" r="9.2" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.2" opacity="0.4" />
      {/* Cute Chubby Lightning Bolt */}
      <path
        d="M12.8 2.8L6.8 11.2C6.4 11.8 6.8 12.6 7.6 12.6H11.2L9.6 20.2C9.4 21 10.4 21.5 11 20.8L17.2 12.8C17.7 12.2 17.2 11.4 16.4 11.4H13L14.2 3.8C14.3 3 13.4 2.4 12.8 2.8Z"
        fill="#2DD4BF"
        stroke="#0F766E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Highlight Reflection */}
      <path
        d="M12.5 5.2L8.5 11.2H11L10 16"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Tiny Energy Sparkles */}
      <circle cx="18.5" cy="6" r="1.1" fill="#F59E0B" />
      <circle cx="5.5" cy="17.5" r="0.9" fill="#F59E0B" />
    </svg>
  );
}

export const CartoonScoreBooster = CartoonZap;

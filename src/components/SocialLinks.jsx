import { usePublicSettings } from '../context/PublicSettingsContext';

// Inline SVGs rather than an icon package: six paths weigh far less than
// pulling a whole icon library into the bundle for this.
const ICONS = {
  youtube: (
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  ),
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.1A6.7 6.7 0 1 0 18.7 12 6.7 6.7 0 0 0 12 5.3Zm0 11a4.3 4.3 0 1 1 4.3-4.3 4.3 4.3 0 0 1-4.3 4.3Zm6.9-11.2a1.6 1.6 0 1 1-1.6-1.6 1.6 1.6 0 0 1 1.6 1.6Z" />
  ),
  facebook: (
    <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z" />
  ),
  twitter: (
    <path d="M18.9 2H22l-7 8 8.3 11h-6.5l-5-6.6L6 21H2.8l7.5-8.6L2.3 2h6.6l4.6 6.1L18.9 2Zm-1.1 17.1h1.7L7.3 3.8H5.4l12.4 15.3Z" />
  ),
  linkedin: (
    <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 2.1-2.1 2.1 2.1 0 0 1-2.1 2.1ZM7 20.4H3.5V9H7v11.4ZM22.2 0H1.8A1.8 1.8 0 0 0 0 1.8v20.4A1.8 1.8 0 0 0 1.8 24h20.4a1.8 1.8 0 0 0 1.8-1.8V1.8A1.8 1.8 0 0 0 22.2 0Z" />
  ),
  whatsapp: (
    <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6a2 2 0 0 0 .3-.5.6.6 0 0 0 0-.5c0-.2-.7-1.7-1-2.3s-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4A3.4 3.4 0 0 0 5.5 9c0 1.5 1.1 2.9 1.2 3.1a12 12 0 0 0 4.6 4.1 12.8 12.8 0 0 0 1.6.6 3.7 3.7 0 0 0 1.7.1 2.8 2.8 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z M12 0a12 12 0 0 0-10.3 18l-1.7 6.2 6.4-1.7A12 12 0 1 0 12 0Zm0 22a10 10 0 0 1-5.1-1.4l-.4-.2-3.8 1 1-3.7-.2-.4A10 10 0 1 1 12 22Z" />
  ),
  telegram: (
    <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0Zm5.6 8.2-1.9 8.9c-.1.6-.5.8-1 .5l-2.8-2.1-1.4 1.3a.7.7 0 0 1-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.4-.1l-6.7 4.2-2.9-.9c-.6-.2-.6-.6.1-.9l11.3-4.4c.5-.2 1 .1.7 1.1Z" />
  ),
  pinterest: (
    <path d="M12 0a12 12 0 0 0-4.4 23.2 11.5 11.5 0 0 1 .1-3.4l1.4-5.8a4.2 4.2 0 0 1-.3-1.7c0-1.6 1-2.8 2.1-2.8a1.5 1.5 0 0 1 1.5 1.7c0 1-.7 2.6-1 4a1.7 1.7 0 0 0 1.8 2.2c2.1 0 3.7-2.3 3.7-5.5a4.7 4.7 0 0 0-5-4.9 5.2 5.2 0 0 0-5.4 5.2 4.6 4.6 0 0 0 .9 2.7.4.4 0 0 1 .1.4l-.3 1.3c-.1.2-.2.3-.5.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.2 7.9-7.2a7 7 0 0 1 7.3 6.8c0 4.1-2.6 7.4-6.2 7.4a3.2 3.2 0 0 1-2.7-1.4l-.8 2.8a12.4 12.4 0 0 1-1.4 3A12 12 0 1 0 12 0Z" />
  ),
};

const PLATFORMS = [
  { key: 'social_youtube', name: 'YouTube', icon: 'youtube', hover: 'hover:bg-[#FF0000]' },
  { key: 'social_instagram', name: 'Instagram', icon: 'instagram', hover: 'hover:bg-[#E1306C]' },
  { key: 'social_facebook', name: 'Facebook', icon: 'facebook', hover: 'hover:bg-[#1877F2]' },
  { key: 'social_twitter', name: 'X', icon: 'twitter', hover: 'hover:bg-black' },
  { key: 'social_linkedin', name: 'LinkedIn', icon: 'linkedin', hover: 'hover:bg-[#0A66C2]' },
  { key: 'social_whatsapp', name: 'WhatsApp', icon: 'whatsapp', hover: 'hover:bg-[#25D366]' },
  { key: 'social_telegram', name: 'Telegram', icon: 'telegram', hover: 'hover:bg-[#229ED9]' },
  { key: 'social_pinterest', name: 'Pinterest', icon: 'pinterest', hover: 'hover:bg-[#BD081C]' },
];

export default function SocialLinks({ size = 'md', className = '' }) {
  const { settings } = usePublicSettings();

  // Only render platforms the admin has actually filled in, so the row never
  // shows dead links.
  const active = PLATFORMS.filter((p) => settings[p.key]?.trim());
  if (active.length === 0) return null;

  const dimensions = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 14 : 17;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {active.map((p) => (
        <a
          key={p.key}
          href={settings[p.key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={p.name}
          title={p.name}
          className={`flex ${dimensions} items-center justify-center rounded-full border border-brand-ink/10 bg-white text-brand-ink/60 transition-all hover:-translate-y-0.5 hover:border-transparent hover:text-white ${p.hover}`}
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            {ICONS[p.icon]}
          </svg>
        </a>
      ))}
    </div>
  );
}

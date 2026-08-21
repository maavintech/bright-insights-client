import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';
import SocialLinks from './SocialLinks';
import VisitCounter from './VisitCounter';

const EXPLORE = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/resources', label: 'Free Downloads' },
  { to: '/videos', label: 'Watch' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <span className="font-bold text-brand-ink">Bright Side Insights</span>
            </div>
            <p className="mt-3 max-w-xs text-[14.5px] leading-relaxed text-brand-ink/60">
              Simple knowledge for a better everyday life — money, parenting, lifestyle and AI,
              explained without the jargon.
            </p>
            <SocialLinks className="mt-5" size="sm" />
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/50">
              Explore
            </h3>
            <nav className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[15px] text-brand-ink/70">
              {EXPLORE.map((item) => (
                <Link key={item.to} to={item.to} className="hover:text-brand-blue">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <NewsletterForm source="footer" />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-ink/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-brand-ink/50">
            © {new Date().getFullYear()} Bright Side Insights. Simple knowledge for a better
            everyday life.
          </p>
          <VisitCounter />
        </div>
      </div>
    </footer>
  );
}

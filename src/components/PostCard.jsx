import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5002/api').replace(/\/api\/?$/, '');

function imageUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function PostRow({ post }) {
  const image = imageUrl(post.featuredImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group flex items-center gap-5 border-b border-brand-ink/[0.07] bg-white px-4 py-4 transition-colors hover:bg-brand-blue/[0.04]"
      >
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-blue/10 sm:h-28 sm:w-36">
          {image ? (
            <img src={image} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">🌟</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {post.category && (
              <span className="rounded-md bg-brand-yellow/20 px-2.5 py-1 text-xs font-bold text-brand-yellow-dark">
                {post.category.name}
              </span>
            )}
            {post.publishedAt && (
              <span className="text-xs text-brand-ink/40">{formatDate(post.publishedAt)}</span>
            )}
          </div>
          <h3 className="mt-1.5 truncate text-lg font-extrabold tracking-tight text-brand-ink group-hover:text-brand-blue sm:text-xl">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-1 line-clamp-1 text-[15px] text-brand-ink/60 sm:line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </div>
        <span className="hidden shrink-0 text-xl text-brand-ink/25 transition-transform group-hover:translate-x-1 group-hover:text-brand-blue sm:block">→</span>
      </Link>
    </motion.div>
  );
}

export default function PostCard({ post }) {
  const image = imageUrl(post.featuredImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="card-shadow group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-ink/[0.06] bg-white transition-all hover:-translate-y-1.5 hover:shadow-xl"
      >
        <div className="aspect-[16/9] w-full overflow-hidden bg-brand-blue/10">
          {image ? (
            <img
              src={image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">🌟</div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-6">
          {post.category && (
            <span className="w-fit rounded-md bg-brand-yellow/20 px-2.5 py-1 text-xs font-bold text-brand-yellow-dark">
              {post.category.name}
            </span>
          )}
          <h3 className="text-xl font-extrabold leading-snug tracking-tight text-brand-ink group-hover:text-brand-blue">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-2 text-[15px] leading-relaxed text-brand-ink/70">{post.excerpt}</p>
          )}
          {post.publishedAt && (
            <span className="mt-auto pt-2 text-xs font-medium text-brand-ink/45">{formatDate(post.publishedAt)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

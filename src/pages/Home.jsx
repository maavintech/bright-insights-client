import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import HeroSlideshow from '../components/HeroSlideshow';
import PostCard, { PostRow } from '../components/PostCard';
import PollWidget from '../components/PollWidget';
import { getCategoryMeta } from '../lib/categoryMeta';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Home() {
  const { layout } = useSiteSettings();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/posts', { params: { limit: layout === 'classifieds' ? 16 : 6 } }),
    ])
      .then(([catRes, postRes]) => {
        setCategories(catRes.data);
        setPosts(postRes.data.posts);
      })
      .finally(() => setLoading(false));
  }, [layout]);

  return (
    <div>
      <HeroSlideshow />

      <div className="border-b border-brand-ink/[0.06] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2.5 px-4 py-5 sm:px-6">
          {categories.map((cat) => {
            const meta = getCategoryMeta(cat.slug);
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex items-center gap-2 rounded-full border border-brand-ink/10 px-4 py-2 text-[15px] font-semibold text-brand-ink/80 transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
              >
                <span>{meta.emoji}</span>
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {layout === 'classifieds' ? (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="space-y-5 lg:w-72 lg:shrink-0">
              <div className="card-shadow rounded-2xl border border-brand-ink/[0.06] bg-white p-6">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/50">
                  Categories
                </h2>
                <ul className="mt-4 space-y-1">
                  {categories.map((cat) => {
                    const meta = getCategoryMeta(cat.slug);
                    return (
                      <li key={cat.id}>
                        <Link
                          to={`/category/${cat.slug}`}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-semibold text-brand-ink/75 transition-colors hover:bg-brand-blue/5 hover:text-brand-blue"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-lg">{meta.emoji}</span>
                            {cat.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to="/blog"
                  className="mt-5 block rounded-full bg-brand-blue px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-brand-blue-dark"
                >
                  Browse All
                </Link>
              </div>

              <PollWidget />
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-5 flex items-end justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight text-brand-ink">Latest Listings</h2>
                <span className="text-sm font-medium text-brand-ink/45">{posts.length} posts</span>
              </div>
              <div className="card-shadow overflow-hidden rounded-2xl border border-brand-ink/[0.06] bg-white">
                {loading ? (
                  <p className="p-6 text-brand-ink/60">Loading…</p>
                ) : posts.length === 0 ? (
                  <p className="p-6 text-brand-ink/60">No posts published yet — check back soon!</p>
                ) : (
                  posts.map((post) => <PostRow key={post.id} post={post} />)
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-ink">
              What We Cover
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => {
                const meta = getCategoryMeta(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="card-shadow flex flex-col gap-2.5 rounded-2xl border border-brand-ink/[0.06] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/10 to-brand-yellow/20 text-2xl">
                      {meta.emoji}
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wide text-brand-blue">
                      {meta.tagline}
                    </span>
                    <span className="text-lg font-extrabold tracking-tight text-brand-ink">{cat.name}</span>
                    {cat.description && (
                      <p className="text-[15px] text-brand-ink/60">{cat.description}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
            <div className="mb-9 flex items-end justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-ink">Latest Insights</h2>
              <Link to="/blog" className="text-sm font-bold text-brand-blue hover:underline">
                View all →
              </Link>
            </div>
            {loading ? (
              <p className="text-brand-ink/60">Loading…</p>
            ) : posts.length === 0 ? (
              <p className="text-brand-ink/60">No posts published yet — check back soon!</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            <PollWidget className="mt-12 mx-auto max-w-xl" />
          </section>
        </>
      )}
    </div>
  );
}

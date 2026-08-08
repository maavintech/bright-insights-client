import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import PostCard, { PostRow } from '../components/PostCard';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Blog() {
  const { layout } = useSiteSettings();
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || '';
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/posts', { params: { limit: 24, category: categorySlug || undefined } })
      .then((res) => setPosts(res.data.posts))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-ink">Blog &amp; Insights</h1>
      <p className="mt-2 text-brand-ink/70">
        Deeper reflections, trending topics, and practical guides across all our pillars.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/blog"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            !categorySlug
              ? 'bg-brand-blue text-white'
              : 'border border-brand-ink/15 text-brand-ink/70 hover:border-brand-blue/40'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/blog?category=${cat.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              categorySlug === cat.slug
                ? 'bg-brand-blue text-white'
                : 'border border-brand-ink/15 text-brand-ink/70 hover:border-brand-blue/40'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-brand-ink/60">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-brand-ink/60">No posts here yet — check back soon!</p>
        ) : layout === 'classifieds' ? (
          <div className="overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-sm">
            {posts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

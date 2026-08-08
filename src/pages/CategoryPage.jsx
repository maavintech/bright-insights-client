import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import PostCard, { PostRow } from '../components/PostCard';
import { getCategoryMeta } from '../lib/categoryMeta';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function CategoryPage() {
  const { layout } = useSiteSettings();
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    Promise.all([
      api.get('/categories'),
      api.get('/posts', { params: { category: slug, limit: 24 } }),
    ])
      .then(([catRes, postRes]) => {
        const match = catRes.data.find((c) => c.slug === slug);
        if (!match) {
          setNotFound(true);
          return;
        }
        setCategory(match);
        setPosts(postRes.data.posts);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="mx-auto max-w-6xl px-4 py-14 text-brand-ink/60 sm:px-6">Loading…</p>;
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-brand-ink">Category not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-brand-blue hover:underline">
          Browse all posts
        </Link>
      </div>
    );
  }

  const meta = getCategoryMeta(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <span className="text-4xl">{meta.emoji}</span>
      <h1 className="mt-3 text-3xl font-extrabold text-brand-ink">{category.name}</h1>
      {category.description && (
        <p className="mt-2 max-w-2xl text-brand-ink/70">{category.description}</p>
      )}

      <div className="mt-8">
        {posts.length === 0 ? (
          <p className="text-brand-ink/60">No posts in this category yet — check back soon!</p>
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

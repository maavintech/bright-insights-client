import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { API_ORIGIN } from '../api/client';
import SearchBar from '../components/SearchBar';
import { getCategoryMeta } from '../lib/categoryMeta';

function imageUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [data, setData] = useState({ posts: [], resources: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setData({ posts: [], resources: [], total: 0 });
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    api
      .get('/search', { params: { q: query } })
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setData({ posts: [], resources: [], total: 0 });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-brand-ink">Search</h1>

      <div className="mt-5">
        <SearchBar variant="inline" />
      </div>

      {query.trim().length >= 2 && (
        <p className="mt-5 text-[15px] text-brand-ink/55">
          {loading
            ? 'Searching…'
            : `${data.total} ${data.total === 1 ? 'result' : 'results'} for “${query}”`}
        </p>
      )}

      {!loading && query.trim().length >= 2 && data.total === 0 && (
        <div className="mt-8 rounded-2xl border border-brand-ink/[0.06] bg-white p-8 text-center">
          <p className="text-brand-ink/60">
            Nothing matched that search. Try a shorter or more general word.
          </p>
          <Link
            to="/blog"
            className="mt-4 inline-block rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark"
          >
            Browse all articles
          </Link>
        </div>
      )}

      {data.posts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/50">
            Articles
          </h2>
          <div className="card-shadow mt-3 overflow-hidden rounded-2xl border border-brand-ink/[0.06] bg-white">
            {data.posts.map((post) => {
              const meta = getCategoryMeta(post.category?.slug);
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="flex gap-4 border-b border-brand-ink/[0.06] p-4 transition-colors last:border-b-0 hover:bg-brand-blue/[0.03]"
                >
                  {post.featuredImage && (
                    <img
                      src={imageUrl(post.featuredImage)}
                      alt=""
                      loading="lazy"
                      className="h-20 w-28 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand-blue">
                      {meta.emoji} {post.category?.name}
                    </span>
                    <h3 className="mt-0.5 font-extrabold leading-snug tracking-tight text-brand-ink">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 text-[14px] text-brand-ink/60">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-1 block text-xs text-brand-ink/40">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {data.resources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/50">
            Downloads
          </h2>
          <div className="card-shadow mt-3 overflow-hidden rounded-2xl border border-brand-ink/[0.06] bg-white">
            {data.resources.map((resource) => (
              <a
                key={resource.id}
                href={`${API_ORIGIN}/api/resources/${resource.slug}/download`}
                className="flex items-center gap-4 border-b border-brand-ink/[0.06] p-4 transition-colors last:border-b-0 hover:bg-brand-blue/[0.03]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/8 text-lg">
                  📄
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-brand-ink">{resource.title}</h3>
                  {resource.description && (
                    <p className="line-clamp-1 text-[14px] text-brand-ink/60">
                      {resource.description}
                    </p>
                  )}
                </div>
                <span className="ml-auto shrink-0 text-sm font-bold text-brand-blue">
                  Download
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

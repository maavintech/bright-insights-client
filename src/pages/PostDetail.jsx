import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_ORIGIN } from '../api/client';

function imageUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/posts/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-14 text-brand-ink/60 sm:px-6">Loading…</p>;
  }

  if (notFound || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-brand-ink">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-brand-blue hover:underline">
          Browse all posts
        </Link>
      </div>
    );
  }

  const image = imageUrl(post.featuredImage);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {post.category && (
        <Link
          to={`/category/${post.category.slug}`}
          className="w-fit rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-semibold text-brand-yellow-dark"
        >
          {post.category.name}
        </Link>
      )}
      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink sm:text-4xl">
        {post.title}
      </h1>
      {post.publishedAt && (
        <p className="mt-3 text-sm text-brand-ink/50">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}
      {image && (
        <img
          src={image}
          alt={post.title}
          className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
        />
      )}
      <div
        className="prose-content mt-8 text-brand-ink"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

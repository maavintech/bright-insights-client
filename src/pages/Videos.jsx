import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import SocialLinks from '../components/SocialLinks';
import { usePublicSettings } from '../context/PublicSettingsContext';

export default function Videos() {
  const { settings } = usePublicSettings();
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/videos')
      .then((res) => setVideos(res.data))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? videos : videos.filter((v) => v.platform === filter)),
    [videos, filter]
  );

  const hasInstagram = videos.some((v) => v.platform === 'instagram');
  const hasYouTube = videos.some((v) => v.platform === 'youtube');

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
            Watch
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-brand-ink/60">
            Short videos and reels covering the same ground as our articles — money, parenting and
            everyday hacks, in a couple of minutes each.
          </p>
        </div>
        <SocialLinks className="shrink-0" />
      </div>

      {hasYouTube && hasInstagram && (
        <div className="mt-7 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', emoji: '🎬' },
            { key: 'youtube', label: 'YouTube', emoji: '▶️' },
            { key: 'instagram', label: 'Instagram', emoji: '📸' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === t.key
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-brand-ink/10 text-brand-ink/70 hover:border-brand-blue/40 hover:text-brand-blue'
              }`}
            >
              <span aria-hidden="true">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-brand-ink/60">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-brand-ink/[0.06] bg-white p-10 text-center">
          <p className="text-brand-ink/60">No videos published yet — check back soon!</p>
          {(settings.social_youtube || settings.social_instagram) && (
            <div className="mt-5 flex justify-center">
              <SocialLinks />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video) => (
            <div
              key={video.id}
              className="card-shadow overflow-hidden rounded-2xl border border-brand-ink/[0.06] bg-white"
            >
              <div className="relative aspect-video bg-brand-ink/5">
                {video.platform === 'youtube' && playing === video.id ? (
                  <iframe
                    // youtube-nocookie avoids setting tracking cookies until the
                    // visitor actually chooses to play something.
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Instagram has no public embeddable player, so those
                      // open on Instagram instead of playing inline.
                      if (video.platform === 'youtube') setPlaying(video.id);
                      else window.open(video.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="group absolute inset-0 h-full w-full"
                    aria-label={`Play ${video.title}`}
                  >
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-blue/10 to-brand-yellow/20 text-4xl">
                        {video.platform === 'instagram' ? '📸' : '▶️'}
                      </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/40">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-brand-ink" aria-hidden="true">
                          <path d="M6 4l14 8-14 8V4Z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                )}
              </div>

              <div className="p-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand-blue">
                  {video.platform === 'instagram' ? '📸 Instagram' : '▶️ YouTube'}
                </span>
                <h2 className="mt-1 font-extrabold leading-snug tracking-tight text-brand-ink">
                  {video.title}
                </h2>
                {video.description && (
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-brand-ink/60">
                    {video.description}
                  </p>
                )}
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-bold text-brand-blue hover:underline"
                >
                  Open on {video.platform === 'instagram' ? 'Instagram' : 'YouTube'} →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

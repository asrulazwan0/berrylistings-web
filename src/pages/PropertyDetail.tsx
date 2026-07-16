import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty } from '../api/client';
import type { Property } from '../api/types';
import PhotoPlaceholder from '../components/PhotoPlaceholder';
import '../styles/property.css';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [contactSent, setContactSent] = useState(false);

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getProperty(id);
      setProperty(res.data);
      setActiveImage(0);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactSent(true);
  }

  // Loading state
  if (loading) {
    return (
      <main id="main" className="container" style={{ paddingBlock: 'var(--space-7)' }}>
        <p style={{ textAlign: 'center', color: 'var(--color-fg-muted)', padding: 'var(--space-8)' }}>
          Loading property…
        </p>
      </main>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <main id="main" className="container" style={{ paddingBlock: 'var(--space-7)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-destructive)' }}>
            {error ? 'Error loading property' : 'Property not found'}
          </h1>
          <p style={{ color: 'var(--color-fg-muted)', marginTop: 'var(--space-3)' }}>
            {error || 'The property you are looking for does not exist.'}
          </p>
          {error && (
            <button
              className="btn btn--ghost btn--sm"
              style={{ marginTop: 'var(--space-4)' }}
              onClick={fetchProperty}
            >
              Try again
            </button>
          )}
          <Link
            className="btn btn--primary"
            style={{ marginTop: 'var(--space-4)', marginLeft: 'var(--space-3)' }}
            to="/listings"
          >
            Browse listings
          </Link>
        </div>
      </main>
    );
  }

  const images = property.photos;
  const mainImage = images.length > 0 ? images[Math.min(activeImage, images.length - 1)] : null;
  const agent = property.agent;

  return (
    <main id="main" className="container" style={{ paddingBlock: 'var(--space-7)' }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/listings">{property.city}</Link>
        <span className="sep">/</span>
        <span>{property.title}</span>
      </nav>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'var(--space-5)',
          marginTop: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span className="badge badge--success">For sale</span>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--space-3)' }}>
            {property.title}
          </h1>
          <p style={{ color: 'var(--color-fg-muted)', marginTop: 'var(--space-1)' }}>
            {property.addressLine}, {property.city}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--color-primary-dark)',
            }}
          >
            {formatPrice(property.price)}
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="gallery">
        <div className="gallery__main">
          {mainImage ? (
            <img
              id="gallery-main"
              src={mainImage.url}
              alt={mainImage.alt || property.title}
              fetchPriority="high"
            />
          ) : (
            <PhotoPlaceholder />
          )}
        </div>
        {images.length > 1 && (
          <div className="gallery__thumbs" aria-label="Property photo gallery">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={img.id}
                type="button"
                aria-label={img.alt || `View photo ${i + 1}`}
                aria-current={activeImage === i ? 'true' : undefined}
                onClick={() => setActiveImage(i)}
              >
                <img src={img.url} alt="" loading="lazy" />
                {i === 3 && images.length > 4 && (
                  <span className="gallery__more">+{images.length - 4} photos</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="layout">
        {/* Main content */}
        <div>
          {/* Stats row */}
          <div className="card stat-row">
            <div>
              <strong>{property.bedrooms}</strong>
              <span>Bedrooms</span>
            </div>
            <div>
              <strong>{property.bathrooms}</strong>
              <span>Bathrooms</span>
            </div>
            <div>
              <strong>{property.sqft.toLocaleString()}</strong>
              <span>Sqft</span>
            </div>
            {property.lotSize != null && (
              <div>
                <strong>{property.lotSize}</strong>
                <span>Acre lot</span>
              </div>
            )}
            {property.yearBuilt != null && (
              <div>
                <strong>{property.yearBuilt}</strong>
                <span>Built</span>
              </div>
            )}
          </div>

          {/* About */}
          <section style={{ marginTop: 'var(--space-7)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)' }}>About this home</h2>
            <p
              style={{
                marginTop: 'var(--space-3)',
                color: 'var(--color-fg-muted)',
                maxWidth: '68ch',
              }}
            >
              {property.description}
            </p>
          </section>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <section style={{ marginTop: 'var(--space-7)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)' }}>Amenities</h2>
              <ul className="amenity-grid">
                {property.amenities.map((amenity) => (
                  <li key={amenity}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Location */}
          <section style={{ marginTop: 'var(--space-7)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)' }}>Location</h2>
            <div className="card map-placeholder" style={{ marginTop: 'var(--space-3)' }}>
              <div className="map-placeholder__pin" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M9 16s5-4.6 5-9A5 5 0 0 0 4 7c0 4.4 5 9 5 9Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="map-placeholder__label">
                <strong>
                  {property.addressLine}, {property.city}
                </strong>
                <br />
                <span style={{ color: 'var(--color-fg-muted)' }}>
                  {property.city} · {property.state} {property.zipCode}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Agent sidebar */}
        <aside className="card agent-card">
          {agent ? (
            <>
              <div className="agent-card__profile">
                <div className="agent-card__avatar">
                  {getInitials(agent?.name ?? agent?.email ?? 'A')}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{agent?.name ?? agent?.email}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
                    Listing agent
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="agent-card__profile">
              <div className="agent-card__avatar">BA</div>
              <div>
                <div style={{ fontWeight: 600 }}>Berry Agent</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
                  Listing agent
                </div>
              </div>
            </div>
          )}

          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-6)',
            }}
            onSubmit={handleContactSubmit}
          >
            <div className="field">
              <label htmlFor="name" className="visually-hidden">
                Your name
              </label>
              <input
                className="input"
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email" className="visually-hidden">
                Email
              </label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="msg" className="visually-hidden">
                Message
              </label>
              <textarea
                className="input"
                id="msg"
                rows={3}
                style={{
                  minHeight: 'auto',
                  paddingBlock: 'var(--space-3)',
                  resize: 'vertical',
                }}
                placeholder="I'd like to schedule a tour of this home."
                defaultValue="I'd like to schedule a tour of this home."
              />
            </div>
            <button
              className="btn btn--primary btn--block"
              type="submit"
              disabled={contactSent}
            >
              {contactSent ? 'Message sent!' : 'Contact agent'}
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}

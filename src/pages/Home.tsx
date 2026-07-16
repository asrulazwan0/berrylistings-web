import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties } from '../api/client';
import type { Property } from '../api/types';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  useEffect(() => {
    getProperties({ limit: '4', status: 'ACTIVE' })
      .then((res) => setFeatured(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchType) params.set('type', searchType);
    if (searchPrice) params.set('maxPrice', searchPrice);
    navigate(`/listings?${params.toString()}`);
  }

  return (
    <main id="main">
      {/* Hero */}
      <section className="section" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">Curated listings, chosen with care</div>
              <h1
                className="text-4xl"
                style={{
                  fontSize: 'var(--text-4xl)',
                  maxWidth: '14ch',
                  marginTop: 'var(--space-4)',
                }}
              >
                Find a home
                <br />
                that feels like you.
              </h1>
              <p
                style={{
                  maxWidth: '48ch',
                  marginTop: 'var(--space-5)',
                  fontSize: 'var(--text-md)',
                  color: 'var(--color-fg-muted)',
                }}
              >
                Beautiful homes, thoughtfully presented, with local agents who
                actually pick up the phone.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-7)',
                  marginTop: 'var(--space-7)',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      color: 'var(--color-primary-dark)',
                    }}
                  >
                    1,240+
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-fg-muted)',
                    }}
                  >
                    Active listings
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      color: 'var(--color-primary-dark)',
                    }}
                  >
                    98%
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-fg-muted)',
                    }}
                  >
                    Client satisfaction
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      color: 'var(--color-primary-dark)',
                    }}
                  >
                    18
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-fg-muted)',
                    }}
                  >
                    Cities covered
                  </div>
                </div>
              </div>
            </div>

            <Link
              className="hero-visual"
              to={featured.length > 0 ? `/property/${featured[0].uuid}` : '#'}
              aria-label={
                featured.length > 0
                  ? `View ${featured[0].title}, listed at $${featured[0].price.toLocaleString()}`
                  : 'View featured property'
              }
            >
              {featured.length > 0 && featured[0].photos.length > 0 ? (
                <img
                  src={featured[0].photos[0].url}
                  alt={featured[0].title}
                  fetchPriority="high"
                />
              ) : (
                <div className="photo-placeholder" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect
                      x="2"
                      y="2"
                      width="24"
                      height="24"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 20l7-7 5 5 4-4 8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              {featured.length > 0 && (
                <div className="hero-visual__note">
                  <div>
                    <strong>{featured[0].title}</strong>
                    <span>
                      {featured[0].city} · {featured[0].bedrooms} bd ·{' '}
                      {featured[0].bathrooms} ba
                    </span>
                  </div>
                  <div className="hero-visual__price">
                    $
                    {new Intl.NumberFormat('en-US').format(
                      featured[0].price,
                    )}
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Search bar */}
          <form
            className="search-bar"
            style={{ marginTop: 'var(--space-7)' }}
            onSubmit={handleSearch}
            aria-label="Search properties"
          >
            <div className="field">
              <label htmlFor="hero-location">Location</label>
              <input
                className="input"
                id="hero-location"
                type="text"
                placeholder="City, neighborhood, or ZIP"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="hero-type">Property type</label>
              <select
                className="select"
                id="hero-type"
                style={{
                  border: 'none',
                  background: 'transparent',
                  paddingInline: 0,
                  minHeight: 32,
                }}
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="">Any type</option>
                <option value="HOUSE">House</option>
                <option value="CONDO">Condo</option>
                <option value="TOWNHOME">Townhome</option>
                <option value="LAND">Land</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="hero-price">Max price</label>
              <select
                className="select"
                id="hero-price"
                style={{
                  border: 'none',
                  background: 'transparent',
                  paddingInline: 0,
                  minHeight: 32,
                }}
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
              >
                <option value="">No max</option>
                <option value="300000">$300,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000+</option>
              </select>
            </div>
            <button className="btn btn--primary" type="submit">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M14 14L11 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured listings */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Fresh on the market</div>
              <h2
                style={{
                  fontSize: 'var(--text-2xl)',
                  marginTop: 'var(--space-3)',
                }}
              >
                Featured properties
              </h2>
            </div>
            <Link className="btn btn--ghost btn--sm" to="/listings">
              View all listings
            </Link>
          </div>

          {loading && (
            <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
              Loading featured properties…
            </p>
          )}

          {error && (
            <p style={{ color: 'var(--color-destructive)', textAlign: 'center', padding: 'var(--space-8)' }}>
              Could not load featured properties. {error}
            </p>
          )}

          {!loading && !error && featured.length === 0 && (
            <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
              No featured properties available yet.
            </p>
          )}

          {!loading && !error && featured.length > 0 && (
            <div className="listing-grid">
              {featured.map((property, i) => (
                <PropertyCard
                  key={property.uuid}
                  property={property}
                  badge="For sale"
                  tone={i + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Berry */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Why Berry</div>
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              marginTop: 'var(--space-3)',
              maxWidth: '24ch',
            }}
          >
            A calmer way to find your next place
          </h2>

          <div
            style={{
              display: 'grid',
              gap: 'var(--space-6)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              marginTop: 'var(--space-7)',
            }}
          >
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                }}
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M18 18l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 600,
                  marginTop: 'var(--space-4)',
                }}
              >
                Curated, not crowded
              </h3>
              <p
                style={{
                  color: 'var(--color-fg-muted)',
                  marginTop: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Every listing is verified and reviewed before it goes live — no
                stale or duplicate posts.
              </p>
            </div>
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                }}
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M4 18v-6l7-6 7 6v6a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 600,
                  marginTop: 'var(--space-4)',
                }}
              >
                Local agents, real answers
              </h3>
              <p
                style={{
                  color: 'var(--color-fg-muted)',
                  marginTop: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Talk to the agent behind the listing directly — no call centers,
                no runaround.
              </p>
            </div>
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                }}
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M11 4v14M4 11h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 600,
                  marginTop: 'var(--space-4)',
                }}
              >
                List in minutes
              </h3>
              <p
                style={{
                  color: 'var(--color-fg-muted)',
                  marginTop: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Agents can publish a new property with photos and pricing in one
                simple flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="container"
        style={{ paddingBottom: 'var(--space-9)' }}
      >
        <div
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-6)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                color: 'inherit',
              }}
            >
              Selling a property?
            </h2>
            <p
              style={{
                marginTop: 'var(--space-2)',
                opacity: 0.85,
                maxWidth: '48ch',
              }}
            >
              List with Berry and reach buyers who are actually ready to move.
            </p>
          </div>
          <Link
            className="btn"
            style={{
              background: 'var(--color-on-primary)',
              color: 'var(--color-primary-dark)',
            }}
            to="/admin"
          >
            Get started
          </Link>
        </div>
      </section>
    </main>
  );
}

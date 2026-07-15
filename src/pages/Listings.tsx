import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../api/client';
import type { Property } from '../api/types';
import PropertyCard from '../components/PropertyCard';
import '../styles/listings.css';

interface Filters {
  location: string;
  propertyType: string;
  sortBy: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  types: string[];
}

const DEFAULT_FILTERS: Filters = {
  location: '',
  propertyType: '',
  sortBy: 'newest',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  bathrooms: '',
  types: [],
};

const ITEMS_PER_PAGE = 9;

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    location: searchParams.get('location') ?? '',
    propertyType: searchParams.get('type') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  }));

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: Record<string, string> = {
      limit: String(ITEMS_PER_PAGE),
      page: String(page),
      status: 'ACTIVE',
    };

    if (filters.location) params.location = filters.location;
    if (filters.propertyType) params.type = filters.propertyType;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters.bathrooms) params.bathrooms = filters.bathrooms;
    if (filters.sortBy && filters.sortBy !== 'newest')
      params.sort = filters.sortBy;

    if (filters.types.length > 0 && filters.types.length < 4) {
      params.types = filters.types.join(',');
    }

    try {
      const res = await getProperties(params);
      setProperties(res.data);
      setTotal(res.meta.total);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType) params.set('type', filters.propertyType);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    setSearchParams(params);
    fetchListings();
  }

  function handleApplyFilters() {
    setFilterPanelOpen(false);
    setPage(1);
    fetchListings();
  }

  function handleClearFilters() {
    setFilters({ ...DEFAULT_FILTERS, location: filters.location });
    setPage(1);
  }

  function toggleType(type: string) {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  }

  function setBedroomsFilter(value: string) {
    setFilters((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms === value ? '' : value,
    }));
  }

  function setBathroomsFilter(value: string) {
    setFilters((prev) => ({
      ...prev,
      bathrooms: prev.bathrooms === value ? '' : value,
    }));
  }

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (filters.bedrooms)
    activeChips.push({
      label: `${filters.bedrooms}+ bd`,
      onRemove: () => setFilters((p) => ({ ...p, bedrooms: '' })),
    });
  if (filters.bathrooms)
    activeChips.push({
      label: `${filters.bathrooms}+ ba`,
      onRemove: () => setFilters((p) => ({ ...p, bathrooms: '' })),
    });
  filters.types.forEach((t) =>
    activeChips.push({
      label:
        t === 'HOUSE'
          ? 'House'
          : t === 'CONDO'
            ? 'Condo'
            : t === 'TOWNHOME'
              ? 'Townhome'
              : 'Land',
      onRemove: () => toggleType(t),
    }),
  );

  return (
    <main id="main" className="container" style={{ paddingBlock: 'var(--space-7)' }}>
      <div className="eyebrow">{total.toLocaleString()} properties</div>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--space-3)' }}>
        Homes for sale{filters.location ? ` near ${filters.location}` : ''}
      </h1>

      {/* Search bar */}
      <form
        className="search-bar"
        style={{ marginTop: 'var(--space-6)' }}
        onSubmit={handleSearch}
      >
        <div className="field">
          <label htmlFor="loc">Location</label>
          <input
            className="input"
            id="loc"
            type="text"
            placeholder="City, neighborhood, or ZIP"
            value={filters.location}
            onChange={(e) =>
              setFilters((p) => ({ ...p, location: e.target.value }))
            }
          />
        </div>
        <div className="field">
          <label htmlFor="type">Property type</label>
          <select
            className="select"
            id="type"
            style={{
              border: 'none',
              background: 'transparent',
              paddingInline: 0,
              minHeight: 32,
            }}
            value={filters.propertyType}
            onChange={(e) =>
              setFilters((p) => ({ ...p, propertyType: e.target.value }))
            }
          >
            <option value="">Any type</option>
            <option value="HOUSE">House</option>
            <option value="CONDO">Condo</option>
            <option value="TOWNHOME">Townhome</option>
            <option value="LAND">Land</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select
            className="select"
            id="sort"
            style={{
              border: 'none',
              background: 'transparent',
              paddingInline: 0,
              minHeight: 32,
            }}
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((p) => ({ ...p, sortBy: e.target.value }))
            }
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
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
          Update
        </button>
      </form>

      {/* Mobile filter toggle */}
      <div className="mobile-results-head">
        <button
          className="btn btn--ghost filter-toggle"
          type="button"
          aria-expanded={filterPanelOpen}
          aria-controls="filters-panel"
          onClick={() => setFilterPanelOpen((o) => !o)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4h12M4 8h8M6 12h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Filters
        </button>
        <p
          style={{
            marginTop: 'var(--space-5)',
            color: 'var(--color-fg-muted)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {total.toLocaleString()} homes match your search
        </p>
      </div>

      <div className="browse" style={{ marginTop: 'var(--space-5)' }}>
        {/* Sidebar filters */}
        <aside
          className={`filters card${filterPanelOpen ? ' is-open' : ''}`}
          id="filters-panel"
          aria-label="Filters"
          tabIndex={-1}
        >
          <div>
            <h3>Price range</h3>
            <div className="range-row">
              <input
                className="input"
                type="number"
                placeholder="Min"
                aria-label="Minimum price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, minPrice: e.target.value }))
                }
              />
              <input
                className="input"
                type="number"
                placeholder="Max"
                aria-label="Maximum price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, maxPrice: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <h3>Bedrooms</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {['2', '3', '4'].map((n) => (
                <button
                  key={n}
                  className="chip"
                  type="button"
                  aria-pressed={filters.bedrooms === n}
                  onClick={() => setBedroomsFilter(n)}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Bathrooms</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {['2', '3'].map((n) => (
                <button
                  key={n}
                  className="chip"
                  type="button"
                  aria-pressed={filters.bathrooms === n}
                  onClick={() => setBathroomsFilter(n)}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Home type</h3>
            {[
              { value: 'HOUSE', label: 'House' },
              { value: 'CONDO', label: 'Condo' },
              { value: 'TOWNHOME', label: 'Townhome' },
              { value: 'LAND', label: 'Land' },
            ].map(({ value, label }) => (
              <label className="checkbox-row" key={value}>
                <input
                  type="checkbox"
                  checked={filters.types.includes(value)}
                  onChange={() => toggleType(value)}
                />{' '}
                {label}
              </label>
            ))}
          </div>

          <button
            className="btn btn--primary btn--block"
            type="button"
            onClick={handleApplyFilters}
          >
            Apply filters
          </button>
          <button
            className="btn btn--ghost btn--block btn--sm"
            type="button"
            onClick={handleClearFilters}
          >
            Clear all
          </button>
        </aside>

        {/* Results */}
        <div>
          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="chip-row">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  className="chip"
                  aria-pressed="true"
                  type="button"
                  onClick={chip.onRemove}
                >
                  {chip.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3l6 6M9 3l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}

          <div className="toolbar">
            <p
              id="results-count"
              style={{
                color: 'var(--color-fg-muted)',
                fontSize: 'var(--text-sm)',
              }}
            >
              {loading
                ? 'Searching…'
                : `Showing ${(page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, total)} of ${total.toLocaleString()} results`}
            </p>
          </div>

          {/* Error state */}
          {error && (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-8)',
                color: 'var(--color-destructive)',
              }}
            >
              <p>Failed to load listings: {error}</p>
              <button
                className="btn btn--ghost btn--sm"
                style={{ marginTop: 'var(--space-4)' }}
                onClick={fetchListings}
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && !error && (
            <p
              style={{
                textAlign: 'center',
                padding: 'var(--space-8)',
                color: 'var(--color-fg-muted)',
              }}
            >
              Loading listings…
            </p>
          )}

          {/* Empty state */}
          {!loading && !error && properties.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                padding: 'var(--space-8)',
                color: 'var(--color-fg-muted)',
              }}
            >
              No properties match your search. Try adjusting your filters.
            </p>
          )}

          {/* Property grid */}
          {!loading && !error && properties.length > 0 && (
            <div className="listing-grid">
              {properties.map((property, i) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  badge="For sale"
                  tone={(i % 4) + 1}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3L4 7l5 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    aria-current={pageNum === page ? 'true' : undefined}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span
                    style={{
                      paddingInline: 'var(--space-1)',
                      color: 'var(--color-fg-subtle)',
                    }}
                  >
                    …
                  </span>
                  <button type="button" onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3l5 4-5 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}

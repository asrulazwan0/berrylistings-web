import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../api/client';
import type { Property, PropertyType } from '../api/types';
import PropertyCard from '../components/PropertyCard';

type SortOption = 'newest' | 'price_asc' | 'price_desc';

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'HOUSE', label: 'House' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOME', label: 'Townhome' },
  { value: 'LAND', label: 'Land' },
];

const AMENITIES_LIST = ['Garage', 'Pool', 'Pet friendly'];

const BEDROOM_OPTS = ['Any', '2+', '3+', '4+'];
const BATHROOM_OPTS = ['Any', '2+', '3+'];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search bar state
  const [location, setLocation] = useState(searchParams.get('location') ?? '');
  const [type, setType] = useState(searchParams.get('type') ?? '');
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) ?? 'newest',
  );

  // Filter state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') ?? 'Any');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') ?? 'Any');
  const [houseType, setHouseType] = useState<Set<PropertyType>>(
    new Set(searchParams.get('type') ? [searchParams.get('type') as PropertyType] : []),
  );
  const [amenities, setAmenities] = useState<string[]>(
    searchParams.get('amenities')?.split(',') ?? [],
  );

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: Record<string, string> = {
      page: String(page),
      limit: '9',
    };

    if (location) params.location = location;
    if (type) params.type = type;
    if (sort !== 'newest') params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (bedrooms !== 'Any') params.bedrooms = bedrooms.replace('+', '');
    if (bathrooms !== 'Any') params.bathrooms = bathrooms.replace('+', '');
    if (amenities.length > 0) params.amenities = amenities.join(',');

    try {
      const res = await getProperties(params);
      setProperties(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [page, location, type, sort, minPrice, maxPrice, bedrooms, bathrooms, amenities]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);

    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (sort !== 'newest') params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms !== 'Any') params.set('bedrooms', bedrooms);
    if (bathrooms !== 'Any') params.set('bathrooms', bathrooms);
    if (amenities.length > 0) params.set('amenities', amenities.join(','));

    setSearchParams(params);
  }

  function handleClearFilters() {
    setLocation('');
    setType('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('Any');
    setBathrooms('Any');
    setHouseType(new Set());
    setAmenities([]);
    setPage(1);
    setSearchParams({});
  }

  const activeFilters: string[] = [];
  if (bedrooms !== 'Any') activeFilters.push(`${bedrooms} bd`);
  houseType.forEach((t) => {
    const found = PROPERTY_TYPES.find((pt) => pt.value === t);
    if (found) activeFilters.push(found.label);
  });
  if (amenities.length > 0) activeFilters.push(...amenities);

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main id="main" className="container" style={{ paddingBlock: 'var(--space-7)' }}>
      <div className="eyebrow">{loading ? '…' : `${total.toLocaleString()} properties`}</div>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--space-3)' }}>
        Homes for sale
        {location ? ` near ${location}` : ''}
      </h1>

      {/* Search bar */}
      <form
        className="search-bar"
        style={{ marginTop: 'var(--space-6)' }}
        onSubmit={handleSearch}
        aria-label="Search properties"
      >
        <div className="field">
          <label htmlFor="loc">Location</label>
          <input
            className="input"
            id="loc"
            type="text"
            placeholder="City, neighborhood, or ZIP"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="type">Property type</label>
          <select
            className="select"
            id="type"
            style={{ border: 'none', background: 'transparent', paddingInline: 0, minHeight: 32 }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select
            className="select"
            id="sort"
            style={{ border: 'none', background: 'transparent', paddingInline: 0, minHeight: 32 }}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
        <button className="btn btn--primary" type="submit">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Update
        </button>
      </form>

      {/* Mobile results head */}
      <div className="mobile-results-head" style={{ marginTop: 'var(--space-5)' }}>
        <button
          className="btn btn--ghost filter-toggle"
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="filters-panel"
          onClick={() => setFiltersOpen((p) => !p)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Filters
        </button>
        {!loading && !error && (
          <p style={{ marginTop: 'var(--space-5)', color: 'var(--color-fg-muted)', fontSize: 'var(--text-sm)' }}>
            {total.toLocaleString()} homes match your search
          </p>
        )}
      </div>

      <div className="browse" style={{ marginTop: 'var(--space-5)' }}>
        {/* Filter sidebar */}
        <aside
          className={`filters card${filtersOpen ? ' is-open' : ''}`}
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
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                className="input"
                type="number"
                placeholder="Max"
                aria-label="Maximum price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3>Bedrooms</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {BEDROOM_OPTS.map((opt) => (
                <button
                  key={opt}
                  className="chip"
                  type="button"
                  aria-pressed={bedrooms === opt}
                  onClick={() => setBedrooms(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Bathrooms</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {BATHROOM_OPTS.map((opt) => (
                <button
                  key={opt}
                  className="chip"
                  type="button"
                  aria-pressed={bathrooms === opt}
                  onClick={() => setBathrooms(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Home type</h3>
            {PROPERTY_TYPES.map((pt) => (
              <label key={pt.value} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={houseType.has(pt.value)}
                  onChange={() => {
                    const next = new Set(houseType);
                    if (next.has(pt.value)) next.delete(pt.value);
                    else next.add(pt.value);
                    setHouseType(next);
                  }}
                />
                {pt.label}
              </label>
            ))}
          </div>

          <div>
            <h3>Amenities</h3>
            {AMENITIES_LIST.map((a) => (
              <label key={a} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={amenities.includes(a)}
                  onChange={() => {
                    setAmenities((prev) =>
                      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
                    );
                  }}
                />
                {a}
              </label>
            ))}
          </div>

          <button className="btn btn--primary btn--block" type="button" onClick={handleSearch}>
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
          {activeFilters.length > 0 && (
            <div className="chip-row">
              {activeFilters.map((f) => (
                <button key={f} className="chip" aria-pressed="true" type="button">
                  {f}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="toolbar">
            {!loading && !error && (
              <p id="results-count" style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-sm)' }}>
                Showing {(page - 1) * 9 + 1}–{Math.min(page * 9, total)} of {total.toLocaleString()} results
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
              Loading listings…
            </p>
          )}

          {/* Error */}
          {error && (
            <p style={{ color: 'var(--color-destructive)', textAlign: 'center', padding: 'var(--space-8)' }}>
              Could not load listings. {error}
            </p>
          )}

          {/* Empty */}
          {!loading && !error && properties.length === 0 && (
            <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
              No properties match your search. Try adjusting your filters.
            </p>
          )}

          {/* Grid */}
          {!loading && !error && properties.length > 0 && (
            <div className="listing-grid">
              {properties.map((property, i) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  badge={property.status === 'ACTIVE' ? 'For sale' : property.status}
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
                onClick={() => goToPage(page - 1)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && page < totalPages - 2 && (
                <span style={{ paddingInline: 'var(--space-1)', color: 'var(--color-fg-subtle)' }}>
                  …
                </span>
              )}

              {totalPages > 5 && (
                <button type="button" onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </button>
              )}

              <button
                type="button"
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}

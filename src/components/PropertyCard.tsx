import { Link } from 'react-router-dom';
import type { Property } from '../api/types';
import { useState, useCallback } from 'react';

interface PropertyCardProps {
  property: Property;
  badge?: string;
  tone?: number;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyCard({
  property,
  badge,
  tone = 1,
}: PropertyCardProps) {
  const [saved, setSaved] = useState(false);
  const toggleSave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSaved((prev) => !prev);
    },
    [],
  );

  const imageUrl =
    property.images.length > 0 ? property.images[0].url : '';
  const imageAlt =
    property.images.length > 0
      ? (property.images[0].alt ?? property.title)
      : property.title;

  return (
    <article className="property-card">
      <Link className="property-card__link" to={`/property/${property.id}`}>
        <div className="property-card__media" data-tone={tone}>
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt} loading="lazy" />
          ) : (
            <div className="photo-placeholder" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <rect
                  x="2"
                  y="2"
                  width="24"
                  height="24"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M2 20l7-7 5 5 4-4 8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {badge && <span className="property-card__badge">{badge}</span>}
        </div>
        <div className="property-card__body">
          <div className="property-card__price">{formatPrice(property.price)}</div>
          <div className="property-card__title">{property.title}</div>
          <div className="property-card__location">
            {property.street}, {property.city}
          </div>
          <div className="property-card__meta">
            <span>{property.bedrooms} bd</span>
            <span>{property.bathrooms} ba</span>
            <span>{property.squareFeet.toLocaleString()} sqft</span>
          </div>
        </div>
      </Link>
      <button
        className="property-card__save"
        type="button"
        aria-label={`Save ${property.title}`}
        aria-pressed={saved}
        data-save
        onClick={toggleSave}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 15.5s-6-3.6-6-8a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 15 7.5c0 4.4-6 8-6 8Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </article>
  );
}

export default function PhotoPlaceholder() {
  return (
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
  );
}

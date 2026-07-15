import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <Link className="brand" to="/">
              <svg
                className="brand__mark"
                viewBox="0 0 34 34"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="13" cy="19" r="7" fill="#7c2d12" />
                <circle cx="21" cy="19" r="7" fill="#a8431c" />
                <path
                  d="M17 11C17 7 19.5 4.5 23 4C21 7 20 9 20 11"
                  stroke="#a16207"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Berry Listings
            </Link>
            <p
              style={{
                marginTop: 'var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-fg-muted)',
                maxWidth: '32ch',
              }}
            >
              A warmer way to browse, buy, and sell property — built for agents
              who answer their phone.
            </p>
          </div>
          <div className="footer__col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/listings">Buy</Link>
              </li>
              <li>
                <Link to="/listings">Rent</Link>
              </li>
              <li>
                <a href="#">Sell with Berry</a>
              </li>
              <li>
                <a href="#">New developments</a>
              </li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Agents</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Account</h4>
            <ul>
              <li>
                <Link to="/login">Sign in</Link>
              </li>
              <li>
                <Link to="/admin">Agent dashboard</Link>
              </li>
              <li>
                <a href="#">Help center</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Berry Listings. All rights reserved.</span>
          <span>Made for people, not portals.</span>
        </div>
      </div>
    </footer>
  );
}

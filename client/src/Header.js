import { Link } from 'react-router-dom';

import './Header.css';

export default function Header() {
  return (
    <header className="Header">
      <nav>
        <ul>
          <li>
            <Link to="/">Ravel</Link>
          </li>
          <li>
            <Link to="/track">Track</Link>
          </li>
          <li>
            <Link to="/api-test">API Test</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
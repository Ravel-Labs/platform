import { Link } from 'react-router-dom';

import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.Header}>
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
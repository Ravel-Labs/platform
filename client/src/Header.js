import axios from 'axios';
import { Link } from 'react-router-dom';
import { useContext } from 'react';

import { UserContext } from './Context';

import styles from './Header.module.css';

const links = [
  {label: 'Ravel', path: '/'},
  {label: 'Track', path: '/track/testSlug'},
  {label: 'Login', path: '/login', anonymousOnly: true},
  {label: 'Signup', path: '/signup', anonymousOnly: true},
  {label: 'Profile', path: '/username123', loggedInOnly: true},
  {label: 'Upload', path: '/upload', loggedInOnly: true},
  {label: 'API Test', path: '/debug'},
]

export default function Header() {
  const { user, onUpdateUser } = useContext(UserContext)

  const onClickLogout = async () => {
    onUpdateUser(null);
    await axios.post("/api/auth/logout");
  }

  const isUserLoggedIn = Boolean(user);

  return (
    <header className={styles.Header}>
      <nav>
        <ul>
          {links.map((link) => {
            if (!isUserLoggedIn && link.loggedInOnly) {
              return null
            }
            if (isUserLoggedIn && link.anonymousOnly) {
              return null
            }
            return (
              <li key={link.label}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            )
          })}
          {isUserLoggedIn && (
            <>
              <li>
                <strong>{user.email}</strong>
              </li>
              <li>
                <button onClick={onClickLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}
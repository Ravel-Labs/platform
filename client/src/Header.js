import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import { UserContext } from './Context';

import styles from './Header.module.css';

const links = [
  {label: 'Ravel', path: '/'},
  {label: 'Track', path: '/track/testSlug'},
  {label: 'Login', path: '/login', anonymousOnly: true},
  {label: 'Signup', path: '/signup', anonymousOnly: true},
  {label: 'Profile', path: '/username123', loggedInOnly: true},
  {label: 'Upload', path: '/upload', loggedInOnly: true},
  {label: 'API Test', path: '/debug', devOnly: true},
]

function DevToolToggle({ isEnabled, onClick }) {
  return (
    <button onClick={onClick}>{isEnabled ? "Disable" : "Enable"} Dev Tools</button>
  )
}

export default function Header() {
  const [isDevEnabled, setIsDevEnabled] = useState(true)
  const { user, onUpdateUser } = useContext(UserContext)
  const onClickDevtools = (e) => {
    e.preventDefault()
    setIsDevEnabled((prevIsEnabled) => {
      return !prevIsEnabled
    })
  }

  const onClickLogout = () => {
    onUpdateUser(null)
  }

  const isUserLoggedIn = Boolean(user?.username);

  return (
    <header className={styles.Header}>
      <nav>
        <ul>
          {links.map((link) => {
            const canRenderDev = !link.devOnly || isDevEnabled;
            if (!canRenderDev) {
              return null
            }
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
          {/* TODO: Only show to logged in superusers */}
          <li>
            <DevToolToggle onClick={onClickDevtools} isEnabled={isDevEnabled} />
          </li>
          {isUserLoggedIn && (
            <li>
              <button onClick={onClickLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
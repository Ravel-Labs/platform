import { Link } from 'react-router-dom';
import { useState } from 'react';

import styles from './Header.module.css';

const links = [
  {label: 'Ravel', path: '/'},
  {label: 'Track', path: '/track/testSlug'},
  {label: 'Login', path: '/login'},
  {label: 'Signup', path: '/signup'},
  {label: 'Profile', path: '/username123'},
  {label: 'Upload', path: '/upload'},
  {label: 'API Test', path: '/api-test', devOnly: true},
]

function DevToolToggle({ isEnabled, onClick }) {
  return (
    <button onClick={onClick}>{isEnabled ? "Disable" : "Enable"} Dev Tools</button>
  )
}

export default function Header() {
  const [isDevEnabled, setIsDevEnabled] = useState(true)
  const onClickDevtools = (e) => {
    e.preventDefault()
    setIsDevEnabled((prevIsEnabled) => {
      return !prevIsEnabled
    })
  }

  return (
    <header className={styles.Header}>
      <nav>
        <ul>
          {links.map((link) => {
            if (!link.devOnly || isDevEnabled) {
              return (
                <li key={link.label}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              )
            }
            return null
          })}
          {/* TODO: Only show to logged in superusers */}
          <li>
            <DevToolToggle onClick={onClickDevtools} isEnabled={isDevEnabled} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
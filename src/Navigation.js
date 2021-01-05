import { useEffect, useState } from 'react'

import { Card } from 'primereact/card'
import { NavLink } from 'react-router-dom'
import { TabMenu } from 'primereact/tabmenu'

export const Links = [
  { label: 'Standings', to: '/standings' },
  { label: 'Transactions', to: '/transactions' }
]

const Navigation = () => {
  const [path, setPath] = useState('/standings')

  useEffect(() => {
    if (!!location.hash) {
      setPath(location.hash.substr(1))
    }
  }, [])

  const NavLinks = Links.map((l) => {
    return (
      <li
        className={`p-tabmenuitem ${l.to == path ? 'p-highlight' : ''}`}
        key={l.to}
      >
        <NavLink
          to={l.to}
          className="p-menuitem-link"
          onClick={(e) => setPath(l.to)}
        >
          {l.label}
        </NavLink>
      </li>
    )
  })

  return (
    <div
      className="p-card p-d-flex"
      style={{ borderRadius: 0, padding: '10px' }}
    >
      <div className="logo">
        <span>Fantasy Dutchmen</span>
      </div>
      <div className="p-tabmenu p-component" style={{ flex: 1 }}>
        <ul className="p-tabmenu-nav p-reset">{NavLinks}</ul>
      </div>
    </div>
  )
}

export default Navigation

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header-title-container">
        <NavLink to="/dashboard" className="header-title-link">
          <h1 className="header-title">Stevens Fit</h1>
        </NavLink>
        <p className="header-subtext">The Ultimate Fitness App for Stevens Students</p>
      </div>
      <nav className="header-nav">
        <ul className="nav-links d-flex flex-column flex-md-row align-items-center justify-content-md-between">
          <li>
            <NavLink to="/dashboard" activeClassName="active">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/exercise-catalog" activeClassName="active">
              Exercise Catalog
            </NavLink>
          </li>
          <li>
            <NavLink to="/workout-catalog" activeClassName="active">
              Workout Catalog
            </NavLink>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

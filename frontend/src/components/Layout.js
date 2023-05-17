import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeader = ['/', '/login'];

  return (
    <>
      {!hideHeader.includes(location.pathname) && <Header />}
      <div className="app">{children}</div>
    </>
  );
};

export default Layout;

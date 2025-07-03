import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FooterNav } from '../FooterNav/FooterNav';

export const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <main className="main-content pb-24">
        <Outlet />
      </main>
      <FooterNav navigate={navigate} />
    </div>
  );
}; 
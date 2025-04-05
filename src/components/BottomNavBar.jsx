import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaUserAlt, FaUserFriends } from 'react-icons/fa';

export default function BottomNavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/explore', icon: FaCompass, label: 'Explore' },
    { path: '/profile', icon: FaUserAlt, label: 'Profile' },
    { path: '/friends', icon: FaUserFriends, label: 'Friends' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = path === '/profile' 
            ? location.pathname === '/profile' || location.pathname === '/profile/edit'
            : location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center w-full h-full text-xs ${
                isActive ? 'text-black' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
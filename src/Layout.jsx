import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/organisms/SearchBar';
import { routes, routeArray } from '@/config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 flex-shrink-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <ApperIcon name="CheckSquare" size={24} />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-surface-900">TaskFlow Pro</h1>
                  <p className="text-xs text-surface-500">Project Management</p>
                </div>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <SearchBar className="w-full" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Menu & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-surface-900">John Doe</div>
                  <div className="text-xs text-surface-500">Project Manager</div>
                </div>
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">JD</span>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md text-surface-400 hover:text-surface-500 hover:bg-surface-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile/Tablet */}
          <div className="lg:hidden pb-3">
            <SearchBar className="w-full" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-surface-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {routeArray.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={20} />
                    <span>{route.label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Mobile User Profile */}
              <div className="border-t border-surface-200 pt-4 pb-3">
                <div className="flex items-center px-5">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">JD</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-surface-900">John Doe</div>
                    <div className="text-sm text-surface-500">Project Manager</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden bg-surface-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
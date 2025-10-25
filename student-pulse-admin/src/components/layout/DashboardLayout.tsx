import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  FileText,
  Bell,
  Settings,
  FolderOpen,
  ChevronDown
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { institution, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Overview', path: '/dashboard', icon: Calendar },
    { name: 'Students', path: '/dashboard/students', icon: User },
    { name: 'RFID Logs', path: '/dashboard/logs', icon: FileText },
    { name: 'RFID Settings', path: '/dashboard/rfid-settings', icon: Settings },
    { name: 'Plan & Billing', path: '/dashboard/plan', icon: Bell },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const categories = [
    { name: 'Primary', path: '/dashboard/categories/primary' },
    { name: 'Secondary', path: '/dashboard/categories/secondary' },
    { name: 'TSS', path: '/dashboard/categories/tss' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CSM Dashboard
              </h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
            
            {/* Categories with submenu */}
            <li>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith('/dashboard/categories')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <FolderOpen size={20} className="mr-3" />
                  {!sidebarCollapsed && <span className="font-medium">Categories</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      categoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              
              {/* Submenu */}
              {categoriesOpen && !sidebarCollapsed && (
                <ul className="ml-8 mt-2 space-y-1">
                  {categories.map((category) => {
                    const active = isActivePath(category.path);
                    return (
                      <li key={category.path}>
                        <Link
                          to={category.path}
                          className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            active
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Institution info and logout */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">{institution?.name}</p>
              <p className="text-xs text-gray-500">{institution?.email}</p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                institution?.plan === 'pro' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {institution?.plan?.toUpperCase()} Plan
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={20} className="mr-3" />
            {!sidebarCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {navigationItems.find(item => isActivePath(item.path))?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back, {institution?.name}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

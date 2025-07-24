import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Repeat,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { logout } from '@/redux/features/user/userSlice';
import { useDispatch } from 'react-redux';

const navigation = [
  { name: 'Dashboard', href: '/home/dashboard', icon: LayoutDashboard },
  { name: 'Groups', href: '/home/groups', icon: Users },
  { name: 'Expenses', href: '/home/expenses', icon: DollarSign },
  // { name: 'Settlements', href: '/home/settlements', icon: Repeat },
  { name: 'History', href: '/home/history', icon: FileText },
  // { name: 'Settings', href: '/home/settings', icon: Settings },
];

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close mobile menu when resizing up
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when menu open on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const handleLogout = () => {
      dispatch(logout());
      navigate('/auth/login');
    };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen((o) => !o)}
      >
        {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r shadow-lg transform transition-transform duration-200 ease-in-out flex flex-col lg:translate-x-0 lg:fixed',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          
        )}
      >
        <div className="h-16 flex items-center px-6 bg-gradient-to-r from-indigo-600 to-teal-400">
          <span className="text-xl font-bold text-white">BudgetSplit</span>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-4 py-4">
          <button
          onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

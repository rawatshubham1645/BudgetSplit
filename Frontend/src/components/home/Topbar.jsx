import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '@/redux/features/user/userSlice';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Sun, Moon, ChevronDown, LogOut } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import AddExpense from './dashboard/AddExpense';

export default function Topbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Left: App Title */}
        <div className="flex items-center space-x-2 ml-7">
          <span className="text-xl font-bold text-indigo-600 lg:hidden">BudgetSplit</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Create Expense Button */}
          <AddExpense />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                  <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.firstName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => navigate('/home/profile')}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt={user?.firstName} className="h-5 w-5 rounded-full" />
                  <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

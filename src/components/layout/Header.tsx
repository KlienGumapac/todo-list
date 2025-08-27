import React from 'react';
import type { User } from '../../types';
import Button from '../ui/Button';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Todo App
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.name}</span>
              <span className="mx-2">•</span>
              <span>{user?.email}</span>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 mr-2" />
            <span className="text-lg font-bold">FarmGuard</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-green-100">
              &copy; {year} FarmGuard. All rights reserved.
            </p>
            <p className="text-xs text-green-200 mt-1">
              Protecting your farm with advanced AI technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
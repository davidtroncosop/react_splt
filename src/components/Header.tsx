import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Receipt size={24} />
          <span className="text-xl font-bold">Bill Splitter</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/upload" className="hover:text-blue-200">Upload Bill</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
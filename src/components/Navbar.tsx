import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Handle the logout logic here if needed (e.g., clearing tokens)
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md text-black' : 'bg-transparent text-black'
      }`}
    >
      <div className="flex items-center justify-start w-1/4">
        <div className="text-xl font-bold cursor-pointer" onClick={handleNavigateHome}>
          HireAI
        </div>
      </div>
      <div className="flex-1 flex justify-center space-x-8">
        <span className="cursor-pointer hover:text-blue-600 transition-colors duration-300" onClick={handleNavigateHome}>Home</span>
        <span className="cursor-pointer hover:text-blue-600 transition-colors duration-300" onClick={handleNavigateHome}>About</span>
        <span className="cursor-pointer hover:text-blue-600 transition-colors duration-300" onClick={handleNavigateHome}>Contact Us</span>
      </div>
      <div className="flex items-center justify-end w-1/4">
        <div className="cursor-pointer hover:text-red-600 transition-colors duration-300" onClick={handleLogout}>
          <MdLogout size={24} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile, CgLogOut } from "react-icons/cg";

interface NavbarProps {
    username?: string;
    handleLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, handleLogout }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-transparent text-white fixed w-full top-0 left-0 z-10">
            <div className="container mx-auto flex justify-between items-center py-4 px-8">
                <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                    HireTalk
                </div>

                <nav className="space-x-8">
                    <button onClick={() => navigate('/')} className="hover:text-gray-400 transition duration-300 ease-in-out">Home</button>
                    <button onClick={() => navigate('/about')} className="hover:text-gray-400 transition duration-300 ease-in-out">About</button>
                    <button onClick={() => navigate('/contact')} className="hover:text-gray-400 transition duration-300 ease-in-out">Contact Us</button>
                </nav>

                {username && (
                    <div className="flex items-center space-x-4">
                        <button onClick={handleLogout} className="text-gray-400 hover:text-gray-300 transition duration-300 ease-in-out">
                            <CgLogOut size={24} />
                        </button>
                        <div className="flex items-center space-x-2">
                            <CgProfile size={24} />
                            <span>{username}</span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, History, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: null },
    { href: '/genre', label: 'Genres', icon: BookOpen },
    { href: '/schedule', label: 'Schedule', icon: Clock },
    { href: '/ongoing', label: 'Ongoing', icon: Clock },
    { href: '/complete', label: 'Complete', icon: CheckCircle },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity z-50">
          <span className="text-xl font-bold tracking-tighter">ANIME<span className="text-white">KITO</span></span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
           {navLinks.map((link) => (
             <Link 
               key={link.href} 
               href={link.href} 
               className={`hover:text-primary transition-colors ${
                 pathname === link.href ? 'text-primary' : ''
               }`}
             >
               {link.label}
             </Link>
           ))}
        </div>

        {/* Actions (Search + Mobile Menu Toggle) */}
        <div className="flex items-center space-x-4 z-50">
            <Link 
              href="/search" 
              className="p-2 text-gray-300 hover:text-primary hover:bg-white/5 rounded-full transition-colors"
              aria-label="Search"
            >
                <Search size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div className="fixed top-16 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 z-40 md:hidden animate-in slide-in-from-top-5 duration-200">
              <div className="flex flex-col p-4 space-y-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-4 p-4 rounded-lg text-lg font-medium transition-all ${
                        pathname === link.href 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-gray-200 bg-white/10 hover:bg-white/15'
                      }`}
                    >
                      {Icon && <Icon size={20} />}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Optional footer */}
              <div className="p-4 mt-4 border-t border-white/10">
                <p className="text-center text-sm text-gray-400">AnimeKito v1.0</p>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
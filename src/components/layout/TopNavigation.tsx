'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { useApiStatus } from '@/hooks/useApiStatus';

interface TopNavigationProps {
  onOpenModal: () => void;
}

export default function TopNavigation({ onOpenModal }: TopNavigationProps) {
  const { status: apiStatus } = useApiStatus();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'servicios', 'portfolio', 'contacto'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'online': return 'API Conectada';
      case 'offline': return 'API Desconectada';
      default: return 'Verificando...';
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contacto', label: 'Contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-omega-500 to-omega-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Ω</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OmegaElectronics</h1>
              <p className="text-sm text-gray-500">Sistema de Gestión de Taller</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-omega-600 bg-omega-50'
                    : 'text-gray-600 hover:text-omega-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* API Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <span className="text-sm text-gray-600 hidden sm:block">{getStatusText()}</span>
            </div>

            {/* Test Modal Button */}
            <button
              onClick={onOpenModal}
              className="px-3 py-2 text-sm font-medium text-omega-600 hover:text-omega-700 hover:bg-omega-50 rounded-md transition-colors"
            >
              Test Modal
            </button>

            {/* Dashboard Button */}
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-omega-500 to-blue-600 text-white rounded-lg font-semibold hover:from-omega-600 hover:to-blue-700 transition-all shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                menu?.classList.toggle('hidden');
              }}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                  activeSection === item.id
                    ? 'text-omega-600 bg-omega-50'
                    : 'text-gray-600 hover:text-omega-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onOpenModal}
              className="px-3 py-2 text-sm font-medium text-omega-600 hover:text-omega-700 hover:bg-omega-50 rounded-md transition-colors text-left"
            >
              Test Modal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 
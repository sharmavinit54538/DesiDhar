import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/common/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Spilled Away | DesiDhar</title>
      </Helmet>

      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 shadow-soft text-center space-y-5">
          {/* Spilled Matka SVG */}
          <div className="w-24 h-24 mx-auto flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="50" r="45" fill="#FFF8EC" stroke="#F59E0B" strokeWidth="2" />
              {/* Tilted matka */}
              <g transform="rotate(-30 50 50)">
                <ellipse cx="50" cy="30" rx="14" ry="4" fill="#4A2C17" />
                <path d="M40 30 C40 40 25 48 25 64 C25 78 36 82 50 82 C64 82 75 78 75 64 C75 48 60 40 60 30 Z" fill="#D97706" />
                <path d="M50 30 Q60 50 80 55" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              </g>
              <ellipse cx="70" cy="72" rx="16" ry="6" fill="#FFFFFF" stroke="#E5D5C0" strokeWidth="1" />
            </svg>
          </div>

          <div>
            <span className="text-4xl sm:text-5xl font-black font-heading text-amber-500">
              404
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-[#4A2C17] mt-1">
              Don&apos;t Cry Over Spilt Milk!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
              The page you are looking for has spilled away or never existed. Let&apos;s get you back to the fresh dairy marketplace.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="md"
                className="w-full sm:w-auto"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Back to Home
              </Button>
            </Link>

            <Link to="/category/all" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Browse All Dairy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

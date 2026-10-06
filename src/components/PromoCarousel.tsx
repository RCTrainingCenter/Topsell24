import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerSlide } from '../types';
import { BANNERS } from '../data';

interface PromoCarouselProps {
  tabId: string;
  slides?: BannerSlide[];
  onActionClick?: (actionUrl?: string) => void;
  onNavigateUrl?: (actionUrl: string) => void;
  actionLabel?: string;
  className?: string;
}

export default function PromoCarousel({
  tabId,
  slides: propSlides,
  onActionClick,
  onNavigateUrl,
  actionLabel,
  className = ''
}: PromoCarouselProps) {
  const fallbackSlides = BANNERS[tabId] || [];
  const slides = propSlides || fallbackSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Reset index when tab changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [tabId]);

  // Interval hook for automatic slider banner transitions
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const activeSlide = slides[currentSlideIndex];

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSlideClick = () => {
    const targetUrl = activeSlide?.actionUrl;
    if (targetUrl) {
      if (onNavigateUrl) {
        onNavigateUrl(targetUrl);
        return;
      }
      if (onActionClick) {
        onActionClick(targetUrl);
        return;
      }
    }
    if (onActionClick) {
      onActionClick();
    }
  };

  const isClickable = Boolean(onActionClick || onNavigateUrl || activeSlide?.actionUrl);

  return (
    <div 
      className={`w-full rounded-xl overflow-hidden relative border border-slate-200/80 shadow-xs group aspect-[2.4/1] xs:aspect-[2.7/1] sm:aspect-[2.9/1] md:aspect-auto min-h-[135px] sm:min-h-[190px] md:min-h-[260px] flex items-stretch ${className}`}
    >
      {activeSlide && (
        <div 
          onClick={handleSlideClick}
          className={`w-full bg-gradient-to-r ${activeSlide.bgColor || 'from-sky-800 to-indigo-900'} flex flex-col justify-center text-white relative transition-all duration-700 ease-in-out overflow-hidden ${isClickable ? 'cursor-pointer' : ''}`}
        >
          {/* Full Slide High-Resolution Background Image */}
          {activeSlide.imageUrl ? (
            <img 
              src={activeSlide.imageUrl} 
              alt={activeSlide.title || 'Promo Banner'} 
              className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ 
                imageRendering: '-webkit-optimize-contrast',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
            />
          ) : (
            /* Fallback gradient and text details only when no image */
            <div className="p-6 sm:p-10 flex flex-col justify-center relative z-10 max-w-xl text-left my-auto">
              <div className="mb-3">
                <span className="bg-amber-400 text-slate-950 font-sans font-black text-[10px] uppercase px-2.5 py-1 rounded tracking-wider shadow-sm">
                  {activeSlide.badge || 'PROMOTIONS'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-sans font-extrabold leading-tight tracking-tight text-white">
                {activeSlide.title}
              </h1>
              {activeSlide.subtitle && (
                <p className="text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed max-w-md mt-2">
                  {activeSlide.subtitle}
                </p>
              )}
              {isClickable && (
                <div className="pt-3 flex justify-start">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlideClick();
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm py-2 px-5 rounded-lg shadow-sm transition-all transform hover:scale-105 cursor-pointer"
                  >
                    {actionLabel || 'অফারটি গ্রহণ করুন ⚡'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Slider Controls */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full cursor-pointer shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full cursor-pointer shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(idx);
                }}
                className={`w-2.5 h-1.5 rounded-full transition-all ${
                  currentSlideIndex === idx ? 'bg-amber-400 w-5' : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

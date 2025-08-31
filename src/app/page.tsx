'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../hooks/useBlockchain';

export default function HomePage() {
  const { isConnected, account } = useBlockchain();
  const statsRef = useRef(null);
  const categoriesRef = useRef(null);
  const [projectsCompleted, setProjectsCompleted] = useState(0);
  const [raisedToDate, setRaisedToDate] = useState(0);
  const [partnerFundings, setPartnerFundings] = useState(0);
  const [happyCustomers, setHappyCustomers] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [categoriesAnimated, setCategoriesAnimated] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [whyChooseAnimated, setWhyChooseAnimated] = useState(false);
  
  const fullText = "Raising Money Has Never Been So Easy";

  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startCounting();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    const categoriesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !categoriesAnimated) {
            setCategoriesAnimated(true);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    const whyChooseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !whyChooseAnimated) {
            setWhyChooseAnimated(true);
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    if (categoriesRef.current) {
      categoriesObserver.observe(categoriesRef.current);
    }

    // Observe why choose section
    const whyChooseSection = document.getElementById('why-choose-section');
    if (whyChooseSection) {
      whyChooseObserver.observe(whyChooseSection);
    }

    return () => {
      if (statsRef.current) {
        statsObserver.unobserve(statsRef.current);
      }
      if (categoriesRef.current) {
        categoriesObserver.unobserve(categoriesRef.current);
      }
      if (whyChooseSection) {
        whyChooseObserver.unobserve(whyChooseSection);
      }
    };
  }, [hasAnimated, categoriesAnimated, whyChooseAnimated]);

  // Scroll event listener for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter effect for heading
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100); // Speed of typing

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, fullText.length]);

  const startCounting = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    let currentStep = 0;

    const animateCount = () => {
      if (currentStep <= steps) {
        const progress = currentStep / steps;
        const easedProgress = easeOutQuart(progress);

        setProjectsCompleted(Math.round(easedProgress * 690));
        setRaisedToDate(Math.round(easedProgress * 808));
        setPartnerFundings(Math.round(easedProgress * 560));
        setHappyCustomers(Math.round(easedProgress * 990));

        currentStep++;
        setTimeout(animateCount, duration / steps);
      }
    };
    animateCount();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 1s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay-1 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
        }
        
                 .animate-float-delay-2 {
           animation: float 6s ease-in-out infinite;
           animation-delay: 2s;
         }
         
         @keyframes blink {
           0%, 50% {
             opacity: 1;
           }
           51%, 100% {
             opacity: 0;
           }
         }
         
         .typewriter-cursor {
           animation: blink 1s infinite;
         }
       `}</style>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-teal-500">
                  <ShieldCheckIcon className="h-5 w-5 text-white" />
                </span>
                ClearFund
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {/* Explore Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/campaigns" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Browse Campaigns
                    </Link>
                    <Link href="/campaigns" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Featured Projects
                    </Link>
                    <Link href="/campaigns" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Categories
                    </Link>
                  </div>
                </div>
              </div>
              
                             {/* Events Dropdown */}
               <div className="relative group">
                 <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                   Events
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <div className="py-2">
                     <Link href="/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       All Events
                     </Link>
                     <Link href="/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Upcoming Events
                     </Link>
                     <Link href="/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Past Events
                     </Link>
                   </div>
                 </div>
               </div>
              
                             {/* Pages Dropdown */}
               <div className="relative group">
                 <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                   Pages
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <div className="py-2">
                     <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Company Overview
                     </Link>
                     <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Our Team
                     </Link>
                     <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Our Values
                     </Link>
                   </div>
                 </div>
               </div>
              
                             {/* News Dropdown */}
               <div className="relative group">
                 <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                   News
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <div className="py-2">
                     <Link href="/news" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Latest News
                     </Link>
                     <Link href="/news" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Industry Updates
                     </Link>
                     <Link href="/news" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Success Stories
                     </Link>
                   </div>
                 </div>
               </div>
              
                             {/* Contact Dropdown */}
               <div className="relative group">
                 <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                   Contact
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <div className="py-2">
                     <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Contact Us
                     </Link>
                     <Link href="/support" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Support Center
                     </Link>
                     <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                       Location
                     </Link>
                   </div>
                 </div>
               </div>
               
               {/* Support Link */}
               <Link href="/support" className="text-gray-700 hover:text-blue-600 font-medium">
                 Support
               </Link>
            </div>
                         <div className="flex items-center space-x-4">
               {isConnected ? (
                 <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium">
                   <UserCircleIcon className="h-6 w-6" />
                   <span>Dashboard</span>
                 </Link>
               ) : (
                 <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                   Sign in
                 </Link>
               )}
               <Link href="/create-campaign" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                 Create A Project
               </Link>
             </div>
          </div>
        </div>
      </nav>

             {/* Hero Section with Background Image */}
       <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
         {/* Background Image with Parallax */}
         <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
             alt="Hero Background"
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
         </div>
         
         {/* Floating Elements */}
         <div className="absolute inset-0 z-10">
           {/* Floating circles */}
           <div className="absolute top-20 left-20 w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
           <div className="absolute top-40 right-32 w-16 h-16 bg-purple-500/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
           <div className="absolute bottom-32 left-32 w-24 h-24 bg-teal-500/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
           <div className="absolute bottom-20 right-20 w-12 h-12 bg-pink-500/20 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
           
           {/* Floating lines */}
           <div className="absolute top-1/4 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45"></div>
           <div className="absolute bottom-1/4 right-1/4 w-24 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -rotate-45"></div>
         </div>
         
                   {/* Main Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight mt-20">
                {displayText}
                {isTyping && <span className="typewriter-cursor">|</span>}
              </h1>
             <p className="text-2xl md:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
               We help surface innovations in tech, design, and creative projects. 
               Join thousands of creators and backers in bringing amazing ideas to life.
             </p>
             <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
               <Link href="/create-campaign" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-full text-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-flex items-center shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105">
                 Start a Project
                 <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
               </Link>
               <button className="group bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-full text-xl font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-300 inline-flex items-center shadow-2xl transform hover:scale-105">
                 <PlayIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                 Watch Demo
               </button>
             </div>
           </div>
         </div>
         
         {/* Scroll Indicator */}
         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
           <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
             <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
           </div>
         </div>
       </section>

             {/* Top Categories Section - Enhanced with Background */}
       <section ref={categoriesRef} className="py-24 bg-white relative overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-5">
           <div className="absolute inset-0" style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}></div>
         </div>
         
         <div className="w-full relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
             {/* Left Section - Purple Background with Content */}
             <div className="lg:col-span-2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white p-12 lg:p-16 relative overflow-hidden">
               {/* Background Image Overlay */}
               <div className="absolute inset-0 opacity-10">
                 <img 
                   src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
                   alt="Background"
                   className="w-full h-full object-cover"
                 />
               </div>
               
               {/* Floating Elements */}
               <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
               <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-float-delay-1"></div>
               <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-float-delay-2"></div>
               
               {/* Decorative wavy lines */}
               <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                   <path d="M0,50 Q25,25 50,50 T100,50" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
                   <path d="M0,60 Q25,35 50,60 T100,60" stroke="white" strokeWidth="2" fill="none" opacity="0.2"/>
                 </svg>
               </div>
               
                               {/* Sub-heading with green square */}
                <div 
                  className={`flex items-center mb-6 transition-all duration-1000 ${
                    categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <div className="w-4 h-4 bg-green-400 rounded mr-3"></div>
                  <span className="text-green-300 text-lg font-medium">Which Category Interests You</span>
        </div>
                
                {/* Main heading */}
                <h2 
                  className={`text-5xl lg:text-6xl font-bold mb-8 leading-tight transition-all duration-1000 ${
                    categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  Top Categories
                </h2>
               
                                                {/* Description paragraphs */}
                 <div 
                   className={`space-y-4 mb-12 transition-all duration-1000 ${
                     categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                   }`}
                   style={{ transitionDelay: '600ms' }}
                 >
                   <p className="text-purple-100 text-lg leading-relaxed">
                     Explore a diverse range of projects and initiatives, carefully categorized to help you find causes that resonate with your passions and values. From cutting-edge technology to impactful social ventures, discover opportunities that align with your interests.
                   </p>
                   <p className="text-purple-100 text-lg leading-relaxed">
                     Whether you&apos;re passionate about education, healthcare, environmental conservation, or creative arts, our platform connects you with meaningful projects that make a real difference in communities worldwide.
                   </p>
                 </div>
               
                               {/* Testimonial/Profile */}
                <div 
                  className={`flex items-center transition-all duration-1000 ${
                    categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: '800ms' }}
                >
                  {/* Vertical green bar */}
                  <div className="w-1 h-10 bg-green-400 rounded-full mr-4"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face" 
                    alt="Christine Eve"
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="text-green-300 text-lg font-medium">Christine Eve</p>
                    <p className="text-purple-200 text-sm">Verified User</p>
                  </div>
                </div>
               
               
             </div>
             
             {/* Right Section - Category Grid */}
             <div className="lg:col-span-1 bg-purple-600 p-8 lg:p-12">
               <div className="grid grid-cols-1 gap-4 h-full">
                 {[
                   { 
                     name: 'Technology', 
                     icon: (
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                       </svg>
                     )
                   },
                   { 
                     name: 'Videos', 
                     icon: (
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                       </svg>
                     )
                   },
                   { 
                     name: 'Education', 
                     icon: (
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                         <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                       </svg>
                     )
                   },
                   { 
                     name: 'Medical', 
                     icon: (
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                       </svg>
                     )
                   },
                   { 
                     name: 'Fashion', 
                     icon: (
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                       </svg>
                     )
                   },
                   { 
                     name: 'Design', 
                     icon: (
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                       </svg>
                     )
                   }
                                   ].map((category, index) => (
                    <div 
                      key={category.name} 
                      className={`bg-white rounded-lg p-4 cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-lg group ${
                        categoriesAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                                           <div className="flex items-center space-x-3">
                        <div className="text-purple-600 group-hover:text-purple-700 transition-all duration-300 group-hover:scale-110">
                          {category.icon}
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {category.name}
                        </span>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>
         
         
       </section>

             {/* Featured Projects Section - Enhanced */}
       <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-5">
           <div className="absolute inset-0" style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
               Featured Projects
             </h2>
             <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
               Discover amazing campaigns that are making a difference in communities worldwide
             </p>
           </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Eco-Friendly Water Bottle",
                category: "Technology",
                image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
                raised: 35000,
                goal: 50000,
                daysLeft: 15,
                creator: "GreenTech Innovations"
              },
              {
                title: "Community Garden Project",
                category: "Community",
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
                raised: 18000,
                goal: 25000,
                daysLeft: 8,
                creator: "Urban Green Collective"
              },
              {
                title: "AI-Powered Learning App",
                category: "Education",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
                raised: 45000,
                goal: 75000,
                daysLeft: 22,
                creator: "EduTech Solutions"
              },
              {
                title: "Local Art Gallery",
                category: "Arts",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
                raised: 12000,
                goal: 30000,
                daysLeft: 12,
                creator: "Art Community Hub"
              }
            ].map((project, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    by {project.creator}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">₴{project.raised.toLocaleString()}</span>
                      <span className="text-gray-900 font-medium">
                        {Math.round((project.raised / project.goal) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(project.raised / project.goal) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      raised of ₴{project.goal.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/campaigns" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Scrolling Projects Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the most popular campaigns that are gaining momentum
            </p>
          </div>
          
          <div className="relative">
            <div className="flex space-x-6 animate-scroll-left" style={{animationDuration: '60s'}}>
              {[
                {
                  title: "Eco-Friendly Water Bottle",
                  category: "Technology",
                  image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
                  raised: 35000,
                  goal: 50000,
                  daysLeft: 15,
                  creator: "GreenTech Innovations"
                },
                {
                  title: "Community Garden Project",
                  category: "Community",
                  image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
                  raised: 18000,
                  goal: 25000,
                  daysLeft: 8,
                  creator: "Urban Green Collective"
                },
                {
                  title: "AI-Powered Learning App",
                  category: "Education",
                  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
                  raised: 45000,
                  goal: 75000,
                  daysLeft: 22,
                  creator: "EduTech Solutions"
                },
                {
                  title: "Local Art Gallery",
                  category: "Arts",
                  image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
                  raised: 12000,
                  goal: 30000,
                  daysLeft: 12,
                  creator: "Art Community Hub"
                },
                {
                  title: "Solar Energy Initiative",
                  category: "Environment",
                  image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
                  raised: 28000,
                  goal: 40000,
                  daysLeft: 18,
                  creator: "SolarTech Solutions"
                },
                {
                  title: "Digital Health Platform",
                  category: "Healthcare",
                  image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
                  raised: 32000,
                  goal: 60000,
                  daysLeft: 25,
                  creator: "HealthTech Innovations"
                },
                {
                  title: "Sustainable Fashion Line",
                  category: "Fashion",
                  image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
                  raised: 15000,
                  goal: 35000,
                  daysLeft: 10,
                  creator: "EcoFashion Collective"
                },
                {
                  title: "Smart Home Security",
                  category: "Technology",
                  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
                  raised: 22000,
                  goal: 45000,
                  daysLeft: 14,
                  creator: "SecureTech Systems"
                },
                {
                  title: "Urban Farming Network",
                  category: "Agriculture",
                  image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=300&fit=crop",
                  raised: 19000,
                  goal: 30000,
                  daysLeft: 20,
                  creator: "Urban Farmers Co-op"
                },
                {
                  title: "Music Education Program",
                  category: "Education",
                  image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                  raised: 8000,
                  goal: 25000,
                  daysLeft: 16,
                  creator: "Music for All"
                },
                {
                  title: "Clean Water Project",
                  category: "Community",
                  image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
                  raised: 42000,
                  goal: 55000,
                  daysLeft: 12,
                  creator: "Water for Life"
                },
                {
                  title: "Innovation Hub",
                  category: "Technology",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
                  raised: 38000,
                  goal: 80000,
                  daysLeft: 30,
                  creator: "Innovation Labs"
                }
              ].map((project, index) => (
                <div key={index} className="flex-shrink-0 w-80 mx-4 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      by {project.creator}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">₴{project.raised.toLocaleString()}</span>
                        <span className="text-gray-900 font-bold">
                          {Math.round((project.raised / project.goal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${(project.raised / project.goal) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        raised of ₴{project.goal.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium">{project.daysLeft} days left</span>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Duplicate Set for Seamless Loop */}
              {[
                {
                  title: "Eco-Friendly Water Bottle",
                  category: "Technology",
                  image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
                  raised: 35000,
                  goal: 50000,
                  daysLeft: 15,
                  creator: "GreenTech Innovations"
                },
                {
                  title: "Community Garden Project",
                  category: "Community",
                  image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
                  raised: 18000,
                  goal: 25000,
                  daysLeft: 8,
                  creator: "Urban Green Collective"
                },
                {
                  title: "AI-Powered Learning App",
                  category: "Education",
                  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
                  raised: 45000,
                  goal: 75000,
                  daysLeft: 22,
                  creator: "EduTech Solutions"
                },
                {
                  title: "Local Art Gallery",
                  category: "Arts",
                  image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
                  raised: 12000,
                  goal: 30000,
                  daysLeft: 12,
                  creator: "Art Community Hub"
                },
                {
                  title: "Solar Energy Initiative",
                  category: "Environment",
                  image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
                  raised: 28000,
                  goal: 40000,
                  daysLeft: 18,
                  creator: "SolarTech Solutions"
                },
                {
                  title: "Digital Health Platform",
                  category: "Healthcare",
                  image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
                  raised: 32000,
                  goal: 60000,
                  daysLeft: 25,
                  creator: "HealthTech Innovations"
                },
                {
                  title: "Sustainable Fashion Line",
                  category: "Fashion",
                  image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
                  raised: 15000,
                  goal: 35000,
                  daysLeft: 10,
                  creator: "EcoFashion Collective"
                },
                {
                  title: "Smart Home Security",
                  category: "Technology",
                  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
                  raised: 22000,
                  goal: 45000,
                  daysLeft: 14,
                  creator: "SecureTech Systems"
                },
                {
                  title: "Urban Farming Network",
                  category: "Agriculture",
                  image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=300&fit=crop",
                  raised: 19000,
                  goal: 30000,
                  daysLeft: 20,
                  creator: "Urban Farmers Co-op"
                },
                {
                  title: "Music Education Program",
                  category: "Education",
                  image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                  raised: 8000,
                  goal: 25000,
                  daysLeft: 16,
                  creator: "Music for All"
                },
                {
                  title: "Clean Water Project",
                  category: "Community",
                  image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
                  raised: 42000,
                  goal: 55000,
                  daysLeft: 12,
                  creator: "Water for Life"
                },
                {
                  title: "Innovation Hub",
                  category: "Technology",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
                  raised: 38000,
                  goal: 80000,
                  daysLeft: 30,
                  creator: "Innovation Labs"
                }
              ].map((project, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0 w-80 mx-4 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      by {project.creator}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">₴{project.raised.toLocaleString()}</span>
                        <span className="text-gray-900 font-bold">
                          {Math.round((project.raised / project.goal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${(project.raised / project.goal) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        raised of ₴{project.goal.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium">{project.daysLeft} days left</span>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link href="/campaigns" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Exact Krowd Design */}
      <section ref={statsRef} className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white relative overflow-hidden">
        {/* Decorative wavy lines in corners */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,50 Q25,25 50,50 T100,50" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M0,60 Q25,35 50,60 T100,60" stroke="white" strokeWidth="2" fill="none" opacity="0.2"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,50 Q25,25 50,50 T100,50" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M0,60 Q25,35 50,60 T100,60" stroke="white" strokeWidth="2" fill="none" opacity="0.2"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              We&apos;re Trusted by More Than 3500 Clients
            </h2>
            <p className="text-purple-100 text-xl">
              Join thousands of successful campaigns and backers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { 
                number: projectsCompleted, 
                label: 'Projects Completed',
                icon: (
                  <div className="w-20 h-20 rounded-full border-2 border-teal-400 bg-teal-400/10 mx-auto mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-chart-line text-white text-2xl"></i>
                    </div>
                  </div>
                )
              },
              { 
                number: raisedToDate, 
                label: 'Raised to Date',
                icon: (
                  <div className="w-20 h-20 rounded-full border-2 border-teal-400 bg-teal-400/10 mx-auto mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-sack-dollar text-white text-2xl"></i>
                    </div>
                  </div>
                )
              },
              { 
                number: partnerFundings, 
                label: 'Partner Fundings',
                icon: (
                  <div className="w-20 h-20 rounded-full border-2 border-teal-400 bg-teal-400/10 mx-auto mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-handshake text-white text-2xl"></i>
                    </div>
                  </div>
                )
              },
              { 
                number: happyCustomers, 
                label: 'Happy Repeat Customers',
                icon: (
                  <div className="w-20 h-20 rounded-full border-2 border-teal-400 bg-teal-400/10 mx-auto mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-hand-holding-heart text-white text-2xl"></i>
                    </div>
                  </div>
                )
              }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                {stat.icon}
                <div className="text-5xl font-bold mb-3 transition-all duration-300 ease-out">
                  {stat.number.toLocaleString()}
                </div>
                <div className="text-purple-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced 3D Design */}
      <section id="why-choose-section" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ClearFund Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the tools and support you need to make your crowdfunding campaign successful
            </p>
          </div>
          
          {/* Features Section - 3D Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Features */}
            <div className="space-y-8">
              {/* Decorative wavy lines */}
              <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M0,50 Q25,25 50,50 T100,50" stroke="purple" strokeWidth="2" fill="none" opacity="0.3"/>
                  <path d="M0,60 Q25,35 50,60 T100,60" stroke="pink" strokeWidth="2" fill="none" opacity="0.2"/>
                </svg>
              </div>
              {[
                {
                  title: 'Highest Success Rates',
                  description: 'Our proven methodology and expert guidance ensure your campaign reaches its funding goals.',
                  color: 'from-blue-500 to-blue-600',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  )
                },
                {
                  title: 'Millions in Funding',
                  description: 'Join creators who have raised millions through our secure and transparent platform.',
                  color: 'from-green-500 to-green-600',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  )
                },
                {
                  title: 'Secure & Transparent',
                  description: 'Blockchain-powered security ensures your funds are protected throughout the entire process.',
                  color: 'from-purple-500 to-purple-600',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border border-gray-100 ${whyChooseAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                  style={{transitionDelay: `${1800 + index * 200}ms`}}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* 3D Border Effect */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-${feature.color.split('-')[1]}-200 transition-all duration-300`}></div>
                </div>
              ))}
            </div>
            
            {/* Right Column - 3D Image Cards */}
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-float blur-sm"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full animate-float-delay-1 blur-sm"></div>
              <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-yellow-400/20 rounded-full animate-float-delay-2 blur-sm"></div>
              
              <div className="space-y-8">
                {[
                  {
                    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    alt: "Team collaboration",
                    title: "Team Collaboration",
                    style: { transform: `translateY(${scrollY * 0.1}px)` }
                  },
                  {
                    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    alt: "Creative workspace",
                    title: "Creative Workspace",
                    style: { transform: `translateY(${scrollY * 0.15}px)` }
                  },
                  {
                    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    alt: "Innovation meeting",
                    title: "Innovation Meeting",
                    style: { transform: `translateY(${scrollY * 0.2}px)` }
                  }
                ].map((image, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-3xl group hover:-translate-y-3 border border-gray-100 ${whyChooseAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{transitionDelay: `${2200 + index * 200}ms`}}
                  >
                    <div className="relative">
                      <img 
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        style={image.style}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <h4 className="text-lg font-bold">{image.title}</h4>
                        <p className="text-sm text-gray-200">Professional collaboration</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Enhanced CTA Section - 3D Design */}
          <div className={`text-center mt-20 transition-all duration-1000 ${whyChooseAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '2800ms'}}>
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-float-delay-1"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of successful creators and bring your innovative ideas to life with our powerful platform
                </p>
                <Link 
                  href="/create-campaign" 
                  className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Your Campaign
                  <ArrowRightIcon className="ml-3 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Raise Funds for Your Idea?
          </h2>
          <p className="text-2xl mb-10 text-purple-100">
            Join thousands of creators who have successfully funded their projects
          </p>
          <Link href="/create-campaign" className="bg-white text-purple-600 px-10 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow-lg">
            Start a Project
            <ArrowRightIcon className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-purple-400 mb-6">ClearFund</h3>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                The most trusted crowdfunding platform for creators and backers worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-lg">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white text-lg">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white text-lg">Instagram</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400 text-lg">
                <li><a href="#" className="hover:text-white">About us</a></li>
                <li><a href="#" className="hover:text-white">Latest events</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">News & articles</a></li>
                <li><a href="#" className="hover:text-white">Contact us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Fundraising</h4>
              <ul className="space-y-3 text-gray-400 text-lg">
                <li><a href="#" className="hover:text-white">Education</a></li>
                <li><a href="#" className="hover:text-white">Design</a></li>
                <li><a href="#" className="hover:text-white">Film & Video</a></li>
                <li><a href="#" className="hover:text-white">Technology</a></li>
                <li><a href="#" className="hover:text-white">Games</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-3 text-purple-400" />
                  666 888 0000
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-purple-400" />
                  needhelp@potisen.com
                </li>
                <li className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-3 text-purple-400" />
                  22 Broklyn Street New York USA
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; Copyright 2020 by Gaviasthemes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
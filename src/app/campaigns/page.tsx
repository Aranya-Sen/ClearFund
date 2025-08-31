'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  HeartIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../../hooks/useBlockchain';

// Simple reveal wrapper
type RevealProps = { children: React.ReactNode; className?: string };
function Reveal({ children, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  );
}

// Campaign interface for database data
interface DBCampaign {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  images: Array<{ url: string; publicId: string; caption: string }>;
  mainImage: { url: string; publicId: string } | null;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  creatorWalletAddress: string;
  status: string;
  startDate: string;
  endDate: string;
  location: {
    country: string;
    city: string;
    address: string;
  };
  tags: string[];
  milestones: Array<{
    title: string;
    description: string;
    targetAmount: number;
    isCompleted: boolean;
    completedAt?: string;
  }>;
  blockchainData: {
    contractAddress: string;
    campaignId: number;
    totalTransactions: number;
  };
  isVerified: boolean;
  totalDonors: number;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  daysRemaining: number;
}

export default function CampaignsPage() {
  const { isConnected, account } = useBlockchain();
  const [showFullyFunded, setShowFullyFunded] = useState(false);
  // Live stats
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [animated, setAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const finalCounts = [690, 808, 560, 990];
  const [campaigns, setCampaigns] = useState<DBCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, [showFullyFunded]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch campaigns from the database API with showFullyFunded parameter
      const response = await fetch(`/api/campaigns?status=active&limit=50&showFullyFunded=${showFullyFunded}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load campaigns');
      }
      
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setError(error instanceof Error ? error.message : 'Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  // Search and filters
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [onlyVerified, setOnlyVerified] = useState(false);

  const normalized = (s: string) => s.toLowerCase();
  const matchesQuery = (c: DBCampaign) => {
    const q = normalized(query.trim());
    if (!q) return true;
    return (
      normalized(c.title).includes(q) ||
      normalized(c.description).includes(q) ||
      normalized(c.shortDescription).includes(q) ||
      normalized(`${c.creator.firstName} ${c.creator.lastName}`).includes(q) ||
      normalized(c.category).includes(q) ||
      c.tags.some(tag => normalized(tag).includes(q))
    );
  };

  const byCategory = (c: DBCampaign) =>
    category === "All Categories" || c.category === category;

  const byVerified = (c: DBCampaign) =>
    !onlyVerified || c.isVerified;

  const filtered = campaigns.filter((c) => matchesQuery(c) && byCategory(c) && byVerified(c));

  // Load more state
  const [visibleCount, setVisibleCount] = useState(3);
  const displayed = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  // Categories animation state
  const [categoriesAnimated, setCategoriesAnimated] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset pagination when filters change
    setVisibleCount(3);
  }, [query, category, onlyVerified, showFullyFunded]);

  // Categories animation effect
  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !categoriesAnimated) {
          setCategoriesAnimated(true);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [categoriesAnimated]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !animated) {
          setAnimated(true);
          const duration = 1800;
          const steps = 60;
          let step = 0;
          const id = setInterval(() => {
            step++;
            const t = step / steps;
            const eased = 1 - Math.pow(1 - t, 4);
            setCounts(finalCounts.map((n) => Math.floor(n * eased)));
            if (step >= steps) {
              clearInterval(id);
              setCounts(finalCounts);
            }
          }, duration / steps);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-bold flex items-center">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-2">
                  <ShieldCheckIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-purple-600">Clear</span>
                <span className="text-teal-500">Fund</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
              <Link href="/campaigns" className="text-gray-700 hover:text-purple-600 font-medium">Explore</Link>
              <Link href="/create-campaign" className="text-gray-700 hover:text-purple-600 font-medium">Start a Project</Link>
              <Link href="/support" className="text-gray-700 hover:text-purple-600 font-medium">Support</Link>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 font-medium">
                  <UserCircleIcon className="h-6 w-6" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium">
                  Sign in
                </Link>
              )}
              <Link href="/create-campaign" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Create A Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero with background image */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1600&auto=format&fit=crop)",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700/70 via-purple-700/60 to-purple-800/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <Reveal>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Project Page</h1>
          </Reveal>
          <Reveal className="delay-150">
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
              Discover handpicked campaigns across technology, design, film & more. Support what you love.
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <Link href="/create-campaign" className="inline-flex items-center bg-white text-purple-700 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition">
              Add a Project
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Top Categories Section - Horizontal Scrolling */}
      <section ref={categoriesRef} className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="w-full relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-16">
              {/* Sub-heading with green square */}
              <div 
                className={`flex items-center justify-center mb-6 transition-all duration-1000 ${
                  categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded mr-3 shadow-lg"></div>
                <span className="text-green-600 text-lg font-semibold tracking-wide">Which Category Interests You</span>
              </div>
              
              {/* Main heading */}
              <h2 
                className={`text-5xl lg:text-6xl font-bold mb-8 leading-tight transition-all duration-1000 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ${
                  categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                Top Categories
              </h2>
              
              {/* Description */}
              <div 
                className={`max-w-3xl mx-auto transition-all duration-1000 ${
                  categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Explore a diverse range of projects and initiatives, carefully categorized to help you find causes that resonate with your passions and values.
                </p>
              </div>
            </div>
            
            {/* Scrolling Categories Container */}
            <div className="relative overflow-hidden">
              {/* First row of categories */}
              <div className="flex animate-scroll-left">
                {[
                  { 
                    name: 'Technology', 
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&crop=center',
                    color: 'from-blue-500 to-blue-600' 
                  },
                  { 
                    name: 'Videos', 
                    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=200&fit=crop&crop=center',
                    color: 'from-rose-500 to-rose-600' 
                  },
                  { 
                    name: 'Education', 
                    image: 'https://images.unsplash.com/photo-1523240797355-351f22f4f9a5?w=200&h=200&fit=crop&crop=center',
                    color: 'from-emerald-500 to-emerald-600' 
                  },
                  { 
                    name: 'Medical', 
                    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center',
                    color: 'from-red-500 to-red-600' 
                  },
                  { 
                    name: 'Fashion', 
                    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&crop=center',
                    color: 'from-pink-500 to-pink-600' 
                  },
                  { 
                    name: 'Design', 
                    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop&crop=center',
                    color: 'from-indigo-500 to-indigo-600' 
                  },
                  { 
                    name: 'Technology', 
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&crop=center',
                    color: 'from-blue-500 to-blue-600' 
                  },
                  { 
                    name: 'Videos', 
                    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=200&fit=crop&crop=center',
                    color: 'from-rose-500 to-rose-600' 
                  },
                  { 
                    name: 'Education', 
                    image: 'https://images.unsplash.com/photo-1523240797355-351f22f4f9a5?w=200&h=200&fit=crop&crop=center',
                    color: 'from-emerald-500 to-emerald-600' 
                  },
                  { 
                    name: 'Medical', 
                    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center',
                    color: 'from-red-500 to-red-600' 
                  },
                  { 
                    name: 'Fashion', 
                    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&crop=center',
                    color: 'from-pink-500 to-pink-600' 
                  },
                  { 
                    name: 'Design', 
                    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop&crop=center',
                    color: 'from-indigo-500 to-indigo-600' 
                  }
                ].map((category, index) => (
                  <div 
                    key={`${category.name}-${index}`}
                    className={`flex-shrink-0 w-64 mx-4 group cursor-pointer transition-all duration-500 hover:scale-105 ${
                      categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="category-card bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border-2 border-gray-100 hover:border-purple-300 hover:bg-gradient-to-br hover:from-white hover:to-purple-50">
                      <div className={`category-image-container w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden ring-2 ring-white ring-opacity-50`}>
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            // If image fails to load, show a colored background with first letter
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white text-2xl font-bold">${category.name.charAt(0)}</div>`;
                            }
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-300 mb-2">
                        {category.name}
                      </h3>
                      <div className="progress-bar mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${category.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Second row of categories (moving in opposite direction) */}
              <div className="flex animate-scroll-right mt-8">
                {[
                  { 
                    name: 'Gaming', 
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop&crop=center',
                    color: 'from-purple-500 to-purple-600' 
                  },
                  { 
                    name: 'Music', 
                    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center',
                    color: 'from-yellow-500 to-yellow-600' 
                  },
                  { 
                    name: 'Sports', 
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center',
                    color: 'from-green-500 to-green-600' 
                  },
                  { 
                    name: 'Art', 
                    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?w=200&h=200&fit=crop&crop=center',
                    color: 'from-orange-500 to-orange-600' 
                  },
                  { 
                    name: 'Food', 
                    image: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=200&h=200&fit=crop&crop=center',
                    color: 'from-red-500 to-red-600' 
                  },
                  { 
                    name: 'Travel', 
                    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop&crop=center',
                    color: 'from-cyan-500 to-cyan-600' 
                  },
                  { 
                    name: 'Gaming', 
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop&crop=center',
                    color: 'from-purple-500 to-purple-600' 
                  },
                  { 
                    name: 'Music', 
                    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center',
                    color: 'from-yellow-500 to-yellow-600' 
                  },
                  { 
                    name: 'Sports', 
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center',
                    color: 'from-green-500 to-green-600' 
                  },
                  { 
                    name: 'Art', 
                    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?w=200&h=200&fit=crop&crop=center',
                    color: 'from-orange-500 to-orange-600' 
                  },
                  { 
                    name: 'Food', 
                    image: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=200&h=200&fit=crop&crop=center',
                    color: 'from-red-500 to-red-600' 
                  },
                  { 
                    name: 'Travel', 
                    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop&crop=center',
                    color: 'from-cyan-500 to-cyan-600' 
                  }
                ].map((category, index) => (
                  <div 
                    key={`${category.name}-${index}`}
                    className={`flex-shrink-0 w-64 mx-4 group cursor-pointer transition-all duration-500 hover:scale-105 ${
                      categoriesAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="category-card bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border-2 border-gray-100 hover:border-purple-300 hover:bg-gradient-to-br hover:from-white hover:to-purple-50">
                      <div className={`category-image-container w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden ring-2 ring-white ring-opacity-50`}>
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            // If image fails to load, show a colored background with first letter
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white text-2xl font-bold">${category.name.charAt(0)}</div>`;
                            }
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-300 mb-2">
                        {category.name}
                      </h3>
                      <div className="progress-bar mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${category.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Projects</h2>
            <p className="text-lg text-gray-700">Businesses You Can Back</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.slice(0, 3).map((campaign) => (
              <Reveal key={`featured-${campaign._id}`}>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <img 
                      src={campaign.mainImage?.url || campaign.images[0]?.url || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop"} 
                      alt={campaign.title} 
                      className="w-full h-60 object-cover" 
                    />
                    {campaign.isVerified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Verified
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow">
                      {campaign.category}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {campaign.daysRemaining} Days Left
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${campaign.progressPercentage}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>{campaign.currency} {campaign.currentAmount.toLocaleString()} raised</span>
                      <span>{Math.round(campaign.progressPercentage)}%</span>
                    </div>
                    <Link href={`/campaigns/${campaign._id}`} className="mt-4 inline-flex items-center text-indigo-600 font-semibold hover:underline">
                      View details
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">We&apos;re Trusted by More Than 3500 Clients</h2>
            <p className="text-purple-100 text-xl">Join thousands of successful campaigns and backers</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { 
                label: 'Projects Completed', 
                value: counts[0],
                icon: 'fa-solid fa-chart-line',
                bgColor: 'bg-blue-500'
              },
              { 
                label: 'Raised to Date', 
                value: counts[1],
                icon: 'fa-solid fa-sack-dollar',
                bgColor: 'bg-green-500'
              },
              { 
                label: 'Partner Fundings', 
                value: counts[2],
                icon: 'fa-solid fa-handshake',
                bgColor: 'bg-purple-500'
              },
              { 
                label: 'Happy Repeat Customers', 
                value: counts[3],
                icon: 'fa-solid fa-hand-holding-heart',
                bgColor: 'bg-orange-500'
              }
            ].map((s) => (
              <Reveal key={s.label} className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-teal-400 bg-teal-400/10 mx-auto mb-6 flex items-center justify-center group">
                  <div className={`w-12 h-12 ${s.bgColor} rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                    <i className={s.icon}></i>
                  </div>
                </div>
                <div className="text-5xl font-extrabold mb-2">{s.value}</div>
                <div className="text-purple-100 text-lg">{s.label}</div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-12">
            <Link href="/create-campaign" className="inline-flex items-center bg-white text-purple-700 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition">
              Start a Project
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects by title, creator or category..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option>All Categories</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Environment</option>
                <option>Arts</option>
                <option>Community</option>
                <option>Other</option>
              </select>
              <button
                type="button"
                onClick={() => setOnlyVerified((v) => !v)}
                className={`flex items-center px-6 py-4 rounded-xl border text-lg transition-colors ${onlyVerified ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <CheckCircleIcon className="h-6 w-6 mr-3" />
                {onlyVerified ? 'Verified only' : 'Include verified only'}
              </button>
              <button
                type="button"
                onClick={() => setShowFullyFunded((v) => !v)}
                className={`flex items-center px-6 py-4 rounded-xl border text-lg transition-colors ${showFullyFunded ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <CurrencyDollarIcon className="h-6 w-6 mr-3" />
                {showFullyFunded ? 'Hide fully funded' : 'Show fully funded'}
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{displayed.length}</span> of {filtered.length}
          </div>
        </Reveal>
      </div>

      {/* Explore Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <Reveal className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading campaigns...</p>
          </Reveal>
        ) : error ? (
          <Reveal className="text-center text-red-600">
            <p className="text-xl font-semibold mb-2">Error loading campaigns</p>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={loadCampaigns}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </Reveal>
        ) : displayed.length === 0 ? (
          <Reveal className="text-center text-gray-700">
            <p className="text-xl font-semibold mb-2">No campaigns found</p>
            <p className="text-gray-600">No campaigns match your search or filters.</p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayed.map((campaign) => (
              <Reveal key={campaign._id}>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <img
                      src={campaign.mainImage?.url || campaign.images[0]?.url || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop"}
                      alt={campaign.title}
                      className="w-full h-64 object-cover"
                    />
                    {campaign.isVerified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Verified
                      </div>
                    )}
                    {/* Show fully funded indicator */}
                    {campaign.milestones && campaign.milestones.length > 0 && (() => {
                      const totalMilestoneTarget = campaign.milestones.reduce((sum, milestone) => sum + milestone.targetAmount, 0);
                      const isFullyFunded = campaign.currentAmount >= totalMilestoneTarget;
                      return isFullyFunded ? (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          Fully Funded
                        </div>
                      ) : null;
                    })()}
                    <div className={`absolute ${campaign.milestones && campaign.milestones.length > 0 && (() => {
                      const totalMilestoneTarget = campaign.milestones.reduce((sum, milestone) => sum + milestone.targetAmount, 0);
                      return campaign.currentAmount >= totalMilestoneTarget ? 'top-16 left-4' : 'top-4 left-4';
                    })()} bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-md`}>
                      {campaign.category}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {campaign.daysRemaining || 0} Days Left
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full">
                        {campaign.category}
                      </span>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <HeartIcon className="h-7 w-7" />
                      </button>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-700 text-base mb-6 line-clamp-2 leading-relaxed">
                      {campaign.shortDescription}
                    </p>
                    
                    <div className="flex items-center text-base text-gray-700 mb-6">
                      <UserIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">
                        {campaign.creator?.firstName || 'Unknown'} {campaign.creator?.lastName || 'Creator'}
                      </span>
                    </div>

                    <div className="mb-8">
                      <div className="flex justify-between text-base mb-3">
                        <span className="text-gray-700 font-medium">Progress</span>
                        <span className="text-gray-900 font-bold">
                          {campaign.currency || 'ETH'} {(campaign.currentAmount || 0).toLocaleString()} / {campaign.currency || 'ETH'} {(campaign.goalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
                          style={{ width: `${campaign.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-3 text-base">
                        <span className="text-gray-600">
                          {Math.round(campaign.progressPercentage || 0)}% funded
                        </span>
                        <span className="text-blue-600 font-semibold">
                          {campaign.currency || 'ETH'} {(campaign.currentAmount || 0).toLocaleString()} raised
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-base text-gray-700 mb-8">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{campaign.daysRemaining || 0} days left</span>
                      </div>
                    </div>

                    <Link 
                      href={`/campaigns/${campaign._id}`}
                      className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                      Support Project
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {canLoadMore && (
          <Reveal className="text-center mt-16">
            <button
              onClick={() => setVisibleCount(filtered.length)}
              className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-xl shadow-lg hover:shadow-xl"
            >
              Load More Projects
            </button>
          </Reveal>
        )}
      </div>
    </div>
  );
}

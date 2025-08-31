'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon,
  ArrowRightIcon,
  CalendarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

// Reveal component for scroll animations
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

const mockNews = [
  {
    id: 1,
    title: "ClearFund Reaches 10 Million in Total Funding",
    excerpt: "Our platform has achieved a major milestone, helping creators raise over $10 million in total funding across thousands of successful campaigns.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    category: "Platform Updates",
    author: "Sarah Johnson",
    date: "2024-02-15",
    readTime: "5 min read",
    views: 1247,
    comments: 23,
    featured: true
  },
  {
    id: 2,
    title: "Top 10 Crowdfunding Success Stories of 2024",
    excerpt: "Discover the most inspiring crowdfunding campaigns that made headlines this year and learn what made them successful.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    category: "Success Stories",
    author: "Michael Chen",
    date: "2024-02-12",
    readTime: "8 min read",
    views: 892,
    comments: 15,
    featured: true
  },
  {
    id: 3,
    title: "New Blockchain Features Enhance Security",
    excerpt: "We've implemented advanced blockchain technology to provide even greater transparency and security for all transactions.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
    category: "Technology",
    author: "David Kim",
    date: "2024-02-10",
    readTime: "6 min read",
    views: 567,
    comments: 8,
    featured: false
  }
];

const categories = ['All Categories', 'Platform Updates', 'Success Stories', 'Technology', 'Industry Insights', 'Tips & Guides', 'Community'];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [visibleNews, setVisibleNews] = useState(6);

  const filteredNews = mockNews.filter(article => {
    const matchesSearch = searchTerm === '' ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleLoadMore = () => {
    setVisibleNews(filteredNews.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium">
                Sign in
              </Link>
              <Link href="/create-campaign" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Create A Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-32" style={{ backgroundImage: "url('https://gaviaspreview.com/wp/krowd/wp-content/uploads/2020/09/bg-1.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-800 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <h1 className="text-6xl font-extrabold text-white mb-6">News & Updates</h1>
            <p className="text-xl text-white opacity-90">Home / News</p>
          </Reveal>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Latest News & Updates
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stay informed about the latest developments in crowdfunding and our platform
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mockNews.filter(article => article.featured).map((article, index) => (
              <Reveal key={article.id} delay={index * 0.1}>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formatDate(article.date)}
                      <span className="mx-2">•</span>
                      <UserIcon className="h-4 w-4 mr-2" />
                      {article.author}
                      <span className="mx-2">•</span>
                      {article.readTime}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {article.views}
                        </div>
                        <div className="flex items-center">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                          {article.comments}
                        </div>
                      </div>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center">
                        Read More
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <select
                    className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* All News Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All Articles
              </h2>
              <p className="text-lg text-gray-600">
                Explore all our latest news, updates, and insights
              </p>
            </div>
          </Reveal>

          {filteredNews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.slice(0, visibleNews).map((article, index) => (
                  <Reveal key={article.id} delay={index * 0.1}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {article.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(article.date)}
                          <span className="mx-2">•</span>
                          {article.readTime}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {article.views}
                            </div>
                            <div className="flex items-center">
                              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                              {article.comments}
                            </div>
                          </div>
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center text-sm">
                            Read More
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {visibleNews < filteredNews.length && (
                <div className="text-center mt-16">
                  <button
                    onClick={handleLoadMore}
                    className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                  >
                    Load More Articles
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold mb-8">
              Stay Updated
            </h2>
            <p className="text-2xl mb-10 text-purple-100">
              Subscribe to our newsletter for the latest news and insights
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-white text-purple-600 px-8 py-4 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

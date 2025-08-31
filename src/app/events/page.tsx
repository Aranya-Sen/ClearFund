'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon
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

const mockEvents = [
  {
    id: 1,
    title: "Crowdfunding Success Workshop",
    date: "2024-02-15",
    time: "10:00 AM - 2:00 PM",
    location: "Tech Hub Downtown",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    attendees: 45,
    price: "Free",
    featured: true,
    description: "Learn the secrets of successful crowdfunding campaigns from industry experts."
  },
  {
    id: 2,
    title: "Innovation Summit 2024",
    date: "2024-02-20",
    time: "9:00 AM - 6:00 PM",
    location: "Convention Center",
    category: "Conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    attendees: 200,
    price: "$150",
    featured: true,
    description: "Join us for the biggest innovation and crowdfunding event of the year."
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    date: "2024-02-25",
    time: "7:00 PM - 10:00 PM",
    location: "Innovation Lab",
    category: "Meetup",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    attendees: 80,
    price: "$25",
    featured: false,
    description: "Watch amazing startups pitch their ideas and network with investors."
  },
  {
    id: 4,
    title: "Digital Marketing for Crowdfunding",
    date: "2024-03-01",
    time: "2:00 PM - 4:00 PM",
    location: "Online Webinar",
    category: "Webinar",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    attendees: 150,
    price: "Free",
    featured: false,
    description: "Master digital marketing strategies to boost your crowdfunding campaign."
  },
  {
    id: 5,
    title: "Investor Networking Mixer",
    date: "2024-03-05",
    time: "6:00 PM - 9:00 PM",
    location: "Rooftop Lounge",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    attendees: 60,
    price: "$75",
    featured: false,
    description: "Connect with angel investors and venture capitalists in a relaxed setting."
  },
  {
    id: 6,
    title: "Crowdfunding Legal Workshop",
    date: "2024-03-10",
    time: "11:00 AM - 1:00 PM",
    location: "Law Office Downtown",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop",
    attendees: 30,
    price: "$50",
    featured: false,
    description: "Understand the legal aspects of crowdfunding and compliance requirements."
  }
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDate, setSelectedDate] = useState('All Dates');
  const [visibleEvents, setVisibleEvents] = useState(3);

  const categories = ['All Categories', 'Workshop', 'Conference', 'Meetup', 'Webinar', 'Networking'];
  const dates = ['All Dates', 'This Week', 'This Month', 'Next Month'];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = searchTerm === '' ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' || event.category === selectedCategory;
    
    const matchesDate = selectedDate === 'All Dates' || true; // Simplified date filtering

    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleLoadMore = () => {
    setVisibleEvents(filteredEvents.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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
            <h1 className="text-6xl font-extrabold text-white mb-6">Events</h1>
            <p className="text-xl text-white opacity-90">Home / Events</p>
          </Reveal>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Upcoming Events
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join our community events and learn from industry experts
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockEvents.filter(event => event.featured).map((event, index) => (
              <Reveal key={event.id} delay={index * 0.1}>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {event.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {event.attendees} attendees
                      </div>
                    </div>

                    <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center">
                      Register Now
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </button>
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
                      placeholder="Search events..."
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
                  <select
                    className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    {dates.map(date => (
                      <option key={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* All Events Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All Events
              </h2>
              <p className="text-lg text-gray-600">
                Discover all upcoming events and opportunities
              </p>
            </div>
          </Reveal>

          {filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.slice(0, visibleEvents).map((event, index) => (
                  <Reveal key={event.id} delay={index * 0.1}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {event.category}
                        </div>
                        <div className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {event.price}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                        </div>

                        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center text-sm">
                          Register Now
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {visibleEvents < filteredEvents.length && (
                <div className="text-center mt-16">
                  <button
                    onClick={handleLoadMore}
                    className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                  >
                    Load More Events
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold mb-8">
              Want to Host an Event?
            </h2>
            <p className="text-2xl mb-10 text-purple-100">
              Partner with us to organize amazing events for the crowdfunding community
            </p>
            <Link href="/contact" className="bg-white text-purple-600 px-10 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow-lg">
              Contact Us
              <ArrowRightIcon className="ml-3 h-6 w-6" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

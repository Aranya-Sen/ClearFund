'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
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

const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    bio: "Former VP at major tech companies with 15+ years in fintech and crowdfunding.",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Blockchain expert with experience building secure financial platforms.",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Head of Operations",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Operations specialist with a passion for community building and user experience.",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    id: 4,
    name: "David Kim",
    position: "Head of Marketing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Digital marketing expert specializing in growth strategies for fintech platforms.",
    social: { linkedin: "#", twitter: "#" }
  }
];

const stats = [
  { number: "10M+", label: "Total Raised", icon: ChartBarIcon },
  { number: "50K+", label: "Projects Funded", icon: UserGroupIcon },
  { number: "200K+", label: "Active Users", icon: UserGroupIcon },
  { number: "98%", label: "Success Rate", icon: StarIcon }
];

const values = [
  {
    icon: ShieldCheckIcon,
    title: "Trust & Security",
    description: "We prioritize the security of your funds and personal information with bank-level encryption and blockchain technology."
  },
  {
    icon: UserGroupIcon,
    title: "Community First",
    description: "We believe in the power of community and work to build meaningful connections between creators and backers."
  },
  {
    icon: ChartBarIcon,
    title: "Transparency",
    description: "All transactions are recorded on the blockchain, ensuring complete transparency and accountability."
  },
  {
    icon: StarIcon,
    title: "Innovation",
    description: "We continuously innovate to provide the best crowdfunding experience with cutting-edge technology."
  }
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('about');
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const finalCounts = [10, 50, 200, 98];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounts();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounts = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;

      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const newCounts = finalCounts.map((final, index) => {
        return Math.floor(final * easeOutQuart);
      });

      setCounts(newCounts);

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(finalCounts);
      }
    }, stepDuration);
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
            <h1 className="text-6xl font-extrabold text-white mb-6">About Us</h1>
            <p className="text-xl text-white opacity-90">Home / About Us</p>
          </Reveal>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  We&apos;re Building the Future of Crowdfunding
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  ClearFund was founded with a simple mission: to democratize access to funding and make it easier for innovative ideas to come to life. We believe that great ideas shouldn&apos;t be limited by traditional funding barriers.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our platform combines cutting-edge blockchain technology with user-friendly design to create a secure, transparent, and efficient crowdfunding experience. We&apos;ve helped thousands of creators bring their visions to reality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center">
                    Learn More
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                  <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors inline-flex items-center">
                    <PlayIcon className="mr-2 h-5 w-5" />
                    Watch Video
                  </button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6">
                  <div className="text-3xl font-bold text-purple-600">10M+</div>
                  <div className="text-gray-600">Total Raised</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Our Impact in Numbers
              </h2>
              <p className="text-xl text-purple-100">
                See how we&apos;ve helped creators and backers achieve their goals
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="bg-white/10 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {counts[index]}{stat.label === "Success Rate" ? "%" : "K+"}
                  </div>
                  <div className="text-purple-100">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do and shape our platform&apos;s development
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind ClearFund&apos;s mission to democratize funding
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Reveal key={member.id} delay={index * 0.1}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-4">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {member.bio}
                    </p>
                    <div className="flex space-x-3">
                      <a href={member.social.linkedin} className="text-gray-400 hover:text-purple-600 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href={member.social.twitter} className="text-gray-400 hover:text-purple-600 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold mb-8">
              Ready to Start Your Journey?
            </h2>
            <p className="text-2xl mb-10 text-purple-100">
              Join thousands of creators who have successfully funded their projects
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/create-campaign" className="bg-white text-purple-600 px-10 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow-lg">
                Start a Project
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </Link>
              <Link href="/contact" className="bg-transparent text-white border-2 border-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center">
                Contact Us
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

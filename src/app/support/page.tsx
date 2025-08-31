'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AuthGuard from '../../components/AuthGuard';
import { useBlockchain } from '../../hooks/useBlockchain';

// Mock FAQ data
const mockFAQs = [
  {
    id: 1,
    category: "General",
    question: "How does ClearFund work?",
    answer: "ClearFund is a secure crowdfunding platform that connects campaign creators with donors. Campaigns are verified through KYC/KYB processes, and funds are held in escrow until milestones are verified and approved by our team."
  },
  {
    id: 2,
    category: "General",
    question: "What is the difference between ClearFund and other platforms?",
    answer: "ClearFund stands out with its advanced security features including KYC/KYB verification, milestone-based funding with escrow protection, and AI-powered fraud detection to ensure transparency and trust."
  },
  {
    id: 3,
    category: "Campaign Creators",
    question: "How do I create a campaign?",
    answer: "To create a campaign, click 'Start Campaign' and follow our 4-step process: 1) Campaign Details, 2) KYC/KYB Verification, 3) Set Milestones, 4) Review & Submit. Our team will review your campaign within 2-3 business days."
  },
  {
    id: 4,
    category: "Campaign Creators",
    question: "What is KYC/KYB verification?",
    answer: "KYC (Know Your Customer) and KYB (Know Your Business) are identity verification processes that help prevent fraud. We verify personal and business information to ensure campaign creators are legitimate and trustworthy."
  },
  {
    id: 5,
    category: "Campaign Creators",
    question: "How do milestones work?",
    answer: "Milestones are specific goals within your campaign. Funds are released only when milestones are completed and verified by our team. This ensures donors that their money is being used as intended."
  },
  {
    id: 6,
    category: "Donors",
    question: "How do I donate to a campaign?",
    answer: "Browse campaigns, select one you want to support, choose a reward (if available), and click 'Support Campaign'. You can donate using credit card, debit card, or bank transfer through our secure payment system."
  },
  {
    id: 7,
    category: "Donors",
    question: "Is my donation secure?",
    answer: "Yes, all donations are processed through secure payment gateways and held in escrow until campaign milestones are verified. If a campaign fails to meet its goals, donors receive refunds."
  },
  {
    id: 8,
    category: "Donors",
    question: "Can I get a refund?",
    answer: "Refunds are available if a campaign fails to reach its funding goal or if milestones are not met. You can also request a refund within 24 hours of your donation if you change your mind."
  },
  {
    id: 9,
    category: "Technical",
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. All payments are processed securely through Stripe."
  },
  {
    id: 10,
    category: "Technical",
    question: "How do I track my donations?",
    answer: "You can track all your donations in your donor dashboard. You'll receive email updates when campaigns reach milestones and when funds are released to creators."
  }
];

const categories = ["All", "General", "Campaign Creators", "Donors", "Technical"];

export default function SupportPage() {
  const { isConnected, account } = useBlockchain();
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const filteredFAQs = activeCategory === "All" 
    ? mockFAQs 
    : mockFAQs.filter(faq => faq.category === activeCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
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
                    <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Get Support
                    </Link>
                    <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Location
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium">
                  <UserIcon className="h-6 w-6" />
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

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Support & Help Center</h1>
            <p className="mt-2 text-gray-600">Get help with your campaigns and donations</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <QuestionMarkCircleIcon className="h-6 w-6 mr-2" />
                Frequently Asked Questions
              </h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <span className="text-indigo-600 text-sm font-medium">{faq.category}</span>
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <EnvelopeIcon className="h-6 w-6 mr-2" />
                Contact Support
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800">Thank you! Your message has been sent. We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={contactForm.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="campaign-creation">Campaign Creation</option>
                      <option value="donation-issues">Donation Issues</option>
                      <option value="milestone-verification">Milestone Verification</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="fraud-report">Report Fraud</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Please describe your issue or question in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                                     <div>
                     <p className="text-sm font-medium text-gray-900">Email Support</p>
                     <p className="text-sm text-gray-600">support@clearfund.com</p>
                   </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Platform Terms of Service
                </a>
                <a href="#" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Privacy Policy
                </a>
                <a href="#" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Security & Trust
                </a>
                <a href="#" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Fee Structure
                </a>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mr-2" />
                    <p className="text-xs text-yellow-800">
                      Emergency support available 24/7 for critical issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

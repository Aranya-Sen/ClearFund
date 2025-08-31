'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AuthGuard from '../../components/AuthGuard';
import { useBlockchain } from '../../hooks/useBlockchain';

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

const contactInfo = [
  {
    icon: PhoneIcon,
    title: "Phone Number",
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    color: "bg-blue-500"
  },
  {
    icon: EnvelopeIcon,
    title: "Email Address",
    details: ["hello@clearfund.com", "support@clearfund.com"],
    color: "bg-purple-500"
  },
  {
    icon: MapPinIcon,
    title: "Office Address",
    details: ["123 Innovation Street", "Tech District, NY 10001"],
    color: "bg-green-500"
  },
  {
    icon: ClockIcon,
    title: "Working Hours",
    details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM"],
    color: "bg-orange-500"
  }
];

export default function ContactPage() {
  const { isConnected, account } = useBlockchain();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <AuthGuard>
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
                  <UserIcon className="h-6 w-6" />
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

      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-32" style={{ backgroundImage: "url('https://gaviaspreview.com/wp/krowd/wp-content/uploads/2020/09/bg-1.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-800 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <h1 className="text-6xl font-extrabold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-white opacity-90">Home / Contact</p>
          </Reveal>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className={`${info.color} w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {info.title}
                  </h3>
                  <div className="space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Reveal>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  Send us a Message
                </h3>
                
                {submitSuccess ? (
                  <div className="text-center py-12">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-gray-600">
                      Thank you for contacting us. We&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          required
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          placeholder="Enter subject"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                        placeholder="Enter your message"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Google Map */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">
                    Find Us
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPinIcon className="h-6 w-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Office Address</h4>
                        <p className="text-gray-600">123 Innovation Street, Tech District, NY 10001</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <PhoneIcon className="h-6 w-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone</h4>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <EnvelopeIcon className="h-6 w-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Email</h4>
                        <p className="text-gray-600">hello@clearfund.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <ClockIcon className="h-6 w-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Working Hours</h4>
                        <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
                        <p className="text-gray-600">Saturday: 10AM - 4PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Google Maps Embed */}
                <div className="h-96 w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1839486600007!2d-74.00601508459367!3d40.71277597933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae01!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ClearFund Office Location"
                  ></iframe>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our platform and services
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How does ClearFund ensure the security of my funds?",
                answer: "We use bank-level encryption and blockchain technology to secure all transactions. Funds are held in escrow until project milestones are verified."
              },
              {
                question: "What fees does ClearFund charge?",
                answer: "We charge a small percentage fee on successful campaigns. There are no upfront fees to create a campaign."
              },
              {
                question: "How long does it take to receive funds?",
                answer: "Funds are typically released within 24-48 hours after milestone verification and approval."
              },
              {
                question: "Can I cancel my donation?",
                answer: "Yes, you can cancel your donation within 24 hours of making it, before the campaign ends."
              },
              {
                question: "What happens if a campaign doesn't reach its goal?",
                answer: "If a campaign doesn't reach its funding goal, all donations are automatically refunded to backers."
              },
              {
                question: "How do I report a suspicious campaign?",
                answer: "You can report suspicious activity through our support center or by emailing us directly at support@clearfund.com."
              }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold mb-8">
              Ready to Start Your Project?
            </h2>
            <p className="text-2xl mb-10 text-purple-100">
              Join thousands of creators who have successfully funded their ideas
            </p>
            <Link href="/create-campaign" className="bg-white text-purple-600 px-10 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow-lg">
              Start a Project
              <ArrowRightIcon className="ml-3 h-6 w-6" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
    </AuthGuard>
  );
}

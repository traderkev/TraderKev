import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Users,
  Trophy,
  MessageCircle,
  Calendar,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  Award,
  BarChart3,
  User,
  X,
  Menu,
  ChevronRight,
  ChevronDown,
  Youtube,
  MessageSquare,
  Clock,
  Shield,
  Rocket,
  Send,
  CreditCard,
  DollarSign,
  ArrowUp,
  LogOut,
  Video,
  BookOpen,
  Search,
  Phone,
  MapPin,
  Mail
} from 'lucide-react';
import { useAuth } from './useAuth';
import { PasswordResetModal } from './PasswordResetModal';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import emailjs from '@emailjs/browser';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz');

// Missing Components - Adding all referenced components
const MobileMenu = () => {
  return (
    <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 md:hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Navigation</h3>
        <nav className="space-y-2">
          <a href="#home" className="block py-2 text-gray-700 hover:text-blue-600">Home</a>
          <a href="#live-trading" className="block py-2 text-gray-700 hover:text-blue-600">Live Trading</a>
          <a href="#discord" className="block py-2 text-gray-700 hover:text-blue-600">Discord</a>
          <a href="#testimonials" className="block py-2 text-gray-700 hover:text-blue-600">Testimonials</a>
        </nav>
      </div>
    </div>
  );
};

const BlogPostModal = ({ blogPost, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{blogPost?.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: blogPost?.fullContent }}></div>
      </div>
    </div>
  );
};

// Stripe Payment Form Component
const PaymentForm = ({ onSuccess, onError, onClose, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ...customerInfo
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing (in real implementation, you'd call your backend)
      // For demo purposes, we'll assume payment is successful
      const paymentIntent = {
        id: 'pi_' + Math.random().toString(36).substr(2, 9),
        amount: 49700, // $497.00 in cents
        currency: 'usd',
        status: 'succeeded'
      };

      // Save payment record to Firestore
      const paymentData = {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        customerInfo: customerData,
        productInfo: {
          name: 'TraderKev Mentorship Program',
          description: 'Professional Trading Education & Mentorship',
          price: 497
        },
        paymentMethodId: paymentMethod.id,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'payments'), paymentData);
      console.log('Payment saved to Firestore with ID: ', docRef.id);

      // Send confirmation email
      await sendConfirmationEmail(customerData, paymentIntent);

      onSuccess({
        paymentIntent,
        customer: customerData,
        firestoreId: docRef.id
      });

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'An error occurred processing your payment');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendConfirmationEmail = async (customer, payment) => {
    try {
      const templateParams = {
        to_name: `${customer.firstName} ${customer.lastName}`,
        to_email: customer.email,
        payment_amount: '$497.00',
        payment_id: payment.id,
        course_name: 'TraderKev Mentorship Program'
      };

      await emailjs.send(
        'service_sbwdmq9',
        'template_fxxzwsa', // You'll need a payment confirmation template
        templateParams,
        'VigwdRl-HGU8A34Rg'
      );
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Complete Your Purchase</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800">TraderKev Mentorship Program</h4>
          <p className="text-blue-600">Professional Trading Education & Mentorship</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-2xl font-bold text-blue-800">$497.00</span>
            <span className="text-sm text-blue-600 line-through">$997.00</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={customerData.firstName}
                onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={customerData.lastName}
                onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={customerData.email}
              onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              required
              value={customerData.phone}
              onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
            <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2" size={16} />
                Pay $497.00
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Your payment is secured by Stripe. We never store your card details.
          </p>
        </form>
      </div>
    </div>
  );
};

const PaymentModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Choose Your Plan</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold">1-on-1 Mentoring</h4>
            <p className="text-gray-600">Personal guidance to prop firm success</p>
            <p className="text-2xl font-bold mt-2">$497/month</p>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateModal = ({ proof, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Trading Proof Certificate</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="text-center">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold">{proof?.firm}</h4>
          <p className="text-gray-600">{proof?.amount} Account</p>
          <p className="text-sm text-gray-500 mt-2">{proof?.status}</p>
          <p className="text-sm text-gray-500">Trader: {proof?.trader}</p>
        </div>
      </div>
    </div>
  );
};

const VideoPlayerModal = ({ videoUrl, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <Play className="h-16 w-16 text-gray-400" />
          <p className="ml-4 text-gray-600">Video Player: {videoUrl}</p>
        </div>
      </div>
    </div>
  );
};

const LiveChat = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

const PayoutsBanner = () => {
  return (
    <div className="bg-green-600 text-white py-4 text-center">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold mb-2">🎉 Recent Student Payouts</h3>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span>Mike J. - $8,500</span>
          <span>Sarah C. - $12,300</span>
          <span>Alex R. - $6,750</span>
          <span>Emma W. - $15,200</span>
        </div>
      </div>
    </div>
  );
};

// Calendar Modal Component for multiple calendar options
const CalendarModal = ({ onClose }) => {
  // Handle escape key press
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const createCalendarEvent = (provider) => {
    const eventDetails = {
      title: 'TraderKev Live Trading Session',
      startDate: new Date(),
      startTime: '09:30',
      endTime: '11:30',
      description: 'Join TraderKev for live futures trading session. Watch expert analysis and real money trades on E-mini futures, NQ, ES, and more.',
      location: 'https://youtube.com/@traderkev',
      timezone: 'America/New_York'
    };

    // Set to next trading day (Monday-Friday)
    const tomorrow = new Date(eventDetails.startDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const startDateTime = `${year}${month}${day}T133000Z`; // 9:30 AM EST
    const endDateTime = `${year}${month}${day}T153000Z`;   // 11:30 AM EST

    switch (provider) {
      case 'google':
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}&recur=RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR`;
        window.open(googleUrl, '_blank');
        break;
      
      case 'outlook':
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=${year}-${month}-${day}T13:30:00.000Z&enddt=${year}-${month}-${day}T15:30:00.000Z&body=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        window.open(outlookUrl, '_blank');
        break;
      
      case 'apple':
        // Create ICS file for Apple Calendar
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TraderKev//Trading Reminder//EN
BEGIN:VEVENT
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR
END:VEVENT
END:VCALENDAR`;
        
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'traderkev-live-session.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      
      case 'yahoo':
        const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(eventDetails.title)}&st=${year}${month}${day}T133000Z&dur=0200&desc=${encodeURIComponent(eventDetails.description)}&in_loc=${encodeURIComponent(eventDetails.location)}`;
        window.open(yahooUrl, '_blank');
        break;
    }
    
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Add to Calendar</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
            type="button"
          >
            <X size={24} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Set a daily reminder for TraderKev's live trading sessions (Mon-Fri, 9:30-11:30 AM EST)
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => createCalendarEvent('google')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📅</span>
            <span>Google Calendar</span>
          </button>
          
          <button
            onClick={() => createCalendarEvent('outlook')}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📅</span>
            <span>Outlook Calendar</span>
          </button>
          
          <button
            onClick={() => createCalendarEvent('apple')}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📅</span>
            <span>Apple Calendar</span>
          </button>
          
          <button
            onClick={() => createCalendarEvent('yahoo')}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📅</span>
            <span>Yahoo Calendar</span>
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          This will create a recurring reminder for weekdays only
        </p>
      </div>
    </div>
  );
};

const LoginComponent = ({ onLoginSuccess, initialSignUpMode = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(initialSignUpMode);
  const [localLoading, setLocalLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  // Additional signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [tradingExperience, setTradingExperience] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error } = useAuth();

  // Update isSignUp when initialSignUpMode changes
  useEffect(() => {
    setIsSignUp(initialSignUpMode);
  }, [initialSignUpMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    
    try {
      if (isSignUp) {
        // Validate password confirmation
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Validate required fields
        if (!firstName || !lastName || !username) {
          throw new Error('Please fill in all required fields (First Name, Last Name, Username)');
        }
        
        const userProfile = {
          firstName,
          lastName,
          username,
          phone,
          street,
          city,
          state,
          zipCode,
          country,
          dateOfBirth,
          tradingExperience,
          riskTolerance
        };
        
        const user = await signUpWithEmail(email, password, userProfile);
        // Show success message about email verification
        alert('Account created successfully! Please check your email for a verification link.');
        onLoginSuccess();
      } else {
        await signInWithEmail(email, password);
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Authentication error:', err);
      alert(err.message || 'An error occurred during authentication');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalLoading(true);
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  if (showPasswordReset) {
    return (
      <PasswordResetModal
        onClose={() => setShowPasswordReset(false)}
        onBackToLogin={() => setShowPasswordReset(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          {isSignUp ? 'Create Your TraderKev Account' : 'Login to Video Library'}
        </h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              {/* Personal Information Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={localLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={localLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={localLoading}
                      placeholder="Choose a unique username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trading Information Section */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Trading Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trading Experience Level</label>
                    <select
                      value={tradingExperience}
                      onChange={(e) => setTradingExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                    >
                      <option value="">Select Experience Level</option>
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="intermediate">Intermediate (1-3 years)</option>
                      <option value="advanced">Advanced (3-5 years)</option>
                      <option value="expert">Expert (5+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
                    <select
                      value={riskTolerance}
                      onChange={(e) => setRiskTolerance(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={localLoading}
                    >
                      <option value="">Select Risk Tolerance</option>
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Account Credentials Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {isSignUp ? 'Account Credentials' : 'Login Credentials'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={localLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={localLoading}
                  minLength={6}
                />
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                )}
              </div>
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={localLoading}
                    minLength={6}
                  />
                </div>
              )}
            </div>
          </div>
          
          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-blue-600 hover:text-blue-500"
                disabled={localLoading}
              >
                Forgot password?
              </button>
            </div>
          )}
          
          <button
            type="submit"
            disabled={localLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {localLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={localLoading}
            className="mt-3 w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className={`text-sm font-medium ${isSignUp ? 'text-blue-600 hover:text-blue-500' : 'text-green-600 hover:text-green-500'}`}
            disabled={localLoading}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one now!"}
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-green-800 mb-2">New to TraderKev?</h4>
              <p className="text-xs text-green-700 mb-3">Join thousands of successful traders and get access to:</p>
              <ul className="text-xs text-green-700 space-y-1 mb-3">
                <li>• Exclusive video library</li>
                <li>• Live trading sessions</li>
                <li>• 1-on-1 mentoring</li>
                <li>• Discord community</li>
              </ul>
              <button
                onClick={() => setIsSignUp(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                disabled={localLoading}
              >
                Create Free Account
              </button>
            </div>
          </div>
        )}

        {isSignUp && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">🚀 Ready to Join TraderKev?</h4>
              <p className="text-xs text-blue-700 mb-2">By creating an account, you'll get instant access to our community and resources. We'll never share your personal information.</p>
              <p className="text-xs text-gray-600">
                <span className="text-red-500">*</span> Required fields
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoLibraryComponent = ({ onLogout }) => {
  const { user } = useAuth();
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">TraderKev Video Library</h1>
            {user && (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">Welcome, {user.email}</p>
                {user.emailVerified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Verified
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Email Verification Banner */}
        {user && !user.emailVerified && showVerificationBanner && (
          <EmailVerificationBanner 
            user={user} 
            onDismiss={() => setShowVerificationBanner(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((video) => (
            <div key={video} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Trading Lesson {video}</h3>
                <p className="text-gray-600 text-sm">Learn advanced trading strategies and risk management techniques.</p>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TraderKevWebsite = () => {
  // Firebase Authentication Hook
  const { user, loading, logout } = useAuth();
  
  // State variables for controlling UI elements and their behavior
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // This will now control the Login PAGE, not a modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [callBookedMessage, setCallBookedMessage] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [contactFormMessage, setContactFormMessage] = useState('');
  const [isContactFormLoading, setIsContactFormLoading] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [isBlogPostModalOpen, setIsBlogPostModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProof, setSelectedProof] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // New states for search and filter functionality
  const [searchTermBlog, setSearchTermBlog] = useState('');
  const [searchTermFaq, setSearchTermFaq] = useState('');
  const [searchTermVideo, setSearchTermVideo] = useState('');
  const [filterFirmProof, setFilterFirmProof] = useState('All'); // New state for proofs filter
  const [reminderSetMessage, setReminderSetMessage] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // New state for handling page routing (landing, login, videoLibrary)
  const [currentPage, setCurrentPage] = useState('landing');
  const [showOnboardingMessage, setShowOnboardingMessage] = useState(true); // For guided onboarding
  const [showSignupForm, setShowSignupForm] = useState(false); // To control whether to show signup or login form

  // Authentication state derived from Firebase
  const isLoggedIn = !!user;

  // Refs for managing focus, crucial for accessibility (A11y) in modals and scroll animations
  const loginModalRef = useRef(null); // Still used for the LoginComponent's initial focus
  const loginButtonRef = useRef(null);
  const calendarModalRef = useRef(null);
  const blogPostModalRef = useRef(null);
  const paymentModalRef = useRef(null);
  const certificateModalRef = useRef(null);
  const videoPlayerModalRef = useRef(null); // Declared here, accessible globally in TraderKevWebsite

  // Refs for section visibility for scroll-triggered animations
  const sectionRefs = useRef({});

  // Payment handlers
  const handlePaymentSuccess = (paymentResult) => {
    setPaymentData(paymentResult);
    setPaymentSuccess(true);
    setIsPaymentModalOpen(false);
    
    // Show success message
    alert(`Payment successful! Payment ID: ${paymentResult.paymentIntent.id}`);
    
    // You could redirect to a success page or show a success modal here
    console.log('Payment successful:', paymentResult);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // Error is already handled in the PaymentForm component
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
  
  const setSectionRef = useCallback((node, id) => {
    if (node) {
      sectionRefs.current[id] = node;
    } else {
      delete sectionRefs.current[id];
    }
  }, []);

  // Data array for the "What Our Students Say" (Testimonials) section
  const testimonials = [
    {
      id: 1,
      quote: "TraderKev's mentoring transformed my trading. I passed my TakeProfit Trader challenge in 2 months!",
      author: "Jessica L.",
      firm: "TakeProfit Trader Funded Trader",
      avatar: "https://placehold.co/100x100/FFD700/FFFFFF?text=JL",
      rating: 5
    },
    {
      id: 2,
      quote: "The live trading sessions are invaluable. Seeing Kev trade in real-time taught me more than years of self-study.",
      author: "Mark P.",
      firm: "Discord Member",
      avatar: "https://placehold.co/100x100/C0C0C0/FFFFFF?text=MP",
      rating: 4
    },
    {
      id: 3,
    quote: "I finally understand risk management thanks to this program. Highly recommend for any aspiring prop trader.",
      author: "Sarah K.",
      firm: "Apex Trader",
      avatar: "https://placehold.co/100x100/ADFF2F/FFFFFF?text=SK",
      rating: 5
    },
    {
      id: 4,
      quote: "The community support is amazing. Everyone is helpful and focused on success.",
      author: "David R.",
      firm: "Community Member",
      avatar: "https://placehold.co/100x100/87CEEB/FFFFFF?text=DR",
      rating: 5
    },
    {
      id: 5,
      quote: "The strategies are clear and actionable. I've seen consistent profits since joining!",
      author: "Emily T.",
      firm: "Funded Trader",
      avatar: "https://placehold.co/100x100/FF6347/FFFFFF?text=ET",
      rating: 5
    },
    {
      id: 6,
      quote: "Best investment I've made in my trading career. The personal attention is unmatched.",
      author: "Chris V.",
      firm: "Aspiring Trader",
      avatar: "https://placehold.co/100x100/DA70D6/FFFFFF?text=CV",
      rating: 5
    }
  ];

  // useEffect hook to handle scroll events for UI updates (sticky header, scroll-to-top button, and scroll progress)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setScrollProgress((currentScroll / totalHeight) * 100);
      } else {
        setScrollProgress(0);
      }

      if (currentPage === 'landing') {
        const sections = ['home', 'live-trading', 'discord', 'testimonials', 'mentoring', 'proofs', 'payouts', 'blog', 'faq', 'about', 'contact'];
        let currentActive = 'home';
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
              currentActive = sections[i];
              break;
            }
          }
        }
        setActiveSection(currentActive);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // useEffect hook to manage focus when the login page opens or closes
  useEffect(() => {
    if (currentPage === 'login' && loginModalRef.current) {
      loginButtonRef.current = document.activeElement;
      const firstFocusableElement = loginModalRef.current.querySelector('input, button');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    } else if (currentPage !== 'login' && loginButtonRef.current) {
      if (loginButtonRef.current) {
        loginButtonRef.current.focus();
      }
    }
  }, [currentPage]);

  // Separate useEffect for calendar modal focus
  useEffect(() => {
    if (isCalendarModalOpen && calendarModalRef.current) {
      const previouslyFocusedElement = document.activeElement;
      const firstFocusableElement = calendarModalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
      return () => {
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [isCalendarModalOpen]);

  // Separate useEffect for blog post modal focus
  useEffect(() => {
    if (isBlogPostModalOpen && blogPostModalRef.current) {
      const previouslyFocusedElement = document.activeElement;
      const firstFocusableElement = blogPostModalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
      return () => {
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [isBlogPostModalOpen]);

  // Separate useEffect for payment modal focus
  useEffect(() => {
    if (isPaymentModalOpen && paymentModalRef.current) {
      const previouslyFocusedElement = document.activeElement;
      const firstFocusableElement = paymentModalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
      return () => {
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [isPaymentModalOpen]);

  // Separate useEffect for certificate modal focus
  useEffect(() => {
    if (isCertificateModalOpen && certificateModalRef.current) {
      const previouslyFocusedElement = document.activeElement;
      const firstFocusableElement = certificateModalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
      return () => {
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [isCertificateModalOpen]);

  // New useEffect for video player modal focus
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (selectedVideo && videoPlayerModalRef.current) {
      const previouslyFocusedElement = document.activeElement;
      const firstFocusableElement = videoPlayerModalRef.current.querySelector('button, [href], iframe, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
      return () => {
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [selectedVideo]);


  // Data array for the "Verified Trading Proofs" section
  const proofs = [
    { id: 1, firm: "TakeProfit Trader", amount: "$100K", status: "Passed Phase 1 & 2", trader: "John D." },
    { id: 2, firm: "Apex", amount: "$200K", status: "Funded Account", trader: "Jane S." },
    { id: 3, firm: "Bulenox", amount: "$50K", status: "Instant Funding", trader: "Mike R." },
    { id: 4, firm: "TopstepTrader", amount: "$150K", status: "Funded Trader", trader: "Sarah L." },
    { id: 5, firm: "TakeProfit Trader", amount: "$50K", status: "Passed Phase 1", trader: "Chris P." },
    { id: 6, firm: "Apex", amount: "$100K", status: "Funded Account", trader: "Emily B." },
    { id: 7, firm: "Bulenox", amount: "$20K", status: "Instant Funding", trader: "David W." },
    { id: 8, firm: "TopstepTrader", amount: "$100K", status: "Funded Trader", trader: "Olivia M." }
  ];

  // Data array for the "Student Payouts" section
  const initialPayouts = [
    { trader: "Mike Johnson", amount: 8500, firm: "TakeProfit Trader", date: "Jan 2025" },
    { trader: "Sarah Chen", amount: 12300, firm: "Apex", date: "Jan 2025" },
    { trader: "Alex Rodriguez", amount: 6750, firm: "Bulenox", date: "Dec 2024" },
    { trader: "Emma Wilson", amount: 15200, firm: "TopstepTrader", date: "Dec 2024" },
    { trader: "David Kumar", amount: 9800, firm: "TakeProfit Trader", date: "Nov 2024" },
    { trader: "Lisa Park", amount: 11400, firm: "Apex", date: "Nov 2024" },
    { trader: "Kevin Lee", amount: 7200, firm: "Bulenox", date: "Oct 2024" },
    { trader: "Jessica Brown", amount: 10500, firm: "TopstepTrader", date: "Oct 2024" },
    { trader: "Daniel Green", amount: 9100, firm: "TakeProfit Trader", date: "Sep 2024" },
    { trader: "Sophia White", amount: 13000, firm: "Apex", date: "Sep 2024" },
  ];

  const [payouts, setPayouts] = useState(initialPayouts);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  // Function to sort payouts
  const sortPayouts = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedArray = [...payouts].sort((a, b) => {
      if (key === 'amount') {
        return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
      } else {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
    });
    setPayouts(sortedArray);
    setSortConfig({ key, direction });
  };


  // Data array for the "Trading Education Blog" section
  const blogPosts = [
    {
      id: 1,
      title: "5 Essential Risk Management Rules for Futures Trading",
      excerpt: "Learn the fundamental risk management principles that separate successful traders from failures...",
      date: "Jan 15, 2025",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      fullContent: `
        <p>Risk management is the cornerstone of successful futures trading. Without a robust risk management plan, even the most profitable strategies can lead to significant losses. Here are 5 essential rules every futures trader should live by:</p>
        <ol class="list-decimal list-inside space-y-2 mt-4">
          <li><strong>Define Your Maximum Loss Per Trade:</strong> Before entering any trade, know exactly how much you are willing to lose. This should be a small percentage of your total trading capital (e.g., 0.5% to 1%).</li>
          <li><strong>Use Stop-Loss Orders Religiously:</strong> Always place a stop-loss order immediately after entering a trade. This automates your exit if the market moves against you, preventing emotional decisions and limiting losses.</li>
          <li><strong>Determine Your Risk-to-Reward Ratio:</strong> Aim for trades where your potential profit is significantly greater than your potential loss (e.g., 1:2 or 1:3 risk-to-reward ratio). This means for every $1 you risk, you aim to make $2 or $3.</li>
          <li><strong>Never Overleverage:</strong> Futures markets offer high leverage, but this is a double-edged sword. Use leverage cautiously and never trade with more capital than you can comfortably afford to lose.</li>
          <li><strong>Protect Your Capital:</strong> Once you've made a profit, consider moving your stop-loss to breakeven or trailing it to lock in gains. The goal is to protect your accumulated capital at all costs.</li>
        </ol>
        <p class="mt-4">Adhering to these rules will not only protect your capital but also instill the discipline necessary for long-term success in the volatile futures market.</p>
      `
    },
    {
      id: 2,
      title: "How to Pass TakeProfit Trader Challenge: Complete Guide",
      excerpt: "Step-by-step strategy to successfully pass Phase 1 and 2 of the TakeProfit Trader evaluation process...",
      date: "Jan 10, 2025",
      image: "https://images.unsplash.com/photo-1642790595397-7047dc98fa72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      fullContent: `
        <p>The TakeProfit Trader Challenge is a popular hurdle for aspiring funded traders. Passing it requires a disciplined approach, adherence to rules, and a solid trading strategy. Here's a comprehensive guide to help you succeed:</p>
        <h4 class="text-lg font-semibold mt-4 mb-2">Phase 1: The TakeProfit Trader Challenge</h4>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Profit Target:</strong> Understand your profit target (e.g., 10% of initial capital). Focus on consistent, small gains rather than large, risky trades.</li>
          <li><strong>Maximum Daily Loss:</strong> Strictly adhere to the maximum daily loss limit (e.g., 5%). One bad day can end your challenge.</li>
          <li><strong>Maximum Loss:</strong> Respect the overall maximum loss limit (e.g., 10%). This is your ultimate safety net.</li>
          <li><strong>Trading Days:</strong> Meet the minimum trading days requirement (e.g., 10 days). Don't rush; take quality trades.</li>
          <li><strong>Consistency Rule:</strong> TakeProfit Trader has a consistency rule to prevent "gambling." Ensure your trading results are consistent day-to-day.</li>
        </ul>
        <h4 class="text-lg font-semibold mt-4 mb-2">Phase 2: The Verification</h4>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Reduced Profit Target:</strong> The profit target is usually lower in Phase 2 (e.g., 5%). This makes it easier to achieve.</li>
          <li><strong>Same Rules Apply:</strong> All other rules (daily loss, maximum loss, trading days, consistency) remain the same. Continue with the disciplined approach that got you through Phase 1.</li>
        </ul>
        <p class="mt-4">Key strategies include focusing on high-probability setups, meticulous risk management, and maintaining emotional control. Review your trades daily and learn from both wins and losses.</p>
      `
    },
    {
      id: 3,
      title: "E-mini S&P 500 Trading Strategies That Work",
      excerpt: "Discover proven intraday strategies for trading the most liquid futures contract in the world...",
      date: "Jan 5, 2025",
      image: "https://images.unsplash.com/photo-1551288049-bebdae38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      fullContent: `
        <p>The E-mini S&P 500 (ES) futures contract is one of the most liquid and actively traded instruments globally. Its popularity stems from its efficiency and reflection of the broader U.S. stock market. Here are some intraday trading strategies that have proven effective:</p>
        <h4 class="text-lg font-semibold mt-4 mb-2">1. Opening Range Breakout (ORB)</h4>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Concept:</strong> Trade the breakout of the first 30-60 minute range after the market open.</li>
          <li><strong>Execution:</strong> Identify the high and low of this initial range. Enter a long position if price breaks above the high, or a short position if it breaks below the low.</li>
          <li><strong>Considerations:</strong> Use volume confirmation. Place stop-loss outside the range.</li>
        </ul>
        <h4 class="text-lg font-semibold mt-4 mb-2">2. Trend Following with Moving Averages</h4>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Concept:</strong> Identify the prevailing intraday trend and enter trades in that direction.</li>
          <li><strong>Execution:</strong> Use multiple moving averages (e.g., 9-period and 20-period EMA). Look for price action to pull back to the moving averages in an uptrend (for longs) or downtrend (for shorts).</li>
          <li><strong>Considerations:</strong> Confirm with other indicators like MACD or RSI. Avoid choppy markets.</li>
        </ul>
        <h4 class="text-lg font-semibold mt-4 mb-2">3. Support and Resistance Trading</h4>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Concept:</strong> Identify key price levels where the market has historically reversed or consolidated.</li>
          <li><strong>Execution:</strong> Buy at strong support levels and sell at strong resistance levels. Alternatively, trade breakouts of these levels.</li>
          <li><strong>Considerations:</strong> Look for multiple touches of a level to confirm its strength. Manage risk tightly, as false breakouts are common.</li>
        </ul>
        <p class="mt-4">Regardless of the strategy, strict risk management, position sizing, and emotional discipline are paramount for success in E-mini S&P 500 trading.</p>
      `
    }
  ];

  // Data array for the "Frequently Asked Questions" section
  const faqs = [
    {
      question: "What makes your training different from other trading courses?",
      answer: "Our program focuses exclusively on futures trading and prop firm challenges. With a 90% pass rate and over $2M in student funding, we provide proven strategies, 1-on-1 mentoring, and real-time support through our Discord community."
    },
    {
      question: "How long does it take to get funded?",
      answer: "Most of our students achieve funding within 3-6 months. However, results vary based on individual dedication, practice time, and adherence to our proven strategies. Some students have been funded in as little as 4-6 weeks."
    },
    {
      question: "Do you guarantee I'll pass the prop firm challenge?",
      answer: "While we can't guarantee results (trading involves risk), we offer a money-back guarantee if you don't pass after completing our full mentoring program and following our guidelines. Our 90% success rate speaks for itself."
    },
    {
      question: "What prop firms do you help with?",
      answer: "We specialize in the top prop firms including TakeProfit Trader, Apex, Bulenox, TopstepTrader, and others. Our strategies are adaptable to different firm requirements and rules."
    },
    {
      question: "Can beginners join your program?",
      answer: "Absolutely! We welcome traders of all levels. Our 1-on-1 mentoring is customized to your experience level, and we start with fundamentals before advancing to complex strategies."
    },
    {
      question: "What's included in the 1-on-1 mentoring?",
      answer: "Weekly 1-hour sessions, personalized trading plan, risk management strategies, psychology coaching, trade review sessions, 24/7 Discord access, and lifetime support even after you're funded."
    }
  ];

  // Function to toggle the visibility of an FAQ answer in the accordion
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Function to smoothly scroll the window to the top of the page
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Handler for the "Book Free Call" button
  const handleBookCall = useCallback(() => {
    setIsCalendarModalOpen(true);
  }, []);

  // Handler for "Set Reminder" button
  const handleSetReminder = useCallback(() => {
    setShowCalendarModal(true);
  }, []);

  // VideoLibraryComponent: The client's private video content area
  const VideoLibraryComponent = ({ onLogout }) => {
    const videos = [
      { id: 1, title: "Daily Market Analysis - Jan 2025", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
      { id: 2, title: "Risk Management Masterclass - Part 1", url: "https://www.youtube.com/embed/VIDEO_ID_2", thumbnail: "https://placehold.co/320x180/FF0000/FFFFFF?text=Video+2" },
      { id: 3, title: "Advanced Futures Strategies", url: "https://www.youtube.com/embed/VIDEO_ID_3", thumbnail: "https://placehold.co/320x180/00FF00/000000?text=Video+3" },
      { id: 4, title: "Trading Psychology Deep Dive", url: "https://www.youtube.com/embed/VIDEO_ID_4", thumbnail: "https://placehold.co/320x180/0000FF/FFFFFF?text=Video+4" },
      { id: 5, title: "Weekly Live Trading Recap - Jan 19", url: "https://www.youtube.com/embed/VIDEO_ID_5", thumbnail: "https://placehold.co/320x180/FFFF00/000000?text=Video+5" },
      { id: 6, title: "Prop Firm Challenge Tips", url: "https://www.youtube.com/embed/VIDEO_ID_6", thumbnail: "https://placehold.co/320x180/FF00FF/FFFFFF?text=Video+6" },
    ];

    const [currentVideo, setCurrentVideo] = useState(null);
    const [isVideoPlayerModalOpen, setIsVideoPlayerModalOpen] = useState(false);

    const filteredVideos = videos.filter(video =>
      video.title.toLowerCase().includes(searchTermVideo.toLowerCase())
    );

    const openVideoPlayer = (video) => {
      setSelectedVideo(video);
      setIsVideoPlayerModalOpen(true);
    };

    const closeVideoPlayer = () => {
      setSelectedVideo(null);
      setIsVideoPlayerModalOpen(false);
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900">Video Library</h1>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>

          {showOnboardingMessage && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg" role="alert">
              <p className="font-bold">Welcome to your dashboard!</p>
              <p>Here you'll find exclusive videos and content to help you on your trading journey.</p>
              <button onClick={() => setShowOnboardingMessage(false)} className="mt-2 text-sm text-blue-800 underline">Dismiss</button>
            </div>
          )}

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              value={searchTermVideo}
              onChange={(e) => setSearchTermVideo(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
                onClick={() => openVideoPlayer(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/320x180/E0E0E0/333333?text=Video+Thumbnail`; }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Click to watch</p>
                </div>
              </div>
            ))}
            {filteredVideos.length === 0 && (
              <p className="col-span-full text-center text-gray-600">No videos found matching your search.</p>
            )}
          </div>
        </div>
        {isVideoPlayerModalOpen && selectedVideo && (
          <VideoPlayerModal videoUrl={selectedVideo.url} title={selectedVideo.title} onClose={closeVideoPlayer} />
        )}
      </div>
    );
  };

  // VideoPlayerModal Component: Plays the selected video in a modal
  const VideoPlayerModal = ({ videoUrl, title, onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, []);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
        <div ref={modalRef} className="bg-white rounded-lg p-4 m-4 max-w-4xl w-full shadow-2xl relative" role="dialog" aria-modal="true" aria-labelledby="video-modal-title" tabIndex="-1">
          <div className="flex justify-between items-center mb-4">
            <h2 id="video-modal-title" className="text-xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1" aria-label="Close video player">
              <X size={24} />
            </button>
          </div>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <iframe
              className="w-full h-full rounded-lg"
              src={videoUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="text-right">
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };


  // CalendarModal Component: For selecting date and time for a call
  const CalendarModal = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [errors, setErrors] = useState({});

    const validateBooking = () => {
      let newErrors = {};
      if (!selectedDate) {
        newErrors.date = 'Please select a date.';
      }
      if (!selectedTime) {
        newErrors.time = 'Please select a time.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleConfirmBooking = (e) => {
      e.preventDefault();
      if (validateBooking()) {
        setIsCalendarModalOpen(false);
        setCallBookedMessage(true);
        setTimeout(() => setCallBookedMessage(false), 3000);
        console.log(`Call booked for ${selectedDate} at ${selectedTime}`);
      }
    };

    // Generate time options (e.g., every 30 minutes from 9:00 AM to 5:00 PM)
    const generateTimeOptions = () => {
      const times = [];
      for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
          const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
          times.push(`${hourStr}:${minuteStr}`);
        }
      }
      return times;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div ref={calendarModalRef} className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl relative" role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title">
          <div className="flex justify-between items-center mb-6">
            <h2 id="calendar-modal-title" className="text-2xl font-bold">Book Your Free Call</h2>
            <button onClick={() => setIsCalendarModalOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1" aria-label="Close calendar modal">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                id="booking-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full p-3 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                aria-invalid={errors.date ? "true" : "false"}
                aria-describedby={errors.date ? "date-error" : undefined}
              />
              {errors.date && <p id="date-error" className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="booking-time" className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <select
                id="booking-time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={`w-full p-3 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                aria-invalid={errors.time ? "true" : "false"}
                aria-describedby={errors.time ? "time-error" : undefined}
              >
                <option value="">-- Select a time --</option>
                {generateTimeOptions().map((time, index) => (
                  <option key={index} value={time}>{time} EST</option>
                ))}
              </select>
              {errors.time && <p id="time-error" className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    );
  };

  // BlogPostModal Component: Displays full blog post content
  const BlogPostModal = ({ blogPost, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div ref={blogPostModalRef} className="bg-white rounded-lg p-8 m-4 max-w-3xl w-full shadow-2xl relative" role="dialog" aria-modal="true" aria-labelledby="blog-post-modal-title">
          <div className="flex justify-between items-center mb-6">
            <h2 id="blog-post-modal-title" className="text-2xl font-bold text-gray-800">{blogPost.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1" aria-label="Close blog post">
              <X size={24} />
            </button>
          </div>
          <div className="text-sm text-gray-500 mb-4">{blogPost.date}</div>
          <img
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x400/E0E0E0/333333?text=Blog+Post`; }}
          />
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: blogPost.fullContent }}></div>
          <div className="mt-8 text-right">
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // PaymentModal Component: For inputting payment information
  const PaymentModal = ({ onClose }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [cardName, setCardName] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState('');

    const validateCard = () => {
      let newErrors = {};
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number.';
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Invalid expiry (MM/YY).';
      }
      if (!/^\d{3,4}$/.test(cardCVC)) {
        newErrors.cardCVC = 'Invalid CVC.';
      }
      if (cardName.trim() === '') {
        newErrors.cardName = 'Name is required.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handlePaymentSubmit = async (e) => {
      e.preventDefault();
      setPaymentMessage('');
      setIsLoading(true);

      if (paymentMethod === 'card') {
        if (!validateCard()) {
          setIsLoading(false);
          setPaymentMessage('Please correct the card details.');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentMessage('Payment successful! You will receive a confirmation email shortly.');
      } else if (paymentMethod === 'paypal') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPaymentMessage('Redirecting to PayPal for secure payment...');
      }

      setIsLoading(false);
      setTimeout(() => {
        setPaymentMessage('');
        onClose();
      }, 3000);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div ref={paymentModalRef} className="bg-white rounded-lg p-8 m-4 max-w-md w-full shadow-2xl relative" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
          <div className="flex justify-between items-center mb-6">
            <h2 id="payment-modal-title" className="text-2xl font-bold text-gray-800">Secure Your Spot</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1" aria-label="Close payment modal">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                <CreditCard size={20} />
                <span>Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                <DollarSign size={20} />
                <span>PayPal</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className={`w-full p-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength="19"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-2">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className={`w-full p-3 border ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                    </div>
                    <div className="flex-1">
                      <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                      <input
                        type="text"
                        id="cardCVC"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value)}
                        className={`w-full p-3 border ${errors.cardCVC ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="XXX"
                        maxLength="4"
                      />
                      {errors.cardCVC && <p className="text-red-500 text-sm mt-1">{errors.cardCVC}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={`w-full p-3 border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Full Name on Card"
                    />
                    {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                  </div>
                </>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <p className="text-gray-700 mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                  <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg" alt="PayPal Accepted" className="mx-auto w-48" />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Pay Now'}
              </button>
              {paymentMessage && (
                <p className={`mt-4 text-center text-sm animate-fade-in ${paymentMessage.includes('successful') || paymentMessage.includes('Redirecting') ? 'text-green-600' : 'text-red-500'}`}>
                  {paymentMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };


  // LiveChat Component: A floating live chat widget (Firebase removed)
  const LiveChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
      e.preventDefault();
      if (newMessage.trim() === '') return;

      const userMessage = {
        id: Date.now(),
        senderName: 'You',
        text: newMessage,
        timestamp: new Date(),
        role: 'user'
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage('');
      setIsAiTyping(true);

      try {
        const chatHistory = messages.slice(-5).map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }));
        chatHistory.push({ role: "user", parts: [{ text: userMessage.text }] });

        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const aiResponseText = result.candidates[0].content.parts[0].text;
          const aiMessage = {
            id: Date.now() + 1,
            senderName: 'TraderKev AI',
            text: aiResponseText,
            timestamp: new Date(),
            role: 'model'
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } else {
          console.error("AI response structure unexpected:", result);
          const errorMessage = {
            id: Date.now() + 1,
            senderName: 'TraderKev AI',
            text: "Sorry, I couldn't process that. Please really try again.",
            timestamp: new Date(),
            role: 'model'
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
      } catch (error) {
        console.error("Error sending message or calling AI:", error);
        const errorMessage = {
          id: Date.now() + 1,
          senderName: 'TraderKev AI',
          text: "An error occurred. Please check your network connection.",
          timestamp: new Date(),
          role: 'model'
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsAiTyping(false);
      }
    };

    return (
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isChatOpen ? 'w-80 h-96' : 'w-16 h-16'}`}>
        {isChatOpen ? (
          <div className="bg-white rounded-lg shadow-2xl border h-full flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">Live Support</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1" aria-label="Close chat window">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-3 ${msg.senderName === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-lg max-w-[80%] ${
                    msg.senderName === 'You'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="font-semibold text-sm mb-1">
                      {msg.senderName}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%] rounded-bl-none">
                    <p className="font-semibold text-sm mb-1">TraderKev AI</p>
                    <p className="text-sm animate-pulse">Typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Type your message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isAiTyping}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                  disabled={isAiTyping || newMessage.trim() === ''}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center animate-pulse"
            aria-label="Open live chat"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    );
  };

  // PayoutsBanner Component: Displays a sticky scrolling banner of latest payouts
  const PayoutsBanner = () => {
    // Duplicate payouts to ensure continuous scroll without gaps
    const duplicatedPayouts = [...payouts, ...payouts, ...payouts];

    return (
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-purple-700 to-pink-600 text-white py-2 overflow-hidden z-40 shadow-lg">
        <style>
          {`
          @keyframes scroll-payouts {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-payouts-infinite {
            animation: scroll-payouts 60s linear infinite;
          }
          `}
        </style>
        <div className="whitespace-nowrap inline-block animate-scroll-payouts-infinite">
          {duplicatedPayouts.map((payout, index) => (
            <span key={index} className="inline-block px-8 py-1 text-lg font-semibold">
              💰 {payout.trader} just received ${payout.amount.toLocaleString()} from {payout.firm}!
            </span>
          ))}
        </div>
      </div>
    );
  };

  // CertificateModal Component: Displays a simulated certificate
  const CertificateModal = ({ proof, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div ref={certificateModalRef} className="bg-white rounded-lg p-8 m-4 max-w-xl w-full shadow-2xl relative" role="dialog" aria-modal="true" aria-labelledby="certificate-modal-title">
          <div className="flex justify-between items-center mb-6">
            <h2 id="certificate-modal-title" className="text-2xl font-bold text-gray-800">Certificate of Completion</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1" aria-label="Close certificate">
              <X size={24} />
            </button>
          </div>
          <div className="text-center">
            <img
              src={`https://placehold.co/600x400/D4EDDA/155724?text=CERTIFICATE`}
              alt="Certificate of Completion"
              className="w-full object-cover rounded-lg mb-6"
            />
            <p className="text-lg text-gray-700 mb-2">This certifies that</p>
            <p className="text-3xl font-bold text-blue-600 mb-4">{proof.trader}</p>
            <p className="text-lg text-gray-700 mb-2">has successfully completed the challenge with</p>
            <p className="text-2xl font-bold text-green-600 mb-4">{proof.firm}</p>
            <p className="text-lg text-gray-700 mb-2">for the amount of</p>
            <p className="text-3xl font-bold text-purple-600 mb-6">{proof.amount}</p>
            <p className="text-md text-gray-600 italic">Status: {proof.status}</p>
          </div>
          <div className="mt-8 text-right">
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };


  // Main render logic based on currentPage
  const renderContent = () => {
    // Show loading spinner while Firebase is determining auth state
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'login':
        return <LoginComponent 
          onLoginSuccess={() => { setCurrentPage('videoLibrary'); setShowOnboardingMessage(true); }} 
          initialSignUpMode={showSignupForm}
        />;
      case 'videoLibrary':
        // Only allow access to video library if user is authenticated
        if (isLoggedIn) {
          return <VideoLibraryComponent onLogout={async () => { 
            await logout(); 
            setCurrentPage('landing'); 
            setShowOnboardingMessage(false); 
          }} />;
        } else {
          // Redirect to login if not authenticated
          setCurrentPage('login');
          return <LoginComponent 
            onLoginSuccess={() => { setCurrentPage('videoLibrary'); setShowOnboardingMessage(true); }} 
            initialSignUpMode={showSignupForm}
          />;
        }
      case 'landing':
      default:
        return (
          <>
            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 z-50" style={{ width: `${scrollProgress}%` }}></div>

            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 overflow-hidden relative">
              <div
                className="whitespace-nowrap text-lg font-bold inline-block animate-scroll-left-infinite"
              >
                <span className="inline-block px-8">🎯 Use Discount Code "TraderKev" for Exclusive Prop Firm Discounts! 🎯 Limited Time Offer! 🎯</span>
                <span className="inline-block px-8">🎯 Use Discount Code "TraderKev" for Exclusive Prop Firm Discounts! 🎯 Limited Time Offer! 🎯</span>
                <span className="inline-block px-8">🎯 Use Discount Code "TraderKev" for Exclusive Prop Firm Discounts! 🎯 Limited Time Offer! 🎯</span>
              </div>
            </div>

            <header className={`sticky top-0 z-40 transition-all duration-300 ${scrollY > 100 ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
              <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </motion.div>
                    <motion.span 
                      className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      TraderKev
                    </motion.span>
                  </motion.div>

                  <motion.div 
                    className="hidden md:flex items-center space-x-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    <motion.a 
                      href="#home" 
                      className={`hover:text-blue-600 transition-colors ${activeSection === 'home' ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Home
                    </motion.a>
                    <motion.a 
                      href="#live-trading" 
                      className={`hover:text-blue-600 transition-colors ${activeSection === 'live-trading' ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Live Trading
                    </motion.a>
                    <motion.a 
                      href="#discord" 
                      className={`hover:text-blue-600 transition-colors ${activeSection === 'discord' ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Discord
                    </motion.a>
                    <motion.a 
                      href="#mentoring" 
                      className={`hover:text-blue-600 transition-colors ${activeSection === 'mentoring' ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Mentoring
                    </motion.a>
                    <motion.a 
                      href="#blog" 
                      className={`hover:text-blue-600 transition-colors ${activeSection === 'blog' ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Blog
                    </motion.a>
                    <motion.a 
                      href="#faq" 
                      className={`hover:text-blue-600 transition-colors ${activeSection === 'faq' ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      FAQ
                    </motion.a>
                    <motion.a 
                      href="#contact" 
                      className={`hover:text-blue-600 transition-colors ${activeSection === 'contact' ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Contact
                    </motion.a>
                    {isLoggedIn ? (
                      <motion.button
                        onClick={async () => { 
                          await logout(); 
                          setCurrentPage('landing'); 
                        }}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </motion.button>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <motion.button
                          onClick={() => {
                            setShowSignupForm(true);
                            setCurrentPage('login');
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          Create Account
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setShowSignupForm(false);
                            setCurrentPage('login');
                          }}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ref={loginButtonRef}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <User size={20} />
                          <span>Login</span>
                        </motion.button>
                      </div>
                    )}
                  </motion.div>

                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                    aria-label="Open mobile menu"
                  >
                    <Menu size={24} />
                  </button>
                </div>
              </nav>
            </header>

            <section id="home" ref={node => setSectionRef(node, 'home')} className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 text-white py-20">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.h1 
                    className="text-5xl md:text-7xl font-bold mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                  >
                    Master Futures Trading
                  </motion.h1>
                  
                  <motion.p 
                    className="text-xl md:text-2xl mb-8 opacity-90"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 80,
                      damping: 12
                    }}
                  >
                    Get Funded by Top Prop Firms with Expert Training & 1-on-1 Mentoring
                  </motion.p>

                  <motion.div 
                    className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6,
                      delay: 0.4,
                      type: "spring",
                      stiffness: 120,
                      damping: 15
                    }}
                  >
                    <motion.a 
                      href="#live-trading" 
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Play size={24} />
                      <span>Live Trading - Daily 9:30 AM</span>
                    </motion.a>

                    <motion.a 
                      href="#discord" 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Users size={24} />
                      <span>Join Discord Community</span>
                    </motion.a>
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <motion.div 
                      className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6,
                        delay: 0.7,
                        type: "spring",
                        stiffness: 100,
                        damping: 12
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.9,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                      >
                        <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">Prop Firm Success</h3>
                      <p className="opacity-90">90% pass rate on funded challenges</p>
                    </motion.div>

                    <motion.div 
                      className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6,
                        delay: 0.8,
                        type: "spring",
                        stiffness: 100,
                        damping: 12
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          duration: 0.5,
                          delay: 1.0,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                      >
                        <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">Futures Specialist</h3>
                      <p className="opacity-90">Expert in E-mini & commodity futures</p>
                    </motion.div>

                    <motion.div 
                      className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6,
                        delay: 0.9,
                        type: "spring",
                        stiffness: 100,
                        damping: 12
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          duration: 0.5,
                          delay: 1.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                      >
                        <Star className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">1-on-1 Mentoring</h3>
                      <p className="opacity-90">Personal guidance to success</p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section id="live-trading" ref={node => setSectionRef(node, 'live-trading')} className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="animate-pulse mb-8">
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Play size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                      🔴 LIVE Trading Sessions
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                      Watch me trade live futures markets every morning at 9:30 AM EST
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Daily Schedule</h3>
                      <p className="opacity-90">Monday - Friday</p>
                      <p className="opacity-90">9:30 AM - 11:30 AM EST</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <BarChart3 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Real Money Trades</h3>
                      <p className="opacity-90">Live funded account trading</p>
                      <p className="opacity-90">$100K+ account sizes</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Live Commentary</h3>
                      <p className="opacity-90">Real-time trade analysis</p>
                      <p className="opacity-90">Risk management insights</p>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-semibold mb-6">🎯 What You'll Learn</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                      <li>• Live trade calls & alerts</li>
                      <li>• Market analysis & setups</li>
                      <li>• Trade review sessions</li>
                      <li>• Strategy discussions</li>
                    </ul>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <a
                      href="https://www.youtube.com/@Trader-kev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-red-600 px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <Youtube size={24} />
                      <span>WATCH LIVE ON YOUTUBE</span>
                    </a>

                    <button
                      onClick={handleSetReminder}
                      className="bg-yellow-500 text-black px-12 py-4 rounded-lg text-xl font-bold hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      🔔 SET REMINDER
                    </button>
                  </div>
                  <p className="mt-6 text-sm opacity-80">
                    📈 Average 15-25 trades per session | 🎯 70%+ win rate | 💰 $500-2000 daily targets
                  </p>
                </div>
              </div>
            </section>

            <section id="discord" ref={node => setSectionRef(node, 'discord')} className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 text-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={48} className="text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    🚀 Join Our Discord Community
                  </h2>
                  <p className="text-xl mb-12 opacity-90">
                    Connect with funded traders, share strategies, and get real-time support
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">2,500+</h3>
                      <p className="opacity-90">Active Members</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <MessageCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">24/7</h3>
                      <p className="opacity-90">Live Support</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Daily</h3>
                      <p className="opacity-90">Trade Alerts</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <Star className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">VIP</h3>
                      <p className="opacity-90">Access Included</p>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-semibold mb-6">🎯 What's Inside</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                      <li>• Live trade calls & alerts</li>
                      <li>• Market analysis & setups</li>
                      <li>• Trade review sessions</li>
                      <li>• Strategy discussions</li>
                    </ul>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <a
                      href="https://discord.gg/fntzK6gbsw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-purple-600 px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <MessageSquare size={24} />
                      <span>JOIN DISCORD NOW</span>
                    </a>

                    <button className="bg-yellow-500 text-black px-12 py-4 rounded-lg text-xl font-bold hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300">
                      🆓 FREE ACCESS
                    </button>
                  </div>

                  <p className="mt-6 text-sm opacity-80">
                    💬 1000+ messages daily | 🎯 Average response time: 5 minutes | 🏆 Top 1% trading community
                  </p>
                </div>
              </div>
            </section>

            {/* Redesigned Testimonials Section */}
            <section id="testimonials" ref={node => setSectionRef(node, 'testimonials')} className="py-20 bg-gray-100 animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    🌟 What Our Students Say
                  </h2>
                  <p className="text-xl text-gray-600 text-center mb-12">
                    Hear directly from those who transformed their trading journey
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-white rounded-lg shadow-xl p-6 text-center flex flex-col items-center hover:shadow-2xl transition-all transform hover:scale-105">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-500 shadow-md"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/CCCCCC/666666?text=${testimonial.author.split(' ').map(n => n[0]).join('')}`; }}
                        />
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-md italic text-gray-700 mb-4">
                          "{testimonial.quote}"
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          - {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.firm}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Call-to-Action after testimonials */}
                  <div className="mt-16 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      Ready to Transform Your Trading?
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                      Join over 5,000+ traders who have gained access to exclusive content and mentoring
                    </p>
                    <button
                      onClick={() => {
                        setShowSignupForm(true);
                        setCurrentPage('login');
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-5 rounded-xl text-xl font-bold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-300 mx-auto"
                    >
                      <User size={28} />
                      <span>Get Free Access - Start Today</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-teal-600 text-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar size={48} className="text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    📞 Book Your FREE Strategy Call
                  </h2>
                  <p className="text-xl mb-12 opacity-90">
                    30-minute consultation to create your personalized path to prop firm funding
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 transform hover:scale-105 transition-transform duration-200">
                      <Target className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Goal Assessment</h3>
                      <p className="opacity-90">Analyze your current trading level and define clear objectives</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 transform hover:scale-105 transition-transform duration-200">
                      <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Custom Strategy</h3>
                      <p className="opacity-90">Develop a personalized trading plan based on your risk tolerance</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 transform hover:scale-105 transition-transform duration-200">
                      <Rocket className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Fast-Track Plan</h3>
                      <p className="opacity-90">Create a timeline to reach your funding goals in 3-6 months</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold mb-4">⚡ Limited Availability</h3>
                    <p className="text-lg mb-4">Only 10 strategy calls available per week</p>
                    <p className="text-sm opacity-80">Book now to secure your spot - calls fill up fast!</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <button
                      onClick={handleBookCall}
                      className="bg-white text-green-600 px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <Calendar size={24} />
                      <span>BOOK FREE CALL NOW</span>
                    </button>

                    <button className="bg-yellow-500 text-black px-12 py-4 rounded-lg text-xl font-bold hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300">
                      💰 100% FREE
                    </button>
                  </div>

                  {callBookedMessage && (
                    <div className="mt-6 p-3 bg-green-500 text-white rounded-lg animate-fade-in">
                      Call booked successfully!
                    </div>
                  )}

                  <p className="mt-6 text-sm opacity-80">
                    📅 Available slots: Mon-Fri 2-6 PM EST | 🎯 Average call duration: 30 minutes | 🔥 No sales pressure
                  </p>
                </div>
              </div>
            </section>

            <section id="mentoring" ref={node => setSectionRef(node, 'mentoring')} className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">
                    🎯 Transform Your Trading with 1-on-1 Mentoring
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Get personalized guidance from a funded trader who's passed multiple prop firm challenges
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 transform hover:scale-105 transition-transform duration-200">
                      <Rocket className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-4">Accelerated Learning</h3>
                      <ul className="text-left space-y-2">
                        <li className="flex items-center space-x-2">
                          <CheckCircle size={20} className="text-green-400" />
                          <span>Personalized trading strategies</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle size={20} className="text-green-400" />
                          <span>Risk management techniques</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle size={20} className="text-green-400" />
                          <span>Psychology & discipline coaching</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 transform hover:scale-105 transition-transform duration-200">
                      <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-4">Proven Results</h3>
                      <ul className="text-left space-y-2">
                        <li className="flex items-center space-x-2">
                          <CheckCircle size={20} className="text-green-400" />
                          <span>90% student pass rate</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle size={20} className="text-green-400" />
                          <span>Average 3-month to funding</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle size={20} className="text-green-400" />
                          <span>Lifetime support included</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 30-Day Guarantee Highlight */}
                  <div className="bg-yellow-200 text-yellow-800 rounded-lg p-4 mb-8 font-bold text-xl animate-fade-in">
                    <p className="flex items-center justify-center space-x-2">
                      <CheckCircle size={24} className="text-yellow-700" />
                      <span>30-Day Guarantee to Get Funded!</span>
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-semibold mb-4">🔥 Limited Time Offer</h3>
                    <p className="text-3xl font-bold mb-2">$497 <span className="text-xl line-through opacity-60">$997</span></p>
                    <p className="text-lg mb-6">50% OFF - Only 5 Spots Available This Month!</p>

                    <motion.button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-4 rounded-lg text-xl font-bold transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(234, 179, 8, 0.3)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        y: [0, -3, 0],
                      }}
                      transition={{ 
                        y: {
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut"
                        },
                        hover: { type: "spring", stiffness: 300, damping: 20 },
                        tap: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                    >
                      🚀 SECURE YOUR SPOT NOW
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>Weekly 1-hour sessions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare size={16} />
                      <span>24/7 Discord access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award size={16} />
                      <span>Money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Enhanced Proofs Section */}
            <section id="proofs" ref={node => setSectionRef(node, 'proofs')} className="py-20 bg-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    🏆 Verified Trading Proofs
                  </h2>
                  <p className="text-xl text-gray-600 text-center mb-12">
                    Real results from real prop firm challenges
                  </p>

                  <div className="relative mb-8">
                    <label htmlFor="proof-filter" className="sr-only">Filter by Firm</label>
                    <select
                      id="proof-filter"
                      className="w-full md:w-auto p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      value={filterFirmProof}
                      onChange={(e) => setFilterFirmProof(e.target.value)}
                    >
                      <option value="All">All Firms</option>
                      <option value="TakeProfit Trader">TakeProfit Trader</option>
                      <option value="Apex">Apex</option>
                      <option value="Bulenox">Bulenox</option>
                      <option value="TopstepTrader">TopstepTrader</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2">Showing: {filterFirmProof} Proofs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {proofs.filter(proof => filterFirmProof === 'All' || proof.firm === filterFirmProof).map((proof) => (
                      <div
                        key={proof.id}
                        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                        onClick={() => {
                          setSelectedProof(proof);
                          setIsCertificateModalOpen(true);
                        }}
                      >
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{proof.firm}</h3>
                        <p className="text-2xl font-bold text-green-600 mb-2">{proof.amount}</p>
                        <p className="text-sm text-gray-600">{proof.status}</p>
                        <p className="text-xs text-gray-500 mt-1">Trader: {proof.trader}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-12">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      View All Verified Proofs
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Enhanced Payouts Section */}
            <section id="payouts" ref={node => setSectionRef(node, 'payouts')} className="py-20 bg-gray-50 animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    💰 Student Payouts
                  </h2>
                  <p className="text-xl text-gray-600 text-center mb-12">
                    Real payouts from our successful students
                  </p>

                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                          <tr>
                            <th className="px-6 py-4 text-left cursor-pointer hover:bg-blue-700 transition-colors" onClick={() => sortPayouts('trader')}>
                              Trader
                              {sortConfig.key === 'trader' && (
                                <span className="ml-2">
                                  {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                                </span>
                              )}
                            </th>
                            <th className="px-6 py-4 text-left cursor-pointer hover:bg-blue-700 transition-colors" onClick={() => sortPayouts('amount')}>
                              Amount
                              {sortConfig.key === 'amount' && (
                                <span className="ml-2">
                                  {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                                </span>
                              )}
                            </th>
                            <th className="px-6 py-4 text-left">Prop Firm</th>
                            <th className="px-6 py-4 text-left cursor-pointer hover:bg-blue-700 transition-colors" onClick={() => sortPayouts('date')}>
                              Date
                              {sortConfig.key === 'date' && (
                                <span className="ml-2">
                                  {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                                </span>
                              )}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {payouts.map((payout, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="px-6 py-4 font-semibold">{payout.trader}</td>
                              <td className="px-6 py-4 text-green-600 font-bold">${payout.amount.toLocaleString()}</td>
                              <td className="px-6 py-4">{payout.firm}</td>
                              <td className="px-6 py-4 text-gray-600">{payout.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="text-center mt-12">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      View All Payouts
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Blog Section: Displays recent blog posts */}
            <section id="blog" ref={node => setSectionRef(node, 'blog')} className="py-20 bg-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    📚 Trading Education Blog
                  </h2>
                  <p className="text-xl text-gray-600 text-center mb-12">
                    Learn from proven strategies, case studies, and expert insights
                  </p>

                  <div className="relative mb-8">
                    <input
                      type="text"
                      placeholder="Search blog posts..."
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      value={searchTermBlog}
                      onChange={(e) => setSearchTermBlog(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogPosts.filter(post =>
                      post.title.toLowerCase().includes(searchTermBlog.toLowerCase()) ||
                      post.excerpt.toLowerCase().includes(searchTermBlog.toLowerCase())
                    ).map((post) => (
                      <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/500x300/E0E0E0/333333?text=Blog+Post`; }}
                        />
                        <div className="p-6">
                          <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                          <h3 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          <button
                            onClick={() => {
                              setSelectedBlogPost(post);
                              setIsBlogPostModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <span>Read More</span>
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="faq" ref={node => setSectionRef(node, 'faq')} className="py-20 bg-gray-50 animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    ❓ Frequently Asked Questions
                  </h2>
                  <p className="text-xl text-gray-600 text-center mb-12">
                    Find answers to common questions about our program
                  </p>

                  <div className="relative mb-8">
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      value={searchTermFaq}
                      onChange={(e) => setSearchTermFaq(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>

                  <div className="space-y-4">
                    {faqs.filter(faq =>
                      faq.question.toLowerCase().includes(searchTermFaq.toLowerCase()) ||
                      faq.answer.toLowerCase().includes(searchTermFaq.toLowerCase())
                    ).map((faq, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <button
                          className="flex justify-between items-center w-full p-6 text-left font-semibold text-lg text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => toggleFaq(index)}
                          aria-expanded={openFaqIndex === index ? "true" : "false"}
                          aria-controls={`faq-answer-${index}`}
                        >
                          <span>{faq.question}</span>
                          {openFaqIndex === index ? <ChevronDown size={24} className="transform rotate-180 transition-transform duration-300" /> : <ChevronDown size={24} className="transition-transform duration-300" />}
                        </button>
                        <div
                          id={`faq-answer-${index}`}
                          className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}
                          aria-hidden={openFaqIndex === index ? "false" : "true"}
                        >
                          <p className="px-6 text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="about" ref={node => setSectionRef(node, 'about')} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  {/* Header */}
                  <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <motion.h2 
                      className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      Meet TraderKev
                    </motion.h2>
                    <motion.p 
                      className="text-xl text-gray-600 max-w-3xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      From zero to funded trader - discover the journey, expertise, and proven track record that makes TraderKev your trusted guide to trading success.
                    </motion.p>
                  </motion.div>

                  {/* Main Content Grid */}
                  <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left: Profile & Story */}
                    <motion.div 
                      className="space-y-8"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      {/* Profile Image */}
                      <div className="relative">
                        <motion.div 
                          className="relative overflow-hidden rounded-2xl shadow-2xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <img
                            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                            alt="Professional trader Kevin at work"
                            className="w-full h-96 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/640x640/E0E0E0/333333?text=TraderKev`; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-semibold text-gray-800">Currently Trading Live</span>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Floating Achievement Badges */}
                        <motion.div 
                          className="absolute -top-4 -right-4 bg-yellow-500 text-black p-3 rounded-full shadow-lg"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Trophy className="w-6 h-6" />
                        </motion.div>
                        <motion.div 
                          className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
                          animate={{ y: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                        >
                          <Target className="w-6 h-6" />
                        </motion.div>
                      </div>

                      {/* Quick Stats Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-blue-600">8+</div>
                          <div className="text-sm text-gray-600">Years Trading</div>
                        </motion.div>
                        <motion.div 
                          className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-green-600">$500K+</div>
                          <div className="text-sm text-gray-600">Funded Capital</div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Right: Detailed Story & Expertise */}
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      {/* Story */}
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">The Journey</h3>
                        <p className="text-gray-600 mb-4">
                          Started as a complete beginner with $500 and a dream. After countless hours of learning, 
                          backtesting, and refining strategies, I developed a systematic approach to futures trading 
                          that consistently generates profits.
                        </p>
                        <p className="text-gray-600">
                          Today, I manage multiple funded accounts and help traders worldwide achieve their funding 
                          goals through proven strategies and personalized mentoring.
                        </p>
                      </div>

                      {/* Specializations */}
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Trading Expertise</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700"><strong>E-mini S&P 500 (ES)</strong> - Primary focus with 70%+ win rate</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700"><strong>NASDAQ (NQ)</strong> - High volatility scalping specialist</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-700"><strong>Crude Oil (CL)</strong> - Commodity futures expert</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700"><strong>Risk Management</strong> - Maximum 1% risk per trade</span>
                          </div>
                        </div>
                      </div>

                      {/* Certifications & Achievements */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Achievements & Certifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700">FTMO $100K Challenge - Passed in 8 days</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700">MyForexFunds $200K Account - Currently trading</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700">TopStep $150K Combine - Multiple passes</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700">500+ Students Successfully Funded</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Statistics Section */}
                  <motion.div 
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Track Record & Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <AnimatedNumber target={500} suffix="+" className="text-3xl font-bold text-blue-600 mb-2" />
                        <div className="text-gray-600 font-medium">Students Mentored</div>
                        <div className="text-sm text-gray-500 mt-1">Worldwide community</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <AnimatedNumber target={90} suffix="%" className="text-3xl font-bold text-green-600 mb-2" />
                        <div className="text-gray-600 font-medium">Pass Rate</div>
                        <div className="text-sm text-gray-500 mt-1">Prop firm challenges</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="w-8 h-8 text-white" />
                        </div>
                        <AnimatedNumber target={2} prefix="$" suffix="M+" className="text-3xl font-bold text-purple-600 mb-2" />
                        <div className="text-gray-600 font-medium">Student Funding</div>
                        <div className="text-sm text-gray-500 mt-1">Total capital secured</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <AnimatedNumber target={75} suffix="%" className="text-3xl font-bold text-orange-600 mb-2" />
                        <div className="text-gray-600 font-medium">Win Rate</div>
                        <div className="text-sm text-gray-500 mt-1">Live trading average</div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Trading Philosophy */}
                  <motion.div 
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-green-500 p-8 rounded-2xl text-white">
                      <h3 className="text-2xl font-bold mb-4">Trading Philosophy</h3>
                      <p className="text-lg mb-4 opacity-90">
                        "Success in trading isn't about being right all the time - it's about managing risk, 
                        staying disciplined, and learning from every trade."
                      </p>
                      <p className="text-base opacity-80">
                        My approach focuses on consistent, profitable strategies rather than get-rich-quick schemes. 
                        Every student learns proper risk management before any advanced techniques.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section id="contact" ref={node => setSectionRef(node, 'contact')} className="py-20 bg-gradient-to-br from-blue-700 to-indigo-800 text-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                      ✉️ Get In Touch
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                      Have questions? Send us a message and we'll get back to you shortly.
                    </p>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Form */}
                    <div className="order-2 lg:order-1">
                      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 mb-8">
                        <h3 className="text-2xl font-bold mb-6 text-white">Send us a Message</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsContactFormLoading(true);
                            setContactFormMessage('');

                            const name = e.target.name.value;
                            const email = e.target['email-contact'].value;
                            const message = e.target.message.value;

                            if (!name || !email || !message) {
                                setContactFormMessage('Please fill in all fields.');
                                setIsContactFormLoading(false);
                                return;
                            }
                            if (!/\S+@\S+\.\S+/.test(email)) {
                                setContactFormMessage('Please enter a valid email address.');
                                setIsContactFormLoading(false);
                                return;
                            }

                            try {
                                // Simple EmailJS implementation with direct values
                                const serviceID = 'service_sbwdmq9';
                                const templateID = 'template_fxxzwsa';
                                const publicKey = 'VigwdRl-HGU8A34Rg';

                                console.log('Starting EmailJS send with config:', { serviceID, templateID });

                                // Initialize EmailJS
                                if (typeof emailjs !== 'undefined' && emailjs.init) {
                                    emailjs.init(publicKey);
                                }

                                // Simplified template parameters matching most common EmailJS formats
                                const templateParams = {
                                    user_name: name,
                                    user_email: email,
                                    user_message: message,
                                    to_name: 'TraderKev'
                                };

                                console.log('Template params:', templateParams);

                                // Send email using EmailJS with simplified error handling
                                await emailjs.send(serviceID, templateID, templateParams)
                                    .then((response) => {
                                        console.log('EmailJS SUCCESS!', response.status, response.text);
                                        setContactFormMessage('Your message has been sent successfully! We\'ll get back to you soon.');
                                        e.target.reset();
                                    })
                                    .catch((error) => {
                                        console.error('EmailJS FAILED...', error);
                                        
                                        // Try alternative template parameter format
                                        const altTemplateParams = {
                                            name: name,
                                            email: email,
                                            message: message,
                                            reply_to: email
                                        };
                                        
                                        console.log('Trying alternative template params:', altTemplateParams);
                                        
                                        return emailjs.send(serviceID, templateID, altTemplateParams);
                                    })
                                    .then((response) => {
                                        if (response) {
                                            console.log('Alternative format SUCCESS!', response.status, response.text);
                                            setContactFormMessage('Your message has been sent successfully! We\'ll get back to you soon.');
                                            e.target.reset();
                                        }
                                    })
                                    .catch((finalError) => {
                                        console.error('Both formats FAILED:', finalError);
                                        setContactFormMessage('Failed to send message. Please try contacting us directly.');
                                    });

                            } catch (error) {
                                console.error('Form submission error:', error);
                                setContactFormMessage('An error occurred while sending your message. Please try again later.');
                            } finally {
                                setIsContactFormLoading(false);
                                setTimeout(() => setContactFormMessage(''), 5000);
                            }
                        }} className="space-y-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Your Name</label>
                            <input type="text" id="name" name="name" className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/70" placeholder="John Doe" />
                          </div>
                          <div>
                            <label htmlFor="email-contact" className="block text-sm font-medium text-white mb-2">Your Email</label>
                            <input type="email" id="email-contact" name="email-contact" className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/70" placeholder="john.doe@example.com" />
                          </div>
                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-white mb-2">Your Message</label>
                            <textarea id="message" name="message" rows="5" className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/70" placeholder="I'd like to know more about..."></textarea>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-white text-blue-700 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isContactFormLoading}
                          >
                            {isContactFormLoading ? 'Sending...' : 'Send Message'}
                          </button>
                          {contactFormMessage && (
                            <p className={`mt-4 text-center text-sm animate-fade-in ${contactFormMessage.includes('successfully') ? 'text-green-300' : 'text-red-300'}`}>
                              {contactFormMessage}
                            </p>
                          )}
                        </form>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                        <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <Mail size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="text-white/80 text-sm">Email</p>
                              <p className="text-white font-medium">contact@traderkev.com</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <Phone size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="text-white/80 text-sm">Phone</p>
                              <p className="text-white font-medium">+1 (555) 123-4567</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <MapPin size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="text-white/80 text-sm">Location</p>
                              <p className="text-white font-medium">New York, NY</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <Clock size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="text-white/80 text-sm">Business Hours</p>
                              <p className="text-white font-medium">Mon-Fri: 9AM-6PM EST</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Interactive Map */}
                    <div className="order-1 lg:order-2">
                      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                        <h3 className="text-2xl font-bold mb-6 text-white">Our Location</h3>
                        <div className="relative">
                          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl" style={{height: '400px'}}>
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
                              width="100%"
                              height="100%"
                              style={{border: 0}}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="TraderKev Location Map"
                            ></iframe>
                          </div>
                          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            📍 Trading Hub
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/90 text-sm mb-2">
                            <strong>Financial District, New York</strong>
                          </p>
                          <p className="text-white/70 text-sm">
                            Located in the heart of the financial world, our trading operations center provides
                            real-time market access and professional trading education.
                          </p>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-white">24/7</div>
                            <div className="text-white/70 text-sm">Market Access</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-white">Live</div>
                            <div className="text-white/70 text-sm">Trading Floor</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">
                    Ready to Get Funded?
                  </h2>
                  <p className="text-xl mb-12 opacity-90">
                    Join thousands of successful traders who've achieved their funding goals
                  </p>

                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <a
                      href="https://www.youtube.com/@Trader-kev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-red-600 px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <Youtube size={24} />
                      <span>Watch Live Trading</span>
                    </a>

                    <a
                      href="https://discord.gg/fntzK6gbsw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <MessageSquare size={24} />
                      <span>Join Discord</span>
                    </a>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-green-300">
                      <Calendar size={24} />
                      <span>Book 1-on-1 Call</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <footer className="bg-gray-900 text-white py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="h-8 w-8 text-blue-400" />
                      <span className="text-2xl font-bold">TraderKev</span>
                    </div>
                    <p className="text-gray-400">
                      Master futures trading and get funded by top prop firms with expert guidance.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#home" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded">Home</a></li>
                      <li><a href="#about" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded">About</a></li>
                      <li><a href="#mentoring" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded">Mentoring</a></li>
                      <li><a href="#proofs" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded">Proofs</a></li>
                      <li><a href="#blog" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded">Blog</a></li>
                      <li><a href="#faq" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded">FAQ</a></li>
                      <li><a href="#contact" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded">Contact</a></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Services</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li>1-on-1 Mentoring</li>
                      <li>Live Trading Sessions</li>
                      <li>Discord Community</li>
                      <li>Prop Firm Challenges</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Contact</h4>
                    <p className="text-gray-400 mb-2">support@traderkev.com</p>
                    <p className="text-gray-400">Live Trading: Daily 9:30 AM EST</p>
                    <div className="flex space-x-4 mt-4">
                      <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full p-1">
                        <Youtube size={24} />
                      </a>
                      <a href="#" aria-label="Discord" className="text-gray-400 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full p-1">
                        <MessageSquare size={24} />
                      </a>
                      <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2 2.8-2.3 3.5-5.3 2.5-8C8.7 7.2 11.5 6 13 5c-1.7 1.2-4.4 2.5-6 2.5 3.5-2.6 4.9-5.7 7.5-7.5zm-2.4 2.4c-.6-.6-1.4-.9-2.2-.9s-1.6.3-2.2.9c-.6.6-.9 1.4-.9 2.2s.3 1.6.9 2.2c.6.6 1.4.9 2.2.9s1.6-.3 2.2-.9c.6-.6.9-1.4.9-2.2s-.3-1.6-.9-2.2z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; {new Date().getFullYear()} TraderKev. All rights reserved. Trading involves risk.</p>
                  <p className="text-xs mt-2">Disclaimer: Futures trading carries significant risk and is not suitable for all investors. Past performance is not indicative of future results.</p>
                </div>
              </div>
            </footer>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Global Styles */}
      <style>
        {`
        @import url('https://rsms.me/inter/inter.css');
        html { font-family: 'Inter', sans-serif; }
        @supports (font-variation-settings: normal) {
          html { font-family: 'Inter var', sans-serif; }
        }

        /* General fade-in-up animation for sections */
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        /* Specific slide-in-right for hero subtitle */
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
          animation-delay: 0.2s; /* Slight delay after title */
        }

        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll-left-infinite {
          animation: scroll-left 30s linear infinite;
        }

        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 5s ease-in-out infinite;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, padding 0.3s ease-out;
        }
        .faq-answer.open {
          max-height: 200px;
          padding-top: 1rem;
          padding-bottom: 1rem;
        }
        `}
      </style>

      {renderContent()}

      {/* Modals and floating components (always rendered on top) */}
      {showCalendarModal && (
        <CalendarModal 
          onClose={() => setShowCalendarModal(false)} 
        />
      )}
      {isBlogPostModalOpen && selectedBlogPost && (
        <BlogPostModal blogPost={selectedBlogPost} onClose={() => setIsBlogPostModalOpen(false)} />
      )}
      {isPaymentModalOpen && (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onClose={closePaymentModal}
            customerInfo={{}} // You can pre-fill with user data if available
          />
        </Elements>
      )}
      {isCertificateModalOpen && selectedProof && (
        <CertificateModal proof={selectedProof} onClose={() => setIsCertificateModalOpen(false)} />
      )}
      {selectedVideo && ( // Only render if a video is selected
        <VideoPlayerModal videoUrl={selectedVideo.url} title={selectedVideo.title} onClose={() => setSelectedVideo(null)} />
      )}
      <LiveChat />
      {/* Mobile Menu with overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}
      {isMenuOpen && <MobileMenu />}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 animate-fade-in focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Payouts Banner at the very bottom, always visible (only on landing page) */}
      {currentPage === 'landing' && <PayoutsBanner />}
    </div>
  );
};

// AnimatedNumber Component for counting up effect
const AnimatedNumber = ({ target, prefix = '', suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const duration = 1500;
      const increment = target / (duration / 10);

      const timer = setInterval(() => {
        start += increment;
        if (start < target) {
          setCount(Math.ceil(start));
        } else {
          setCount(target);
          clearInterval(timer);
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [target, isVisible]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default TraderKevWebsite;

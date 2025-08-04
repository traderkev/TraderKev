import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Search
} from 'lucide-react';

const TraderKevWebsite = () => {
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

  // New state for handling page routing (landing, login, videoLibrary)
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboardingMessage, setShowOnboardingMessage] = useState(true); // For guided onboarding

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
    setReminderSetMessage(true);
    setTimeout(() => setReminderSetMessage(false), 3000);
  }, []);

  // LoginComponent: The full login page
  const LoginComponent = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const loginPageRef = useRef(null);

    useEffect(() => {
      if (loginPageRef.current) {
        const firstInput = loginPageRef.current.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, []);

    const validateForm = () => {
      let newErrors = {};
      if (!email) {
        newErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email address is invalid.';
      }
      if (!password) {
        newErrors.password = 'Password is required.';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        if (email === 'user@example.com' && password === 'password123') {
          onLoginSuccess();
        } else {
          setErrors({ general: 'Invalid email or password.' });
        }
      }
    };

    return (
      <div ref={loginPageRef} className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Client Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your exclusive trading content.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm text-center">{errors.general}</p>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
    switch (currentPage) {
      case 'login':
        return <LoginComponent onLoginSuccess={() => { setIsLoggedIn(true); setCurrentPage('videoLibrary'); setShowOnboardingMessage(true); }} />;
      case 'videoLibrary':
        return <VideoLibraryComponent onLogout={() => { setIsLoggedIn(false); setCurrentPage('landing'); setShowOnboardingMessage(false); }} />;
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
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-200">
                      TraderKev
                    </span>
                  </div>

                  <div className="hidden md:flex items-center space-x-8">
                    <a href="#home" className={`hover:text-blue-600 transition-colors transform hover:-translate-y-0.5 ${activeSection === 'home' ? 'font-bold text-blue-600' : 'text-gray-700'}`}>Home</a>
                    <a href="#live-trading" className={`hover:text-blue-600 transition-colors transform hover:-translate-y-0.5 ${activeSection === 'live-trading' ? 'font-bold text-blue-600' : 'text-gray-700'}`}>Live Trading</a>
                    <a href="#discord" className={`hover:text-blue-600 transition-colors transform hover:-translate-y-0.5 ${activeSection === 'discord' ? 'font-bold text-blue-600' : 'text-gray-700'}`}>Discord</a>
                    <a href="#mentoring" className={`hover:text-blue-600 transition-colors transform hover:-translate-y-0.5 ${activeSection === 'mentoring' ? 'font-bold text-blue-600' : 'text-gray-700'}`}>Mentoring</a>
                    <a href="#blog" className={`hover:text-blue-600 transition-colors transform hover:-translate-y-0.5 ${activeSection === 'blog' ? 'font-bold text-blue-600' : 'text-gray-700'}`}>Blog</a>
                    <a href="#faq" className={`hover:text-blue-600 transition-colors transform hover:-translate-y-0.5 ${activeSection === 'faq' ? 'font-bold text-blue-600' : 'text-gray-700'}`}>FAQ</a>
                    <a href="#contact" className={`hover:text-blue-600 transition-colors transform hover:-translate-y-0.5 ${activeSection === 'contact' ? 'font-bold text-blue-600' : 'text-gray-700'}`}>Contact</a>
                    {isLoggedIn ? (
                      <button
                        onClick={() => { setIsLoggedIn(false); setCurrentPage('landing'); }}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentPage('login')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref={loginButtonRef}
                      >
                        <User size={20} />
                        <span>Client Login</span>
                      </button>
                    )}
                  </div>

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

            <section id="home" ref={node => setSectionRef(node, 'home')} className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 text-white py-20 animate-fade-in-up">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                    Master Futures Trading
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-in-right">
                    Get Funded by Top Prop Firms with Expert Training & 1-on-1 Mentoring
                  </p>

                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <a href="#live-trading" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300">
                      <Play size={24} />
                      <span>Live Trading - Daily 9:30 AM</span>
                    </a>

                    <a href="#discord" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300">
                      <Users size={24} />
                      <span>Join Discord Community</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Prop Firm Success</h3>
                      <p className="opacity-90">90% pass rate on funded challenges</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Futures Specialist</h3>
                      <p className="opacity-90">Expert in E-mini & commodity futures</p>
                    </div>

                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                      <Star className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">1-on-1 Mentoring</h3>
                      <p className="opacity-90">Personal guidance to success</p>
                    </div>
                  </div>
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
                  {reminderSetMessage && (
                    <div className="mt-6 p-3 bg-green-500 text-white rounded-lg animate-fade-in">
                      Reminder set successfully!
                    </div>
                  )}
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

                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      🚀 SECURE YOUR SPOT NOW
                    </button>
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

            <section id="about" ref={node => setSectionRef(node, 'about')} className="py-20 bg-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Professional trader at work"
                    className="w-64 h-64 rounded-full object-cover mb-8 shadow-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/640x640/E0E0E0/333333?text=TraderKev`; }}
                  />
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet TraderKev</h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Professional futures trader with 8+ years of experience. Specializing in E-mini S&P 500,
                    NASDAQ, and commodity futures. Successfully passed evaluations with multiple prop firms
                    and currently trading funded accounts totaling over $500K.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <AnimatedNumber target={500} suffix="+" className="text-3xl font-bold text-blue-600 mb-2" />
                      <div className="text-gray-600">Students Trained</div>
                    </div>
                    <div className="text-center">
                      <AnimatedNumber target={90} suffix="%" className="text-3xl font-bold text-green-600 mb-2" />
                      <div className="text-gray-600">Pass Rate</div>
                    </div>
                    <div className="text-center">
                      <AnimatedNumber target={2} prefix="$" suffix="M+" className="text-3xl font-bold text-purple-600 mb-2" />
                      <div className="text-gray-600">Students Funded</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="contact" ref={node => setSectionRef(node, 'contact')} className="py-20 bg-gradient-to-br from-blue-700 to-indigo-800 text-white animate-fade-in-up">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    ✉️ Get In Touch
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Have questions? Send us a message and we'll get back to you shortly.
                  </p>
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
                          const response = await fetch('/api/sendEmail', {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ name, email, message }),
                          });

                          const result = await response.json();

                          if (response.ok) {
                              setContactFormMessage('Your message has been sent successfully!');
                              e.target.reset();
                          } else {
                              setContactFormMessage(`Failed to send message: ${result.error || 'Unknown error'}`);
                          }
                      } catch (error) {
                          console.error('Error submitting contact form:', error);
                          setContactFormMessage('An error occurred while sending your message. Please try again later.');
                      } finally {
                          setIsContactFormLoading(false);
                          setTimeout(() => setContactFormMessage(''), 5000);
                      }
                  }} className="bg-white p-8 rounded-lg shadow-xl text-left space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input type="text" id="name" name="name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email-contact" className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                      <input type="email" id="email-contact" name="email-contact" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" placeholder="john.doe@example.com" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                      <textarea id="message" name="message" rows="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" placeholder="I'd like to know more about..."></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      {isCalendarModalOpen && <CalendarModal />}
      {isBlogPostModalOpen && selectedBlogPost && (
        <BlogPostModal blogPost={selectedBlogPost} onClose={() => setIsBlogPostModalOpen(false)} />
      )}
      {isPaymentModalOpen && (
        <PaymentModal onClose={() => setIsPaymentModalOpen(false)} />
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

// Missing Component Placeholders
const MobileMenu = () => {
  return (
    <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Menu</h3>
        <nav className="mt-4 space-y-2">
          <a href="#home" className="block py-2 text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="block py-2 text-gray-700 hover:text-blue-600">About</a>
          <a href="#services" className="block py-2 text-gray-700 hover:text-blue-600">Services</a>
          <a href="#contact" className="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
        </nav>
      </div>
    </div>
  );
};

const CalendarModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Schedule a Call</h3>
        <p>Calendar booking feature coming soon!</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Close
        </button>
      </div>
    </div>
  );
};

const BlogPostModal = ({ blogPost, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{blogPost?.title || 'Blog Post'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p>{blogPost?.content || 'Blog content coming soon!'}</p>
      </div>
    </div>
  );
};

const PaymentModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p>Payment processing coming soon!</p>
      </div>
    </div>
  );
};

const CertificateModal = ({ proof, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Certificate</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p>Certificate viewer coming soon!</p>
      </div>
    </div>
  );
};

const VideoPlayerModal = ({ videoUrl, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title || 'Video'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
          <Play size={48} className="text-gray-500" />
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
    <div className="bg-green-600 text-white text-center py-2">
      <p className="text-sm">💰 Latest Payouts: $50K+ distributed to members this month!</p>
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

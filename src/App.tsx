import React, { useState, useEffect } from 'react';
import { BlogPost, Comment, UserSession, Category, AISpotlightLook } from './types';
import { INITIAL_BLOGS, BLOG_CATEGORIES } from './data/blogs';

// Import subcomponents
import AdminPanel from './components/AdminPanel';
import AuthScreen from './components/AuthScreen';

// Lucide icon imports
import { 
  Compass, 
  Feather, 
  Bookmark, 
  Heart, 
  Search, 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  ArrowUpRight, 
  BookOpen, 
  Users, 
  Check, 
  User, 
  Instagram, 
  Twitter, 
  Feather as PenIcon, 
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation: 'Home' | 'Pinterest' | 'AI Stylist' | 'Bookmarks' | 'Portal' | 'Editor'
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary live state
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  
  // User profile
  const [session, setSession] = useState<UserSession>({
    email: null,
    name: null,
    isLoggedIn: false,
    savedBlogs: [],
    likedBlogs: []
  });

  const handleUpdateSession = (updated: Partial<UserSession>) => {
    setSession((prev) => ({ ...prev, ...updated }));
  };

  // Newsletter email
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [subscribedToast, setSubscribedToast] = useState<boolean>(false);

  // New Comment state
  const [commentUserName, setCommentUserName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [commentError, setCommentError] = useState<string>('');

  // AI Stylist State
  const [aiCategory, setAiCategory] = useState<Category>('Casual');
  const [aiVibe, setAiVibe] = useState<string>('Minimalist, quiet luxury, neutral hues');
  const [aiCorePiece, setAiCorePiece] = useState<string>('Heavy wool cropped trenchcoat');
  const [aiMainColor, setAiMainColor] = useState<string>('Oatmeal White / Warm Mocha');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiLookResult, setAiLookResult] = useState<AISpotlightLook | null>(null);
  const [aiWarning, setAiWarning] = useState<string>('');

  // Synchronize blogs from server during initialization
  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blogs) {
          setBlogs(data.blogs);
        }
      })
      .catch(() => console.log('Offline mode seeding: loaded initial fashion posts.'));
  }, []);

  const refreshBlogs = () => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blogs) {
          setBlogs(data.blogs);
          // If a blog is currently being read, update its copy in real-time
          if (selectedBlog) {
            const freshCopy = data.blogs.find((b: BlogPost) => b.id === selectedBlog.id);
            if (freshCopy) setSelectedBlog(freshCopy);
          }
        }
      })
      .catch(() => console.warn('Could not sync live blogs database.'));
  };

  // Like blog
  const handleLikeBlog = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = session.likedBlogs.includes(id);

    fetch(`/api/blogs/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unlike: isLiked })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSession((prev) => {
            const updatedLikes = isLiked
              ? prev.likedBlogs.filter((item) => item !== id)
              : [...prev.likedBlogs, id];
            return { ...prev, likedBlogs: updatedLikes };
          });
          refreshBlogs();
        }
      })
      .catch(() => {
        // Fallback offline handler
        setSession((prev) => {
          const updatedLikes = isLiked
            ? prev.likedBlogs.filter((item) => item !== id)
            : [...prev.likedBlogs, id];
          return { ...prev, likedBlogs: updatedLikes };
        });
        setBlogs((prev) =>
          prev.map((b) => {
            if (b.id === id) {
              return { ...b, likes: isLiked ? Math.max(0, b.likes - 1) : b.likes + 1 };
            }
            return b;
          })
        );
      });
  };

  // Bookmark / Save looks
  const handleSaveBlog = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isSaved = session.savedBlogs.includes(id);

    fetch(`/api/blogs/${id}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unsave: isSaved })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSession((prev) => {
            const updatedSaves = isSaved
              ? prev.savedBlogs.filter((item) => item !== id)
              : [...prev.savedBlogs, id];
            return { ...prev, savedBlogs: updatedSaves };
          });
          refreshBlogs();
        }
      })
      .catch(() => {
        // Fallback offline handler
        setSession((prev) => {
          const updatedSaves = isSaved
            ? prev.savedBlogs.filter((item) => item !== id)
            : [...prev.savedBlogs, id];
          return { ...prev, savedBlogs: updatedSaves };
        });
        setBlogs((prev) =>
          prev.map((b) => {
            if (b.id === id) {
              return { ...b, saves: isSaved ? Math.max(0, b.saves - 1) : b.saves + 1 };
            }
            return b;
          })
        );
      });
  };

  // Submit readers comments
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;

    const authorName = session.isLoggedIn ? session.name : commentUserName.trim();
    if (!authorName) {
      setCommentError('Please fill in your name or sign into a subscriber card.');
      return;
    }
    if (!commentText.trim()) {
      setCommentError('Please draft a comment message first.');
      return;
    }

    setCommentError('');

    fetch(`/api/blogs/${selectedBlog.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: authorName, text: commentText })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.comment) {
          setCommentText('');
          refreshBlogs();
        }
      })
      .catch(() => {
        // Fallback offline injection
        const offlineComment: Comment = {
          id: `comment-offline-${Date.now()}`,
          userName: authorName || 'Aesthetic Guest',
          text: commentText,
          createdAt: 'Just now'
        };
        setBlogs((prev) =>
          prev.map((b) => {
            if (b.id === selectedBlog.id) {
              return { ...b, comments: [...b.comments, offlineComment] };
            }
            return b;
          })
        );
        setSelectedBlog((prev) => {
          if (!prev) return null;
          return { ...prev, comments: [...prev.comments, offlineComment] };
        });
        setCommentText('');
      });
  };

  // Add a new blog from the Editors desk panel
  const handleAddNewBlog = (newBlogFields: any) => {
    fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlogFields)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          refreshBlogs();
        }
      })
      .catch(() => {
        // Fallback offline creator
        const dummy: BlogPost = {
          ...newBlogFields,
          id: `blog-offline-${Date.now()}`,
          slug: newBlogFields.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          publishedAt: 'Today',
          readTime: '3 min read',
          likes: 0,
          saves: 0,
          comments: [],
          author: {
            name: session.name || 'OOTD Guest Curator',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            role: 'Guest Desk writer'
          }
        };
        setBlogs((prev) => [dummy, ...prev]);
      });
  };

  // Delete a blog post
  const handleDeleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  // Instruct AI Stylist
  const handleRequestStylist = () => {
    setIsAiLoading(true);
    setAiWarning('');
    setAiLookResult(null);

    fetch('/api/gemini/generate-blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: aiCategory,
        vibes: aiVibe,
        corePiece: aiCorePiece,
        mainColor: aiMainColor
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.look) {
          setAiLookResult(data.look);
          if (data.warning) {
            setAiWarning(data.warning);
          }
        }
        setIsAiLoading(false);
      })
      .catch(() => {
        setIsAiLoading(false);
        setAiWarning('Error compiling live Gemini output. Loaded local high-end editorial styling templates.');
      });
  };

  // Subscribe Newsletter
  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribedToast(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribedToast(false), 5000);
  };

  // Filtering blogs based on category tabs and search bars
  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.outfitDetails && b.outfitDetails.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = blogs.find((b) => b.isFeatured) || blogs[0];
  const trendingBlogs = blogs.filter((b) => b.isTrending);

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans flex flex-col selection:bg-[#dfd3c3] selection:text-neutral-900">
      
      {/* 1. TOP NAV BAR */}
      <header id="ootd-main-navigation" className="sticky top-0 z-50 bg-[#070708]/90 backdrop-blur-md border-b border-neutral-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Brand */}
          <div className="flex items-baseline space-x-3 cursor-pointer" onClick={() => { setActiveTab('Home'); setSelectedBlog(null); }}>
            <h1 className="text-3xl font-serif tracking-widest font-bold text-white leading-none">OOTD</h1>
            <span className="text-[10px] font-mono tracking-widest text-[#b8a291] font-semibold uppercase">outfitoutclass.com</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-1.5 md:gap-4 text-xs font-serif uppercase tracking-widest text-neutral-400">
            {[
              { id: 'Home', label: 'Editorial Feed' },
              { id: 'Pinterest', label: 'Pinterest View' },
              { id: 'AI Stylist', label: 'AI Outfit Stylist' },
              { id: 'Bookmarks', label: `My Deck (${session.savedBlogs.length})` },
              { id: 'Editor', label: 'Press Desk' },
              { id: 'Portal', label: 'Subscriber Card' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedBlog(null);
                }}
                className={`px-2 py-1 transition-all duration-300 relative rounded-md ${
                  activeTab === tab.id 
                    ? 'text-white font-semibold tracking-wider bg-neutral-900/60' 
                    : 'hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-2 right-2 h-[1px] bg-[#dfd3c3]" 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Clean Interactive Search */}
          <div className="relative w-full max-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search catalog/outfits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#121214] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 rounded-lg font-mono transition-all focus:w-[220px]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC BROADCAST BANNER AT TOP */}
      {subscribedToast && (
        <div className="bg-[#12110e] border-b border-[#dfd3c3]/20 py-2 text-center text-xs text-[#dfd3c3] font-mono tracking-wider animate-pulse flex items-center justify-center space-x-2">
          <span>● JOURNAL DIRECTIVE: Thank you for subscribing to OOTD. Curated autumn trend booklet was dispatched directly.</span>
        </div>
      )}

      {/* 3. MAIN DISPLAY ROUTER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 relative">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: EDITORIAL HOME FEED */}
          {activeTab === 'Home' && !selectedBlog && (
            <motion.div
              key="editorial-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              {/* STYLISH SPLIT HERO BANNER */}
              {featuredBlog && (
                <section id="hero-feature-magazine" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Column Brand copy */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#b8a291] font-semibold bg-[#12110f] border border-[#dfd3c3]/15 px-3 py-1 rounded-full">
                      <Feather className="w-3 h-3 text-[#dfd3c3]" />
                      <span>Featured Curation Issue</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-none">
                      {featuredBlog.title}
                    </h2>

                    <p className="text-neutral-400 font-sans text-sm leading-relaxed font-light">
                      {featuredBlog.excerpt}
                    </p>

                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center space-x-2.5">
                        <img referrerPolicy="no-referrer" src={featuredBlog.author.avatar} className="w-9 h-9 rounded-full object-cover border border-neutral-800" alt={featuredBlog.author.name} />
                        <div>
                          <p className="text-xs font-serif font-bold text-white">{featuredBlog.author.name}</p>
                          <p className="text-[10px] font-mono text-neutral-500">{featuredBlog.author.role}</p>
                        </div>
                      </div>
                      <span className="text-neutral-700 text-sm">|</span>
                      <span className="text-xs font-mono text-neutral-400">{featuredBlog.publishedAt}</span>
                      <span className="text-neutral-700 text-sm">|</span>
                      <span className="text-xs font-mono text-[#b8a291] uppercase tracking-wider">{featuredBlog.readTime}</span>
                    </div>

                    <div className="flex items-center space-x-3 pt-4">
                      <button
                        onClick={() => setSelectedBlog(featuredBlog)}
                        className="px-6 py-3 bg-[#dfd3c3] text-neutral-900 font-serif font-bold text-xs uppercase tracking-widest rounded-lg transition-all hover:bg-[#d4c5b9] flex items-center space-x-2 group cursor-pointer"
                      >
                        <span>Read Full Essay</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>

                      <button
                        onClick={() => handleSaveBlog(featuredBlog.id)}
                        className="p-3 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                        title="Bookmark look"
                      >
                        <Bookmark className={`w-4 h-4 ${session.savedBlogs.includes(featuredBlog.id) ? 'fill-[#dfd3c3] text-[#dfd3c3]' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleLikeBlog(featuredBlog.id)}
                        className="p-3 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950 rounded-lg text-neutral-400 hover:text-rose-400 transition cursor-pointer"
                        title="Like OOTD"
                      >
                        <Heart className={`w-4 h-4 ${session.likedBlogs.includes(featuredBlog.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Right Column Image Banner with Tag Overlays */}
                  <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-2xl overflow-hidden group shadow-2xl border border-neutral-800">
                    <img
                      referrerPolicy="no-referrer"
                      src={featuredBlog.image}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt="Featured fashion collage"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070708]/90 via-transparent to-transparent" />
                    
                    {/* Tiny floating outfit tag badge on image */}
                    <div className="absolute bottom-6 left-6 bg-[#0c0c0d]/90 backdrop-blur-md border border-neutral-800 p-4 rounded-xl space-y-1.5 max-w-sm hidden sm:block animate-pulse">
                      <span className="text-[9px] font-mono text-[#b8a291] uppercase tracking-wider">Look blueprint elements</span>
                      <p className="text-xs text-white font-serif font-bold truncate">{featuredBlog.outfitDetails?.[0]}</p>
                    </div>
                  </div>

                </section>
              )}

              {/* TRENDING OUTFIT SECTION (VOGUE ROLLER) */}
              <section id="trending-outfits-drawer" className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-neutral-900 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <Compass className="w-5 h-5 text-[#dfd3c3]" />
                    <h3 className="text-2xl font-serif text-white tracking-tight">Trending Outfits This Season</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">OOTD Outclass Curation Feed</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingBlogs.map((look) => (
                    <div
                      key={look.id}
                      onClick={() => setSelectedBlog(look)}
                      className="bg-[#0b0b0d] border border-neutral-800/60 rounded-xl overflow-hidden group hover:border-[#dfd3c3]/30 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="aspect-[4/5] overflow-hidden relative">
                        <img
                          referrerPolicy="no-referrer"
                          src={look.image}
                          alt={look.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                        />
                        <div className="absolute top-3 left-3 bg-[#070708]/80 backdrop-blur border border-neutral-800/80 text-[9px] text-[#dfd3c3] font-mono uppercase tracking-widest px-2.5 py-1 rounded">
                          {look.category}
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">{look.publishedAt} • {look.readTime}</span>
                        <h4 className="text-lg font-serif font-bold text-white group-hover:text-[#dfd3c3] transition duration-300 leading-snug">{look.title}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">{look.excerpt}</p>
                      </div>

                      <div className="p-5 pt-0 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                        <span>OOTD Spotlight</span>
                        <div className="flex items-center space-x-3 text-xs">
                          <button
                            onClick={(e) => { handleLikeBlog(look.id, e); }}
                            className="flex items-center space-x-1 hover:text-rose-400 transition"
                          >
                            <Heart className={`w-3.5 h-3.5 ${session.likedBlogs.includes(look.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{look.likes}</span>
                          </button>
                          <button
                            onClick={(e) => { handleSaveBlog(look.id, e); }}
                            className="flex items-center space-x-1 hover:text-[#dfd3c3] transition"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${session.savedBlogs.includes(look.id) ? 'fill-[#dfd3c3] text-[#dfd3c3]' : ''}`} />
                            <span>{look.saves}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* HIGHLIGHT CATEGORIES FILTER TABS */}
              <section id="homepage-category-collage" className="space-y-6 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-3">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-white tracking-tight">The Wardrobe Chronicles</h3>
                    <p className="text-xs text-neutral-400 font-light">Explore specific trend channels curated under strict technical drapes.</p>
                  </div>

                  {/* Tiny selector blocks */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-serif uppercase tracking-widest">
                    <button
                      onClick={() => { setSelectedCategory('All'); setActiveTab('Pinterest'); }}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white rounded transition"
                    >
                      Browse All Categories
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {BLOG_CATEGORIES.map((cat, i) => {
                    // Fetch index representative image
                    const sampleImg = blogs.find(b => b.category === cat)?.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400';
                    return (
                      <div
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setActiveTab('Pinterest');
                        }}
                        className="bg-[#0b0b0d] border border-neutral-800/80 rounded-xl overflow-hidden relative group/cat aspect-[10/12] cursor-pointer shadow-sm"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={sampleImg}
                          alt={cat}
                          className="w-full h-full object-cover duration-500 group-hover/cat:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                        
                        <div className="absolute inset-x-3 bottom-3 text-center space-y-1 z-10">
                          <span className="text-[8px] font-mono tracking-widest uppercase text-[#b8a291] font-bold">Category {i+1}</span>
                          <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">{cat}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ABOUT OOTD JOURNAL */}
              <section id="about-ootd-magazine" className="bg-[#0a0a0c] border border-neutral-800/80 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#dfd3c3]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-3xl space-y-6">
                  <span className="text-[10px] font-mono tracking-widest text-[#b8a291] uppercase font-bold">curator philosophy</span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-white tracking-tight leading-tight">Elevating Wardrobe Blueprint Narratives for the Discerning Gen-Z</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light font-sans">
                    OOTD (Outfit Outclass, hosted at outfitoutclass.com) was conceptualized as a reaction against standard fast fashion algorithms. We believe clothing is spatial architecture. By documenting organic weaves, heavy-crop cardigans, technical drapes, and asymmetric tailoring, we bridge the gap between historic artisan roots and modern street grit.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 font-serif">
                    <div className="space-y-1">
                      <p className="text-lg text-white font-bold">100% Raw Flax</p>
                      <p className="text-[11px] font-mono text-[#b8a291] uppercase tracking-wider">Unbleached Canvas</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg text-white font-bold">Slow-Fashion</p>
                      <p className="text-[11px] font-mono text-[#b8a291] uppercase tracking-wider">Handloomed Weaving</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg text-white font-bold">Generative Styling</p>
                      <p className="text-[11px] font-mono text-[#b8a291] uppercase tracking-wider">Gemini Model Driven</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* NEWSLETTER FORM */}
              <section id="newsletter-form-section" className="bg-[#111113] border border-neutral-800/80 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 md:max-w-md">
                  <h4 className="text-xl font-serif text-white tracking-tight">Subscribe to OOTD Dispatch</h4>
                  <p className="text-xs text-neutral-400 font-light">Receive our monthly vintage digest, material weaves studies, and early private campaign alerts directly with high-fashion stamps.</p>
                </div>

                <form onSubmit={handleNewsletterSubscribe} className="flex gap-2 w-full md:w-auto shrink-0">
                  <input
                    type="email"
                    required
                    placeholder="sienna@outfitoutclass.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="px-4 py-2 bg-[#070708] border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 min-w-[200px]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#dfd3c3] text-neutral-900 font-serif font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#d4c5b9] transition cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              </section>

            </motion.div>
          )}

          {/* TAB 2: PINTEREST LAYOUT BLOG FEED */}
          {activeTab === 'Pinterest' && !selectedBlog && (
            <motion.div
              key="pinterest-feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Category selector pill strip */}
              <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#b8a291] uppercase">Aesthetic collage</span>
                  <h2 className="text-3xl font-serif text-white tracking-tight">Pinterest Outfit Boards</h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl">
                  {['All', ...BLOG_CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`text-xs font-serif uppercase tracking-widest px-4 py-2 rounded-lg transition-all border ${
                        selectedCategory === cat 
                          ? 'bg-[#dfd3c3] text-neutral-900 border-[#dfd3c3]' 
                          : 'bg-[#121214] text-neutral-400 border-neutral-800/80 hover:text-white'
                      } cursor-pointer`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Masonry / Pinterest Post Grid */}
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-neutral-400 font-serif text-sm">No aesthetic outfit drapes matched your filters.</p>
                  <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="text-xs text-[#b8a291] underline font-mono">
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                  {filteredBlogs.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedBlog(post)}
                      className="break-inside-avoid bg-[#0c0c0e] border border-neutral-800/80 rounded-2xl overflow-hidden group hover:border-[#dfd3c3]/40 transition-all duration-300 shadow flex flex-col mb-6 cursor-pointer"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          referrerPolicy="no-referrer"
                          src={post.image}
                          alt={post.title}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-102"
                        />
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[8px] font-mono uppercase tracking-widest text-[#dfd3c3]">
                          {post.category}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                          <span>{post.publishedAt}</span>
                          <span>{post.readTime}</span>
                        </div>

                        <h3 className="text-lg font-serif font-bold text-white leading-snug group-hover:text-[#dfd3c3] transition">
                          {post.title}
                        </h3>

                        <p className="text-xs text-neutral-400 leading-relaxed font-light">{post.excerpt}</p>
                        
                        {/* Render first 2 clothing list items tagged within card */}
                        {post.outfitDetails && post.outfitDetails.length > 0 && (
                          <div className="pt-2 font-mono text-[9px] text-[#b8a291] space-y-0.5">
                            <span className="block uppercase tracking-wider text-neutral-500 mb-1">OOTD Composition:</span>
                            {post.outfitDetails.slice(0, 2).map(( garment, index ) => (
                              <div key={index} className="flex items-center space-x-1 uppercase">
                                <span className="w-1.5 h-1.5 bg-[#dfd3c3] rounded-full shrink-0" />
                                <span className="truncate">{garment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 bg-[#121215]/30 border-t border-neutral-900/60 flex items-center justify-between text-xs text-neutral-400">
                        <div className="flex items-center space-x-2">
                          <img referrerPolicy="no-referrer" src={post.author.avatar} className="w-5 h-5 rounded-full object-cover" alt="Author" />
                          <span className="text-[10px] uppercase font-mono tracking-wider">{post.author.name.split(' ')[0]}</span>
                        </div>

                        <div className="flex items-center space-x-3 text-[11px] font-mono">
                          <button
                            onClick={(e) => { handleLikeBlog(post.id, e); }}
                            className="flex items-center space-x-1 hover:text-rose-400 transition cursor-pointer"
                          >
                            <Heart className={`w-3.5 h-3.5 ${session.likedBlogs.includes(post.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          
                          <button
                            onClick={(e) => { handleSaveBlog(post.id, e); }}
                            className="flex items-center space-x-1 hover:text-white transition cursor-pointer"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${session.savedBlogs.includes(post.id) ? 'fill-[#dfd3c3] text-[#dfd3c3]' : ''}`} />
                            <span>{post.saves}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: AI OUTFIT STYLIST */}
          {activeTab === 'AI Stylist' && !selectedBlog && (
            <motion.div
              key="ai-stylist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center space-x-1 bg-gradient-to-tr from-[#dfd3c3] to-white/10 p-1 px-3.5 rounded-full border border-neutral-800 text-[10px] text-neutral-900 uppercase font-mono tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-700" />
                  <span className="font-semibold">AI Fashion Copywriter</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight leading-none pt-2">The Digital Styling Room</h2>
                <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
                  Type your mood or wardrobe pieces, and Gemini will instantly draft an executive fashion spotlight post suitable for publication.
                </p>
              </div>

              {/* Selection cards */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Form fields config */}
                <div className="md:col-span-5 bg-[#0b0b0d] border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono tracking-wider text-[#b8a291] uppercase font-bold">Styling directives</span>
                  
                  <div className="space-y-3 font-sans text-xs text-neutral-200">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Style Category</label>
                      <select
                        value={aiCategory}
                        onChange={(e) => setAiCategory(e.target.value as Category)}
                        className="w-full bg-[#121214] border border-neutral-800 p-2.5 text-xs text-white rounded-lg focus:outline-none"
                      >
                        {BLOG_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Vibe Direction / Aesthetics</label>
                      <input
                        type="text"
                        value={aiVibe}
                        onChange={(e) => setAiVibe(e.target.value)}
                        placeholder="e.g. Dark Academia, Y2K Grit, Avant-garde"
                        className="w-full bg-[#121214] border border-neutral-800 p-2.5 text-xs text-white rounded-lg focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Core Wardrobe Piece</label>
                      <input
                        type="text"
                        value={aiCorePiece}
                        onChange={(e) => setAiCorePiece(e.target.value)}
                        placeholder="e.g. Asymmetric pleated linen knit"
                        className="w-full bg-[#121214] border border-neutral-800 p-2.5 text-xs text-white rounded-lg focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Aesthetic Color Palette Highlight</label>
                      <input
                        type="text"
                        value={aiMainColor}
                        onChange={(e) => setAiMainColor(e.target.value)}
                        placeholder="e.g. Cocoa brown and off-white"
                        className="w-full bg-[#121214] border border-neutral-800 p-2.5 text-xs text-white rounded-lg focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={handleRequestStylist}
                      disabled={isAiLoading}
                      className="w-full py-3 bg-[#dfd3c3] hover:bg-[#d4c5b9] text-neutral-900 font-serif font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-3"
                    >
                      {isAiLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin shrink-0" />
                          <span>Drafting Article...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Instruct A.I. Stylist</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Display outputs */}
                <div className="md:col-span-7 bg-[#0b0b0d] border border-neutral-800/80 rounded-2xl p-6 min-h-[300px] flex flex-col justify-between relative">
                  
                  {isAiLoading && (
                    <div className="absolute inset-0 bg-[#070708]/85 z-10 flex flex-col items-center justify-center space-y-4 rounded-2xl animate-fade-in">
                      <span className="w-10 h-10 border-4 border-[#dfd3c3] border-t-transparent rounded-full animate-spin" />
                      <div className="text-center space-y-1 px-4">
                        <p className="text-sm font-serif font-semibold text-white animate-pulse">Running advanced Gemini 3.5-flash...</p>
                        <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">"Style is the architecture of presence."</p>
                      </div>
                    </div>
                  )}

                  {aiLookResult ? (
                    <div className="space-y-5 animate-fade-in text-xs">
                      
                      {/* Brand Stamp */}
                      <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                        <span className="text-[9px] font-mono text-[#b8a291] tracking-widest uppercase">Live copy generated</span>
                        <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[9px] uppercase font-semibold">
                          <Check className="w-3 h-3" />
                          <span>Gemini Compiled</span>
                        </div>
                      </div>

                      {/* Title block */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">{aiCategory} Spotlight</span>
                        <h3 className="text-2xl font-serif font-bold text-white leading-snug">{aiLookResult.title}</h3>
                        <p className="text-neutral-400 italic font-serif">"{aiLookResult.vibe}"</p>
                      </div>

                      {/* Styling writeup */}
                      <div className="space-y-3 pt-2 font-sans leading-relaxed text-neutral-300 font-light max-h-[220px] overflow-y-auto pr-2">
                        <p className="whitespace-pre-wrap text-neutral-200">{aiLookResult.stylingGuide}</p>
                      </div>

                      {/* Recommended details list */}
                      <div className="grid grid-cols-2 gap-4 border-t border-neutral-900 pt-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">OOTD Blueprint Items</span>
                          <ul className="space-y-0.5 text-[10px] font-mono text-[#b8a291]">
                            {aiLookResult.mustHaveItems.map((item, id) => (
                              <li key={id} className="truncate">• {item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Color Palette Labels</span>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {aiLookResult.colorPalette.map((col, idx) => (
                              <span key={idx} className="inline-block text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-mono">
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Seasonal tip */}
                      <div className="bg-[#121214] p-3 rounded-lg border border-neutral-800 text-[10px] text-neutral-400 leading-relaxed font-light mt-2">
                        <span className="font-mono text-[#b8a291] uppercase tracking-wider block font-bold mb-0.5">Editor’s Seasonal Transition Tip</span>
                        {aiLookResult.seasonalTips}
                      </div>

                      {/* Button to draft straight into the list */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            handleAddNewBlog({
                              title: aiLookResult.title,
                              category: aiCategory as any,
                              image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800',
                              excerpt: aiLookResult.vibe,
                              content: aiLookResult.stylingGuide,
                              outfitDetails: aiLookResult.mustHaveItems
                            });
                            setActiveTab('Home');
                          }}
                          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-[#dfd3c3] font-serif text-[11px] uppercase tracking-wider rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Feather className="w-3.5 h-3.5" />
                          <span>Publish generated draft to Feed</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <Sparkles className="w-10 h-10 text-neutral-700 mb-3 animate-pulse" />
                      <p className="font-serif text-white text-sm">Styling results will appear here.</p>
                      <p className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase mt-1">Configure parameters and request styling blueprint.</p>
                    </div>
                  )}

                  {aiWarning && (
                    <div className="mt-4 p-2 bg-[#120f0e] border border-amber-900 text-[10px] text-amber-500 font-mono rounded">
                      {aiWarning}
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: MY DECK (SAVED BLOGS) */}
          {activeTab === 'Bookmarks' && !selectedBlog && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[#b8a291] uppercase">Personal deck</span>
                <h2 className="text-3xl font-serif text-white tracking-tight">My Curated Deck</h2>
                <p className="text-xs text-neutral-400 font-light">Explore aesthetic outfits bookmarked to your digital catalog.</p>
              </div>

              {session.savedBlogs.length === 0 ? (
                <div className="text-center py-20 bg-[#0b0b0d] border border-neutral-800/80 rounded-2xl max-w-xl mx-auto space-y-4">
                  <Bookmark className="w-10 h-10 text-neutral-600 mx-auto" />
                  <div>
                    <h4 className="font-serif text-white">Your curation vault is currently empty</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto mt-1 font-light">
                      Browse OOTD journals and tap the bookmark ribbon under cards to stack styling blueprints.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('Home')}
                    className="px-5 py-2.5 bg-[#dfd3c3] text-neutral-900 font-serif font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white transition cursor-pointer"
                  >
                    Browse Campaign Feeds
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blogs
                    .filter((post) => session.savedBlogs.includes(post.id))
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedBlog(post)}
                        className="bg-[#0b0b0d] border border-neutral-800/60 rounded-xl overflow-hidden group hover:border-[#dfd3c3]/30 transition duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            referrerPolicy="no-referrer"
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-102"
                          />
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest text-[#dfd3c3]">
                            {post.category}
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">{post.readTime}</span>
                          <h4 className="text-md font-serif font-bold text-white group-hover:text-[#dfd3c3] transition leading-tight">{post.title}</h4>
                          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">{post.excerpt}</p>
                        </div>

                        <div className="p-4 bg-[#121215]/30 border-t border-neutral-900/60 flex items-center justify-between text-xs text-neutral-400">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{post.publishedAt}</span>
                          <div className="flex items-center space-x-3 text-xs">
                            <button
                              onClick={(e) => { handleLikeBlog(post.id, e); }}
                              className="text-neutral-500 hover:text-rose-400 transition"
                            >
                              <Heart className={`w-3.5 h-3.5 ${session.likedBlogs.includes(post.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => { handleSaveBlog(post.id, e); }}
                              className="text-neutral-500 hover:text-white transition"
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-[#dfd3c3] text-[#dfd3c3]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: EDITORIAL PRESS DESK (ADMIN PANEL) */}
          {activeTab === 'Editor' && !selectedBlog && (
            <motion.div
              key="editor-desk"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminPanel
                blogs={blogs}
                onAddBlog={handleAddNewBlog}
                onDeleteBlog={handleDeleteBlog}
              />
            </motion.div>
          )}

          {/* TAB 6: SUBSCRIBER CARD PORTAL (AUTH SCREEN) */}
          {activeTab === 'Portal' && !selectedBlog && (
            <motion.div
              key="subscriber-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
            >
              <AuthScreen
                session={session}
                onUpdateSession={handleUpdateSession}
                savedCount={session.savedBlogs.length}
                likedCount={session.likedBlogs.length}
              />
            </motion.div>
          )}

          {/* 4. IMMERSIVE READING MODAL (BLOG LIGHTBOX) */}
          {selectedBlog && (
            <motion.div
              key="Lightbox"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-8 bg-[#0b0b0d] border border-neutral-800 p-6 sm:p-10 rounded-2xl shadow-2xl relative"
            >
              {/* Back button link */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-all flex items-center justify-center cursor-pointer"
                title="Close Essay"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Category tag */}
              <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#b8a291] font-semibold">
                <span>Category Category:</span>
                <span className="bg-[#1c1a16] border border-[#dfd3c3]/10 px-2 py-0.5 rounded text-white">{selectedBlog.category}</span>
              </div>

              {/* Essay Headings */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-tight">
                  {selectedBlog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
                  <div className="flex items-center space-x-2">
                    <img referrerPolicy="no-referrer" src={selectedBlog.author.avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="author avatar" />
                    <span className="font-serif font-bold text-white shrink-0">{selectedBlog.author.name}</span>
                    <span className="text-[10px] text-neutral-500 uppercase">({selectedBlog.author.role})</span>
                  </div>
                  <span className="text-neutral-800">|</span>
                  <span>Published: {selectedBlog.publishedAt}</span>
                  <span className="text-neutral-800">|</span>
                  <span className="text-[#b8a291]">{selectedBlog.readTime}</span>
                </div>
              </div>

              {/* Wide Feature image */}
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden shadow-md border border-neutral-800">
                <img
                  referrerPolicy="no-referrer"
                  src={selectedBlog.image}
                  className="w-full h-full object-cover"
                  alt={selectedBlog.title}
                />
              </div>

              {/* Split Content + Outfit specifics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                
                {/* Full Essay Body */}
                <div className="lg:col-span-8 space-y-6 font-sans text-xs sm:text-sm leading-relaxed text-neutral-300 font-light tracking-wide whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>

                {/* Outfit Blueprint detail boxes */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#121214] p-5 rounded-xl border border-neutral-800 space-y-4 shadow-sm">
                    <span className="text-[9px] font-mono tracking-widest text-[#b8a291] uppercase block font-bold">OOTD BLUEPRINT TAGS</span>
                    
                    <ul className="space-y-2 text-xs font-sans">
                      {selectedBlog.outfitDetails ? selectedBlog.outfitDetails.map(( garment, index ) => (
                        <li key={index} className="flex start space-x-2 bg-[#070708] border border-neutral-900/60 p-2 rounded text-neutral-300 transition hover:border-neutral-800 hover:text-white">
                          <Check className="w-3.5 h-3.5 text-[#dfd3c3] shrink-0 mt-0.5" />
                          <span className="truncate">{garment}</span>
                        </li>
                      )) : (
                        <li className="text-neutral-500 font-mono text-[10px]">No clothing tagged in this look index.</li>
                      )}
                    </ul>

                    {/* Like / Bookmark Actions inside Blueprint */}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={() => handleLikeBlog(selectedBlog.id)}
                        className="flex-1 py-2.5 border border-neutral-800 hover:border-neutral-700 bg-[#070708] hover:bg-neutral-900 text-neutral-300 hover:text-white rounded-lg transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${session.likedBlogs.includes(selectedBlog.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>Like OOTD ({selectedBlog.likes})</span>
                      </button>

                      <button
                        onClick={() => handleSaveBlog(selectedBlog.id)}
                        className="py-2.5 px-3 border border-neutral-800 hover:bg-neutral-900 rounded-lg text-neutral-300 hover:text-white transition cursor-pointer"
                        title="Bookmark OOTD"
                      >
                        <Bookmark className={`w-4 h-4 ${session.savedBlogs.includes(selectedBlog.id) ? 'fill-[#dfd3c3] text-[#dfd3c3]' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* 5. READER LIVE COMMENTS SECTION */}
              <div className="border-t border-neutral-900 pt-8 space-y-6">
                <div className="flex items-center space-x-2 text-white font-serif">
                  <MessageSquare className="w-5 h-5 text-[#dfd3c3]" />
                  <h3 className="text-xl tracking-tight">Curation Feedback ({selectedBlog.comments.length})</h3>
                </div>

                {/* Submited comments feed */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {selectedBlog.comments.length === 0 ? (
                    <p className="text-xs text-neutral-500 font-mono italic">No reader reports filed yet. Be the first to express outfit reviews.</p>
                  ) : (
                    selectedBlog.comments.map((cmt) => (
                      <div key={cmt.id} className="bg-[#121214]/60 border border-neutral-900 p-4 rounded-xl space-y-1 animate-fade-in text-xs font-sans">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-serif font-bold text-white uppercase tracking-wider">{cmt.userName}</span>
                          <span className="text-neutral-500">{cmt.createdAt}</span>
                        </div>
                        <p className="text-neutral-300 pl-1 pt-1 leading-relaxed font-light font-sans">{cmt.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comments Submission Form */}
                <form onSubmit={handlePostComment} className="bg-[#0e0e10] border border-neutral-900 p-5 rounded-xl space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">Write Outfit Review</span>
                  
                  {commentError && (
                    <p className="text-xs text-rose-400 font-mono">{commentError}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    {/* User name input if not logged in */}
                    <div className="md:col-span-4">
                      <label className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider block mb-1">Your Identity</label>
                      {session.isLoggedIn ? (
                        <div className="w-full bg-[#121214] border border-neutral-800 p-2.5 rounded-lg text-xs font-serif font-semibold text-neutral-300">
                          {session.name}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="e.g. Liam Vance"
                          value={commentUserName}
                          onChange={(e) => setCommentUserName(e.target.value)}
                          className="w-full bg-[#121214] border border-neutral-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-neutral-700"
                        />
                      )}
                    </div>

                    {/* text box */}
                    <div className="md:col-span-8 flex flex-col justify-end">
                      <label className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider block mb-1">Outfit Review / Questions</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Drape on cashmere matches wonderfully. What sizes are cataloged?"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-grow bg-[#121214] border border-neutral-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-neutral-700 font-sans"
                        />
                        <button
                          type="submit"
                          className="px-4 bg-[#dfd3c3] hover:bg-[#d4c5b9] text-neutral-900 rounded-lg flex items-center justify-center transition cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </form>
              </div>

              {/* Close Button beneath modal */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:text-white rounded-lg text-xs text-neutral-400 font-serif font-semibold tracking-wider transition-all uppercase cursor-pointer"
                >
                  Return to Campaign stream
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. FOOTER */}
      <footer id="ootd-editorial-footer" className="bg-[#050506] border-t border-neutral-900 py-12 px-6 mt-16 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1 Brand definitions */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-2xl font-serif tracking-widest text-white leading-none">OOTD</h4>
            <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">OUTLAWING RAW CONSPICUOUS LOGOS</span>
            <p className="text-xs text-neutral-400 leading-relaxed font-light text-justify">
              OOTD is a high-end fashion magazine and material weave catalog operated by outfitoutclass.com. We document tailored trenches, asymmetric linen kurtas, raw boxy tees, and wool linings.
            </p>
          </div>

          {/* Col 2 Quick curation channels */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="text-[10px] font-mono tracking-widest text-[#b8a291] uppercase block font-bold">Curation Channels</span>
            <ul className="space-y-2 font-serif text-neutral-400">
              {BLOG_CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      setSelectedCategory(c);
                      setActiveTab('Pinterest');
                      setSelectedBlog(null);
                    }}
                    className="hover:text-white transition text-left cursor-pointer"
                  >
                    {c} Outfits Collection
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 Brand coordinates links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className="text-[10px] font-mono tracking-widest text-[#b8a291] uppercase block font-bold">Coordinates</span>
            <ul className="space-y-2 font-sans font-light text-neutral-400">
              <li>Editorial Suite: NYC, TriBeCa</li>
              <li>Weave Depot: Portland, OR</li>
              <li>Material Mill: Jaipur, IN</li>
              <li className="font-mono text-[10px] text-neutral-500">domain: outfitoutclass.com</li>
            </ul>
          </div>

          {/* Col 4 Social channels vectors */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#b8a291] uppercase block font-bold">Social Dispatches</span>
            <div className="flex space-x-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#0b0b0c] border border-neutral-900 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-800 text-xs transition" title="OOTD Instagram Page">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#0b0b0c] border border-neutral-900 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-800 text-xs transition" title="OOTD Twitter Feed">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#0b0b0c] border border-neutral-900 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-800 text-xs transition" title="OOTD Pinterest Boards">
                <Compass className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#0b0b0c] border border-[#0b0b0c] rounded-lg text-neutral-400 hover:text-[#dfd3c3] text-xs transition" title="OOTD Youtube Channel">
                <YoutubeCustom />
              </a>
            </div>
            
            <p className="text-[10px] text-neutral-500 font-mono">
              © {new Date().getFullYear()} OOTD • outfitoutclass.com. Curation with zero labels. All editorial rights reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}

// Simple custom inline SVG vector for Youtube to avoid dependency bloating
function YoutubeCustom() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
    </svg>
  );
}

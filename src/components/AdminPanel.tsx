import React, { useState } from 'react';
import { BlogPost, Category } from '../types';
import { BLOG_CATEGORIES } from '../data/blogs';
import { PlusCircle, Trash, Check, Edit3, X, Image, BookOpen, Feather, ListPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  blogs: BlogPost[];
  onAddBlog: (blog: Omit<BlogPost, 'id' | 'likes' | 'saves' | 'comments' | 'publishedAt' | 'readTime' | 'slug' | 'author'>) => void;
  onDeleteBlog: (id: string) => void;
}

export default function AdminPanel({ blogs, onAddBlog, onDeleteBlog }: AdminPanelProps) {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Category>('Casual');
  const [image, setImage] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [outfitPiece, setOutfitPiece] = useState<string>('');
  const [outfitDetails, setOutfitDetails] = useState<string[]>([]);

  const [isSuccessToast, setIsSuccessToast] = useState<boolean>(false);

  // Exquisite hand-curated high-fashion Pinterest-style presets
  const presetBlogImages = [
    { name: 'Oatmeal Tweed', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Modern Cargo', url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Espresso Coat', url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800' },
    { name: 'Khadi Linen', url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800' },
    { name: 'Summer Knit', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Cognac Merino', url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=800' }
  ];

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onAddBlog({
      title,
      category,
      image: image || presetBlogImages[0].url,
      excerpt: excerpt || content.substring(0, 110) + '...',
      content,
      outfitDetails: outfitDetails.length ? outfitDetails : ['OOTD Standard Linen Garment', 'Premium Hand-Polished Accessories']
    });

    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 2500);

    // Reset fields
    setTitle('');
    setImage('');
    setExcerpt('');
    setContent('');
    setOutfitDetails([]);
    setOutfitPiece('');
  };

  const handleAddOutfitPiece = () => {
    if (!outfitPiece.trim()) return;
    setOutfitDetails([...outfitDetails, outfitPiece.trim()]);
    setOutfitPiece('');
  };

  const handleRemoveOutfitPiece = (idx: number) => {
    setOutfitDetails(outfitDetails.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast Feedback */}
      {isSuccessToast && (
        <div id="publish-toast" className="bg-emerald-950/80 border border-emerald-900 text-emerald-400 p-3 rounded-xl flex items-center space-x-2.5 shadow-xl animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span className="text-xs font-serif font-semibold">OOTD Article published dynamically to the feed!</span>
        </div>
      )}

      {/* Hero Title */}
      <div className="space-y-1">
        <span className="text-[10px] text-[#b8a291] font-mono tracking-widest flex items-center space-x-1.5 uppercase">
          <Feather className="w-3.5 h-3.5" />
          <span>Editor’s Desk</span>
        </span>
        <h2 className="text-3xl font-bold font-serif tracking-tight text-white leading-none">OOTD PRESS STUDIO</h2>
        <p className="text-xs text-neutral-400">
          Compose high-fashion essays, link visual drapes, list OOTD garments, and publish to the live journal.
        </p>
      </div>

      {/* Editor Form */}
      <div className="bg-[#0b0b0d] border border-neutral-800/80 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-mono text-[#b8a291] tracking-widest uppercase flex items-center space-x-2">
          <PlusCircle className="w-4 h-4 text-[#dfd3c3]" />
          <span>Draft New Article</span>
        </h3>

        <form onSubmit={handleCreateBlog} className="space-y-4 font-sans text-xs text-neutral-200">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Article Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Silk Whispers: The Fluid Geometry of Ivory Taffeta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#121214] border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-serif text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Category Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 bg-[#121214] border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-neutral-700 font-serif"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Quick Excerpt</label>
              <input
                type="text"
                placeholder="A brief 1-sentence teaser for Pinterest cards."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#121214] border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
              />
            </div>
          </div>

          {/* Image Presets */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Feature Image URL</label>
              <span className="text-[9px] text-neutral-500 font-mono">Select preset to avoid typing</span>
            </div>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#121214] border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none"
            />

            <div className="flex flex-wrap gap-1 pt-1">
              {presetBlogImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(img.url)}
                  className={`text-[9px] font-mono py-1 px-2 border rounded-md transition-all ${
                    image === img.url
                      ? 'bg-[#dfd3c3] text-neutral-900 border-[#dfd3c3] font-semibold'
                      : 'bg-[#121214] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tagged Outfit Details */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">OOTD Outfit Pieces Highlight</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Asymmetric Wool Trenchcoat (Charcoal)"
                value={outfitPiece}
                onChange={(e) => setOutfitPiece(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOutfitPiece();
                  }
                }}
                className="flex-grow px-3 py-2.5 bg-[#121214] border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddOutfitPiece}
                className="px-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg flex items-center justify-center hover:bg-neutral-700 transition"
              >
                <ListPlus className="w-4 h-4" />
              </button>
            </div>

            {outfitDetails.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {outfitDetails.map((piece, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1 text-[9px] px-2 py-1 bg-[#161619] border border-neutral-800 rounded-md text-neutral-300"
                  >
                    <span>{piece}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOutfitPiece(i)}
                      className="text-neutral-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Full Article Content */}
          <div className="space-y-1.5 font-sans">
            <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Full Editorial Article Content (Markdown)</label>
            <textarea
              required
              rows={6}
              placeholder="Draft your high-fashion essay. Describe the vibe, the drape of the clothing, recommended coordination, and how to capture the mood under city drapes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#121214] border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 leading-relaxed font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#dfd3c3] text-neutral-900 hover:bg-[#d4c5b9] transition-all font-serif font-bold rounded-lg text-xs uppercase tracking-wider mt-3 cursor-pointer"
          >
            Publish Live OOTD Article
          </button>
        </form>
      </div>

      {/* Editor list of active posts */}
      <div className="space-y-3 pb-8">
        <h3 className="text-xs font-mono text-neutral-400 tracking-wider font-semibold uppercase flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#dfd3c3]" />
          <span>Active Journal Publications ({blogs.length})</span>
        </h3>

        <div className="space-y-2.5">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="bg-[#0b0b0d] border border-neutral-800/80 p-3 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  referrerPolicy="no-referrer"
                  src={b.image}
                  className="w-10 h-10 rounded-md object-cover shrink-0 border border-neutral-800"
                />
                
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[9px] font-mono text-[#b8a291] uppercase tracking-widest">{b.category}</span>
                  <p className="text-xs font-semibold text-white truncate max-w-[200px] font-serif">{b.title}</p>
                  <p className="text-[9px] text-neutral-500 font-mono">{b.publishedAt} • By {b.author.name}</p>
                </div>
              </div>

              {/* Action columns */}
              <button
                onClick={() => onDeleteBlog(b.id)}
                className="p-2 border border-neutral-800 hover:bg-neutral-900 border-neutral-800/80 text-neutral-500 hover:text-rose-400 rounded-lg transition-all shrink-0 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

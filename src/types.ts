export type Category = 'Casual' | 'Street Style' | 'Party Wear' | 'Ethnic' | 'Summer Fits' | 'Winter Fits';

export interface Comment {
  id: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: Category;
  image: string;
  excerpt: string;
  content: string; // Markdown article content
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  likes: number;
  saves: number;
  comments: Comment[];
  isFeatured?: boolean;
  isTrending?: boolean;
  outfitDetails?: string[]; // Custom tagged clothes in the look
}

export interface UserSession {
  email: string | null;
  name: string | null;
  isLoggedIn: boolean;
  savedBlogs: string[]; // Saved Blog IDs
  likedBlogs: string[]; // Liked Blog IDs
}

export interface AISpotlightLook {
  title: string;
  vibe: string;
  stylingGuide: string;
  colorPalette: string[];
  mustHaveItems: string[];
  seasonalTips: string;
}

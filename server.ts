import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_BLOGS } from "./src/data/blogs.js";
import { BlogPost, Comment } from "./src/types.js";

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Blog Generator will fallback to mock template mode.");
      throw new Error("GEMINI_API_KEY is not defined. Please check your Secrets in Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Dynamic in-memory blog storage initialized with seeded boutique fashion articles
let dbBlogs: BlogPost[] = JSON.parse(JSON.stringify(INITIAL_BLOGS));

// ==================== API ROUTES ====================

// Get all blogs
app.get("/api/blogs", (req, res) => {
  res.json({ success: true, blogs: dbBlogs });
});

// Create/Publish a new blog post
app.post("/api/blogs", (req, res) => {
  const { title, category, image, excerpt, content, outfitDetails } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ success: false, error: "Missing required fields (title, category, content)" });
  }

  const newPost: BlogPost = {
    id: `blog-${Date.now()}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    category,
    image: image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    excerpt: excerpt || content.substring(0, 120) + "...",
    content,
    publishedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
    readTime: `${Math.max(2, Math.ceil(content.split(" ").length / 150))} min read`,
    author: {
      name: "OOTD Contributor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      role: "Guest Creator"
    },
    likes: 0,
    saves: 0,
    comments: [],
    outfitDetails: outfitDetails || []
  };

  dbBlogs.unshift(newPost);
  res.json({ success: true, blog: newPost });
});

// Like a blog post
app.post("/api/blogs/:id/like", (req, res) => {
  const { id } = req.params;
  const { unlike } = req.body;
  const blog = dbBlogs.find(b => b.id === id);
  if (!blog) {
    return res.status(404).json({ success: false, error: "Blog post not found" });
  }

  if (unlike) {
    blog.likes = Math.max(0, blog.likes - 1);
  } else {
    blog.likes += 1;
  }
  res.json({ success: true, likes: blog.likes });
});

// Save a blog post
app.post("/api/blogs/:id/save", (req, res) => {
  const { id } = req.params;
  const { unsave } = req.body;
  const blog = dbBlogs.find(b => b.id === id);
  if (!blog) {
    return res.status(404).json({ success: false, error: "Blog post not found" });
  }

  if (unsave) {
    blog.saves = Math.max(0, blog.saves - 1);
  } else {
    blog.saves += 1;
  }
  res.json({ success: true, saves: blog.saves });
});

// Add comment to a blog post
app.post("/api/blogs/:id/comments", (req, res) => {
  const { id } = req.params;
  const { userName, text } = req.body;
  if (!userName || !text) {
    return res.status(400).json({ success: false, error: "Missing required comment parameters" });
  }

  const blog = dbBlogs.find(b => b.id === id);
  if (!blog) {
    return res.status(404).json({ success: false, error: "Blog post not found" });
  }

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    userName,
    text,
    createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
  };

  blog.comments.push(newComment);
  res.json({ success: true, comment: newComment });
});

// AI OOTD Generator
app.post("/api/gemini/generate-blog", async (req, res) => {
  const { category, vibes, corePiece, mainColor } = req.body;

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Draft an exquisite, highly professional, luxury fashion style article for "OOTD" (Outfit Outclass Journal, outfitoutclass.com) based on these inputs:
- Outfit Category: ${category || "Street Style"}
- Styling Vibes: ${vibes || "Minimalist, chic, soft brown neutral shades"}
- Core Wardrobe Piece: ${corePiece || "Cashmere rib-knit mockneck"}
- Main Accent Color: ${mainColor || "Camel Beige / Toasted Sand"}

Write in the tone of a high-end fashion magazine editor (smooth, editorial, descriptive, Gen-Z trendy but intellectual). Make it feel like an elegant Pinterest narrative post.

The response MUST return a beautifully structured JSON object representing this luxury styling spotlight:
- title: A highly trendy, catchy title (e.g. "The Art of Coffee-Run Lounging: Cashmere & Camel Drapes")
- vibe: A short 1-sentence aesthetic summary of the outfit
- stylingGuide: The full detailed blog content in 3 rich paragraphs. Discuss mixing textures, how to pair the core piece, and lighting/accessories.
- colorPalette: An array of 4 aesthetic color hexadecimal codes or elegant color labels in high contrast (e.g. ["#E6DFD3 - Oatmeal Cream", "#42382F - Dark Cocoa", "#141416 - Charcoal Black", "#B8A291 - Cashmere Khaki"])
- mustHaveItems: An array of 4 concrete garments mentioned in the blog to build this OOTD look.
- seasonalTips: A short tip on how to carry or transition this look across season shifts.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            vibe: { type: Type.STRING },
            stylingGuide: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            mustHaveItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            seasonalTips: { type: Type.STRING }
          },
          required: ["title", "vibe", "stylingGuide", "colorPalette", "mustHaveItems", "seasonalTips"]
        }
      }
    });

    const textOutput = response.text || "{}";
    const parsedData = JSON.parse(textOutput.trim());
    res.json({ success: true, look: parsedData });
  } catch (error: any) {
    console.error("Gemini API error during blog generation:", error);
    
    // Fallback look with neutral beige luxury palette
    const fallbackLook = {
      title: `${category || "Aesthetic"} Harmony: Layered Neutrals on ${corePiece || "Essential Crop Knit"}`,
      vibe: `A curated ${vibes || "effortless luxury"} style guide honoring fluid lines and organic textures.`,
      stylingGuide: `In modern luxury assemblies, the choice of a core piece stabilizes the seasonal narrative. Blending textured organic knitwear with loose cashmere drapery enables complete physical relaxation while retaining a highly intentional posture. Pairing the ${corePiece || "Mockneck rib"} with high-waisted neutral slacks presents an elegant, tall human geometry.
      
      To further elevate the look beyond the casual street context, rely on high-quality accessories that reflect ambient city lighting. Consider a structured camel-finished trenchcoat draped over the shoulders, and pair with smooth leather slides or retro court sneakers.
      
      The styling philosophy remains centered: maintain a tight palette of soft beiges, cocoa, and slate cream. Mixing flat textures (like wool) with reflecting finishes (like silk details or metal hardware) produces satisfying shadow lines suitable for modern city spaces.`,
      colorPalette: [
        "#F5EDE2 - French Cream",
        "#D4C5B9 - Sand Drift",
        "#8B5E3C - Toasted Mocha",
        "#111111 - Obscura Black"
      ],
      mustHaveItems: [
        corePiece || "Loose Cashmere Rib Mockneck",
        "Structured Wool Trenchcoat (Camel Beige)",
        "Pleated Wide-Leg Lounge Slacks (Toasted Cream)",
        "Handcrafted Leather Slides (Espresso Brown)"
      ],
      seasonalTips: `To transition this summer look into late winter, layer a thin unbleached merino turtleneck underneath and replace slides with brushed suede Chelsea boots.`
    };

    res.json({
      success: true,
      look: fallbackLook,
      warning: "Loaded premium virtual stylist fallback template. Set GEMINI_API_KEY for real-time generative writing."
    });
  }
});


// ==================== VITE SERVER FOR DEVELOPMENT / FRONTEND SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with HMR / file watch adjustments
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OOTD Outclass Blog running securely on http://localhost:${PORT}`);
  });
}

startServer();

# SOPHEAP.AI — Full-Stack Next.js Website

> AI Thinking for Cambodia's Future  
> Built for **HIN Sopheap**, Co-Founder & Chairman of Cambodia AI Group

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design system |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| AI Chat | OpenAI GPT-4o |
| Email | Resend |
| News Feed | NewsAPI.org |
| Animations | Framer Motion |
| Rich Text | Tiptap |
| Charts | Recharts |
| Deploy | Vercel |

---

## 📋 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd sopheap-ai
npm install
```

### 2. Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project: `sopheap-ai`
3. Enable **Firestore Database** (start in production mode)
4. Enable **Authentication** → Email/Password + Google
5. Enable **Storage**
6. Go to Project Settings → Service Accounts → Generate new private key
7. Copy the JSON file content for `FIREBASE_SERVICE_ACCOUNT_KEY`

### 3. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in all values:
- **Firebase**: from Firebase Console → Project Settings → Your apps
- **OpenAI**: from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **News API**: free key from [newsapi.org](https://newsapi.org)
- **Resend**: free key from [resend.com](https://resend.com)

### 4. Firebase Security Rules

In Firebase Console → Firestore → Rules, paste the contents of `firestore.rules`.

### 5. Make Yourself an Admin

After creating your account on the site, go to Firebase Console → Firestore → `users` collection → find your user document → add field:
```
role: "admin"
```

### 6. Add Your Photos

Place these files in `/public/images/`:
- `sopheap.jpg` — Your professional headshot (recommended: 800×1000px)
- `sophea-avatar.png` — Sophea AI avatar (recommended: 200×200px, can be any avatar image)
- `og-image.jpg` — Open Graph image for social sharing (1200×630px)

### 7. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel for auto-deploy.

**Add all environment variables** in Vercel Dashboard → Settings → Environment Variables.

**Set custom domain**: `sopheap.ai` in Vercel Dashboard → Domains.

The `vercel.json` cron job will automatically fetch AI news every 3 hours.

---

## 📝 Adding Content

### Create Your First Post

1. Go to `/admin` (sign in with admin account)
2. Click **Posts → New Post**
3. Choose category: **AI Frontier Brief**, **The Long View**, or **Thought Leadership**
4. Fill in title, body, excerpt
5. For AI Frontier Brief: fill in The Signal, Cambodia Lens, One Thing to Try
6. Toggle **Published** + **Featured** (for homepage hero)
7. Click **Save**

### Pre-load Seed Posts

You can manually create posts via the admin panel based on the sample content in the specification doc.

---

## 🤖 AI Assistant (Sophea)

Sophea is powered by **OpenAI GPT-4o**. Her system prompt is stored in Firebase `aiRules/current` and editable via the admin panel at `/admin/assistant`.

**To update Sophea's capabilities:**
1. Go to `/admin/assistant`
2. Edit the system prompt
3. Test with the built-in test panel
4. Save — changes take effect immediately

---

## 📁 Project Structure

```
sopheap-ai/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── blog/               # Blog index + article pages
│   ├── services/           # Services page
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── auth/               # Login, signup, profile
│   ├── admin/              # Admin panel (protected)
│   └── api/                # API routes
├── components/             # React components
│   ├── home/               # Homepage sections
│   ├── blog/               # Article cards
│   ├── chat/               # Sophea widget
│   ├── admin/              # Admin components
│   └── layout/             # Navbar, Footer
├── lib/                    # Firebase, auth, utils
├── types/                  # TypeScript types
├── public/images/          # Put sopheap.jpg + sophea-avatar.png here
├── firestore.rules         # Firebase security rules
├── .env.local.example      # Environment variable template
└── vercel.json             # Vercel cron config
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary BG | `#0A0C10` |
| Card BG | `#111318` |
| Gold Accent | `#C9A84C` |
| Cream Text | `#F5F0E8` |
| Muted Text | `#6B7280` |
| Display Font | Playfair Display |
| Body Font | Source Serif 4 |
| UI Font | DM Mono |
| Khmer Font | Kantumruy Pro |

---

## 🔐 Admin Panel

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/admin` | Analytics overview with charts |
| Posts | `/admin/posts` | All articles, create/edit/delete |
| New Post | `/admin/posts/new` | Rich text editor with AI tools |
| Inquiries | `/admin/inquiries` | Contact form submissions |
| AI Assistant | `/admin/assistant` | Sophea system prompt editor + test |
| AI News Feed | `/admin/assistant` (news tab) | Live AI news → generate drafts |

---

## 📧 Contact

**HIN Sopheap**  
Co-Founder & Chairman, Cambodia AI Group  
📱 Telegram: [095 666 788](https://t.me/+85595666788)  
📧 Email: sopheap.hin@gmail.com  
📍 Phnom Penh, Cambodia

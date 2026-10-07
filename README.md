# A Letter From Your Bride 💌

An elegant, intimate, and interactive **Bridesmaid Proposal website** for the wedding of **Toluwani & Moyo**. 

Built with **Next.js 16**, **Tailwind CSS v4**, **Framer Motion**, and **Neon Postgres**, this web application creates a memorable, bespoke digital letter experience for each bridesmaid with live color palette selection, playful interactions, and an admin dashboard for tracking responses.

---

## ✨ Features

- **💌 Personalized URLs**: Every bridesmaid receives a unique link (e.g. `/bridesmaids/mojoyinola`, `/bridesmaids/yewande`) leading to a tailored envelope and custom letter from the bride.
- **✉️ Interactive Envelope & Wax Seal**: Opening animation complete with custom wax seal, deckle-edge letter stationery, and smooth unfolding motion.
- **🤍 Playful Proposal & Hesitation Tracker**: An interactive proposal modal where the "Let Me Think" option playfully dodges the cursor before leading to a heartfelt "Yes" with celebratory confetti.
- **🎨 Live Color Palette Claiming**:
  - Bridesmaids pick their gown color on a first-come, first-served basis.
  - Colors claimed by another bridesmaid are instantly marked as reserved with the bridesmaid's name, preventing duplicate dress colors.
  - Chief Bridesmaid is automatically assigned designated bridal colors (*Champagne Gold / Wine*).
- **🎴 Digital Keepsake Card**: A downloadable/shareable keepsake card featuring the bridesmaid's role, wedding date, designated color swatch, and wedding countdown.
- **🔒 Password-Protected Portal & Admin Dashboard**:
  - Both `/` (directory of letters) and `/admin` are gated behind secure session authentication.
  - View real-time response states, number of times letters were opened, hesitation counts, and assigned colors.
  - Includes a one-click reset action for testing and re-issuing proposals.
- **🛡️ Resilient Data Store**: Uses Neon Postgres via `@neondatabase/serverless`, with automatic, zero-config table creation on first request and seamless fallback to local JSON storage (`.data/responses.json`) if offline.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Neon Postgres](https://neon.tech/) (`@neondatabase/serverless`)
- **Icons & Effects**: `canvas-confetti`, `lucide-react`

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
- `pnpm` or `npm`

### 2. Clone and Install Dependencies

```bash
git clone <repository-url>
cd bridesmaid-proposal-website
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
cp .env.example .env
```

Set the following variables:

```env
# Optional: Neon Postgres database connection string.
# If omitted or invalid in local dev, responses save to `.data/responses.json`.
DATABASE_URL="postgresql://neondb_owner:password@ep-example-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Required in production: Password for `/` and `/admin`
ADMIN_PASSWORD="YourSecurePasswordHere"

# Optional: Wedding date countdown (YYYY-MM-DD or ISO 8601)
NEXT_PUBLIC_WEDDING_DATE="2026-12-19"
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Visit `/` and enter your `ADMIN_PASSWORD` to view the bridal party directory.
- Visit `/admin` to view the bridal party response tracker.
- Visit any bridesmaid link directly, e.g. `/bridesmaids/mojoyinola`.

---

## 🗺️ Route Structure

| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | 🔒 Password Protected | Master directory linking to each bridesmaid's personal proposal letter. |
| `/admin` | 🔒 Password Protected | Real-time response tracker, open counts, assigned colors, and reset tools. |
| `/bridesmaids/[slug]` | 🌐 Public (Direct Link) | Individual proposal flow for the specific bridesmaid. |

### Included Bridesmaid Slugs

- `/bridesmaids/mojoyinola` *(Chief Bridesmaid)*
- `/bridesmaids/priscilla`
- `/bridesmaids/yewande`
- `/bridesmaids/shalom`
- `/bridesmaids/olusola`
- `/bridesmaids/blessing`
- `/bridesmaids/oluchi`
- `/bridesmaids/winner`

---

## ☁️ Deployment (Vercel + Neon)

### 1. Neon Database Setup

1. Sign up at [neon.tech](https://neon.tech) and create a project (e.g. `bridesmaid-website`).
2. Copy the **Pooled connection string** (`postgresql://...`).
3. **No manual migrations needed**: The database table (`bridesmaid_responses`) is automatically created on first query.

### 2. Deploy on Vercel

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New Project** and import the repository.
3. Under **Environment Variables**, configure:
   - `DATABASE_URL`: Your pooled Neon connection string.
   - `ADMIN_PASSWORD`: Your secret admin password.
   - `NEXT_PUBLIC_WEDDING_DATE`: `2026-12-19`
4. Click **Deploy**.

---

## 🎨 Branding & Customization

- **Bridesmaid Data & Letters**: Edit bridesmaid messages, roles, and candidate colors in [`lib/bridesmaids.ts`](lib/bridesmaids.ts).
- **Wedding Details & Logos**: Update couple names, wedding date, and logo path in [`lib/site.ts`](lib/site.ts).
- **Logo Asset**: Assets are located in [`public/logo/`](public/logo/).

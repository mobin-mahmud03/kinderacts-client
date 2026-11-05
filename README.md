# KindredActs - Social Development Events Platform

A modern, responsive, community-driven event management platform where citizens can discover, organize, join, and track social welfare events in their local communities.

* **Live Site URL**: [https://kindredacts-social-events.vercel.app](https://kindredacts-social-events.vercel.app) *(Deployment link)*
* **Backend API Repository**: [KindredActs Server Repository](https://github.com/your-username/kindredacts-server)

---

## 🌟 Key Features

* **Real-time Upcoming Initiatives Feed**: Showcases scheduled volunteer campaigns (e.g. Winter Blanket Distribution in Mohammadpur, Lake Cleanups, Urban Tree Plantations) dynamically fetched from MongoDB using the `.limit(6)` operator, with automated filtering preventing past dates from displaying.
* **1-Click Volunteer Commitment & Tracking**: Authenticated citizens can join any upcoming drive with a single click. Commitments are stored in MongoDB and tracked in a dedicated "Joined Events" dashboard sorted chronologically by date.
* **Organizer Management & Ownership Enforcement**: Organizers have full CRUD capabilities to publish, update, and delete their own initiatives with strict JWT authentication ensuring users cannot tamper with events created by others.
* **Strict Validation & Security**: Form inputs feature real-time client and server validations, including future-only date pickers (`eventDate >= today`), and password complexity enforcement (at least 1 uppercase letter, 1 lowercase letter, and minimum 6 characters).
* **System-wide Theme Customization**: Fully responsive dark and light mode toggle powered by `next-themes` and Tailwind CSS, persisting user theme preference with zero layout shift.
* **Loading Skeletons & Modern Notifications**: Clean skeleton screens during asynchronous data fetching and toast notifications (`react-hot-toast`) replacing native browser alerts throughout the application.
* **User Profile Customization**: Dedicated profile management dashboard allowing volunteers to update their display names and public avatar photos in real time.

---

## 💻 Tech Stack

* **Frontend Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS, PostCSS, Autoprefixer
* **Theme Management**: `next-themes` (Dark/Light mode)
* **Icons**: `lucide-react` (Featuring the updated **𝕏** logo)
* **Feedback**: `react-hot-toast`
* **Authentication**: JWT Authorization & persistent local sessions

---

## 🛠️ Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/kindredacts-client.git
cd kindredacts-client
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
client/
├── src/
│   ├── app/
│   │   ├── create-event/       # (Private) Create event form with future date check
│   │   ├── events/[id]/        # (Public) Event details view & protected Join action
│   │   ├── joined-events/      # (Private) Joined events sorted by date
│   │   ├── login/              # Sign in with email/pass and social login
│   │   ├── manage-events/      # (Private) Organizer dashboard to update/delete events
│   │   ├── profile/            # (Private) Profile view & update name/avatar
│   │   ├── register/           # Registration with password complexity validator
│   │   ├── upcoming-events/    # Filterable & searchable upcoming events grid
│   │   ├── globals.css         # Tailwind & theme variables
│   │   ├── layout.tsx          # Root layout with Navbar, Footer & Providers
│   │   └── page.tsx            # Home page (Banner, Features, 6 Recent Events, Gallery, Newsletter)
│   ├── components/
│   │   ├── EventCard.tsx       # Uniform dimension event cards
│   │   ├── EventSkeleton.tsx   # Loading skeleton placeholder
│   │   ├── Footer.tsx          # Responsive footer with 𝕏 logo
│   │   ├── Navbar.tsx          # Navigation, theme toggle, and user dropdown
│   │   ├── ProtectedRoute.tsx  # Session verification barrier (prevents refresh redirect)
│   │   └── ThemeProvider.tsx   # Light/Dark mode provider
│   └── context/
│       └── AuthContext.tsx     # Session management & JWT token handling
├── tailwind.config.js
└── README.md
```

# Virasya — AI-Powered Heritage Marketplace

Virasya is a real, functional prototype that connects Indian artisans with global buyers. It uses Firebase for data/auth and Google Genkit (Gemini) for its AI features.

## 🚀 Tech Stack & Architecture 


- **Frontend**: Next.js 15 (App Router) with Tailwind CSS & ShadCN UI.
- **Authentication**: Real Firebase Auth (Google & Email/Password).
- **Database**: Real-time Firestore database.
- **AI Engine**: Google Genkit + Gemini 2.5 Flash for Vision, Translation, and Content Generation.

```
  Users (Artisan / Buyer)
        │
        ▼
Frontend (Next.js UI)
        │
        ▼
Server Actions (Next.js Backend)
        │
 ┌───────────────┬───────────────┐
 ▼               ▼               ▼
Genkit AI        Firebase Auth   Firestore DB
(Gemini 2.5)     (Login/Roles)   (Products, Users)
 │                                 │
 ▼                                 ▼
AI Outputs                    Real-time Sync
Stories, Titles,              Marketplace Data
Marketing, Translation

```

## 🛠 Local Setup (How to implement it)

To run this locally, you need a Firebase project.

1.  **Firebase Console**:
    - Create a project at [console.firebase.google.com](https://console.firebase.google.com).
    - Enable **Authentication** (Google and Email/Password providers).
    - Enable **Cloud Firestore** in "Test Mode" (for development).
2.  **Configuration**:
    - Create a "Web App" in your Firebase project.
    - Copy the `firebaseConfig` object into `src/firebase/config.ts`.
3.  **Environment Variables**:
    - Create a `.env` file in the root.
    - Add `GEMINI_API_KEY=your_google_ai_studio_key`. Get it from [aistudio.google.com](https://aistudio.google.com).
4.  **Install & Run**:
    ```bash
    npm install
    npm run dev
    ```

## 🌐 Deployment (Alternatives to Google Cloud)

Since you want to avoid Google Cloud's premium features, **Vercel** is the best alternative:

1.  **Connect to GitHub**: Push your code to a GitHub repo.
2.  **Vercel Import**: Import the repo into Vercel.
3.  **Environment Variables**: In Vercel's project settings, add:
    - `GEMINI_API_KEY`: Your Gemini key.
    - `NEXT_PUBLIC_FIREBASE_CONFIG`: (Optional) If you want to externalize your Firebase config.
4.  **Firestore Rules**: Ensure you deploy the rules in `firestore.rules` via the Firebase Console so your data is secure.

## 📂 Documentation
- `docs/DATABASE.md`: Deep dive into Firestore structure.
- `docs/AI_INTEGRATIONS.md`: How Genkit flows work.
- `docs/DESIGN.md`: The artisan-focused design language.

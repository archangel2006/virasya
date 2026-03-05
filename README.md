# Virasya — AI-Powered Heritage Marketplace

Virasya is a digital bridge for Indian artisans, combining centuries-old craftsmanship with cutting-edge Generative AI. It empowers creators to reach a global audience while preserving the cultural authenticity of their work.

## 🌟 Key Features

- **AI Vision Pipeline**: Automatically detects craft categories, materials, and styles from a single photo.
- **Authentic Storytelling**: Generates factual heritage narratives based on regional context without fabricating history.
- **Smart Pricing Guidance**: Provides realistic market ranges (midpoint ±10%) based on labor and materials.
- **Multilingual Support**: Real-time translation of listings into Hindi, Tamil, Bengali, Marathi, and English.
- **Social Media Generator**: One-click creation of Instagram, WhatsApp, and promotional content.
- **Heritage Marketplace**: A curated discovery platform for buyers seeking authentic, verified handcrafted art.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI Orchestration**: Google Genkit
- **LLM**: Gemini 2.5 Flash (Vision & Text)
- **Backend**: Firebase (Firestore, Authentication)
- **Hosting**: Firebase App Hosting

## 🚀 Getting Started

1. **Environment Setup**:
   Ensure your `.env` file contains your `GEMINI_API_KEY`.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Genkit UI** (Optional):
   To test AI flows in isolation:
   ```bash
   npm run genkit:dev
   ```

## 📂 Architecture

- `src/ai/flows`: Genkit AI logic (Vision, Translation, Marketing).
- `src/app/dashboard`: Artisan seller tools and upload workflow.
- `src/app/marketplace`: Buyer discovery and product details.
- `src/components/ui`: Thematic ShadCN components.
- `src/firebase`: Real-time data synchronization and auth hooks.

# Deployment Guide

Virasya is designed to be deployed via **Firebase App Hosting**, which provides seamless integration with Next.js and environment variable management.

## 📦 Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to the Firebase Console under the "App Hosting" tab.
2. **Configure Environment Variables**:
   - Navigate to the App Hosting settings in the Firebase Console.
   - Add `GEMINI_API_KEY` to the environment variables.
3. **App Hosting Configuration**:
   The `apphosting.yaml` file is already configured for optimal performance:
   ```yaml
   runConfig:
     maxInstances: 1 # Scalable for prototypes
   ```

## 🧪 Production Environment

- **Database**: Firestore (Production Mode)
- **Auth**: Google & Email/Password providers enabled.
- **Images**: Remote patterns are configured in `next.config.ts` to allow `picsum.photos` and Unsplash for placeholders.

## ⚠️ Known Limits

- **Veo Video Generation**: Currently not active in the main flow due to low rate limits on preview models; however, the framework is ready for integration.
- **Storage**: For the prototype, images are handled as Base64 strings in Firestore. For production scale, move to Firebase Storage.

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDPiYxAqK0U3lJcRIkLp0fox6oMwcNG5QQ",
  authDomain: "bizbot-ai-e721d.firebaseapp.com",
  projectId: "bizbot-ai-e721d",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// ✅ THIS LINE IS THE IMPORTANT ONE
export const auth = getAuth(app)
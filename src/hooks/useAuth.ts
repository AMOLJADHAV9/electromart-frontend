import { useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: "user" | "admin" | "delivery";
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.name || firebaseUser.email?.split("@")[0] || null,
              role: userData.role || "user"
            });
          } else {
            // If user document doesn't exist, create it with default role
            await setDoc(userDocRef, {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
              role: "user",
              createdAt: serverTimestamp(),
              joinDate: new Date().toISOString(),
              totalOrders: 0,
              totalSpent: 0
            });
            
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || null,
              role: "user"
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to basic user info if Firestore fails
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || null,
            role: "user"
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { currentUser, loading };
};

// Login function
export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Register function
export const register = async (email: string, password: string, role: "user" | "admin" | "delivery" = "user") => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user document in Firestore
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    email: email,
    name: email.split("@")[0],
    role: role,
    createdAt: serverTimestamp(),
    joinDate: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0
  });
  
  return userCredential;
};

// Logout function
export const logout = async () => {
  return await firebaseSignOut(auth);
};

// Get ID token for API calls
export const getIdToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
};
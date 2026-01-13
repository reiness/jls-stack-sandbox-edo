import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  signInAnonymously,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface UserContextType {
  userId: string
  user: User | null
  userLabel: string
  setUserId: (id: string) => Promise<void>
}

const TEST_USERS: Record<string, {email: string, pass: string}> = {
  "user-123": { email: "user123@example.com", pass: "password123" },
  "someone-else": { email: "someone@example.com", pass: "password123" }
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState("")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setUserIdState(currentUser.uid)
      } else {
        // Default to anonymous if no user
        signInAnonymously(auth).catch((error) => {
          console.error("Failed to sign in anonymously:", error)
        })
      }
    })

    return () => unsubscribe()
  }, [])

  // Derive user label from email
  const getUserLabel = () => {
    if (user?.email === TEST_USERS["user-123"].email) return "user-123"
    if (user?.email === TEST_USERS["someone-else"].email) return "someone-else"
    return "Anonymous"
  }

  const userLabel = getUserLabel()

  const handleSetUser = async (id: string) => {
    // If the ID matches one of our test users, perform real auth
    if (TEST_USERS[id]) {
      const { email, pass } = TEST_USERS[id]
      try {
        await signInWithEmailAndPassword(auth, email, pass)
      } catch (error: any) {
        // If user doesn't exist (or invalid credential which might happen if we recreated db but not auth), create them
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
          try {
             await createUserWithEmailAndPassword(auth, email, pass)
          } catch (createError) {
             console.error("Failed to create test user:", createError)
          }
        } else {
          console.error("Failed to sign in as test user:", error)
        }
      }
    } else {
      // Fallback for direct ID setting (mostly for internal use or simple state updates)
      // But in this "Real Auth" mode, we mostly rely on onAuthStateChanged to update the state.
      console.warn("Attempted to set user to unknown ID without auth credentials:", id)
    }
  }

  return (
    <UserContext.Provider value={{ userId, setUserId: handleSetUser, user, userLabel }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

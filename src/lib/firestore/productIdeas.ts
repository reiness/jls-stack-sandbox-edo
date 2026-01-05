import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, writeBatch, doc } from "firebase/firestore"

// Collection reference helper
export function productIdeasCol() {
  return collection(db, "productIdeas")
}

// Simple "hello world" write to prove the pipeline
export async function createHelloIdea(ownerId: string) {
  return addDoc(productIdeasCol(), {
    title: "Hello Firestore",
    summary: "This is a proof document created in Lesson 3.1.",
    status: "draft",
    tags: ["week-3", "intro"],
    ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function seedProductIdeas(ownerId: string = "user-123") {
  const batch = writeBatch(db)
  const ideas = [
    {
      title: "Customer Feedback Dashboard",
      summary: "A central hub to aggregate and analyze customer feedback from multiple channels.",
      status: "active",
      tags: ["analytics", "customer-success"],
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Employee Onboarding Tracker",
      summary: "A tool to track the progress of new hires through their onboarding checklist.",
      status: "active",
      tags: ["hr", "internal-tools"],
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Inventory Management System",
      summary: "Real-time tracking of office supplies and equipment.",
      status: "draft",
      tags: ["operations", "logistics"],
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Meeting Notes Archive",
      summary: "Searchable database of all past meeting notes and action items.",
      status: "shipped",
      tags: ["productivity", "knowledge-management"],
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Team Availability Calendar",
      summary: "Visual calendar showing team member availability, time off, and meeting blocks.",
      status: "paused",
      tags: ["scheduling", "collaboration"],
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  ]

  ideas.forEach((idea, index) => {
    const newDocRef = doc(productIdeasCol())
    batch.set(newDocRef, idea)

    // Add 2 notes to the first 2 ideas (index 0 and 1)
    if (index < 2) {
      const notesPath = `productIdeas/${newDocRef.id}/notes`
      // We can use the collection helper approach or just build the path manually for the batch
      // Since we need to create a doc ref inside the subcollection:
      const note1Ref = doc(collection(db, notesPath))
      const note2Ref = doc(collection(db, notesPath))

      batch.set(note1Ref, {
        body: "Research competitor pricing models.",
        authorId: ownerId,
        createdAt: serverTimestamp(),
      })

      batch.set(note2Ref, {
        body: "Schedule meeting with the design team.",
        authorId: ownerId,
        createdAt: serverTimestamp(),
      })
    }
  })

  await batch.commit()
}

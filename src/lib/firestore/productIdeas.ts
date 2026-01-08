import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore"
import type { ProductIdea, ProductIdeaNote, ProductIdeaStatus, ProductIdeaPriority } from "@/types/productIdeas"

// Collection references
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
  
  const devs = [
    { id: "dev-001", name: "Alex Rivera" },
    { id: "dev-002", name: "Jordan Smith" },
    { id: "dev-003", name: "Taylor Chen" },
    { id: "dev-004", name: "Casey Morgan" },
    { id: "dev-005", name: "Riley Quinn" },
    { id: "dev-006", name: "Jamie Lee" },
    { id: "dev-007", name: "Morgan Drew" },
    { id: "dev-008", name: "Skyler Pax" },
    { id: "dev-009", name: "Charlie Bell" },
    { id: "dev-010", name: "Robin West" }
  ]

  const getRandomDevId = () => devs[Math.floor(Math.random() * devs.length)].id
  
  const getRandomTargetDate = () => {
    const date = new Date()
    // Random months between 1 and 3
    const monthsToAdd = Math.floor(Math.random() * 3) + 1
    date.setMonth(date.getMonth() + monthsToAdd)
    return Timestamp.fromDate(date)
  }

  const ideas = [
    {
      title: "Customer Feedback Dashboard",
      summary: "A central hub to aggregate and analyze customer feedback from multiple channels.",
      status: "active",
      priority: "high",
      tags: ["analytics", "customer-success"],
      ownerId,
      assigneeId: getRandomDevId(),
      targetDate: getRandomTargetDate(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Employee Onboarding Tracker",
      summary: "A tool to track the progress of new hires through their onboarding checklist.",
      status: "active",
      priority: "medium",
      tags: ["hr", "internal-tools"],
      ownerId,
      assigneeId: getRandomDevId(),
      targetDate: getRandomTargetDate(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Inventory Management System",
      summary: "Real-time tracking of office supplies and equipment.",
      status: "draft",
      priority: "low",
      tags: ["operations", "logistics"],
      ownerId,
      assigneeId: getRandomDevId(),
      targetDate: getRandomTargetDate(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Meeting Notes Archive",
      summary: "Searchable database of all past meeting notes and action items.",
      status: "shipped",
      priority: "medium",
      tags: ["productivity", "knowledge-management"],
      ownerId,
      assigneeId: getRandomDevId(),
      targetDate: getRandomTargetDate(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Team Availability Calendar",
      summary: "Visual calendar showing team member availability, time off, and meeting blocks.",
      status: "paused",
      priority: "low",
      tags: ["scheduling", "collaboration"],
      ownerId,
      assigneeId: getRandomDevId(),
      targetDate: getRandomTargetDate(),
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

export function productIdeaDoc(ideaId: string) {
  return doc(db, "productIdeas", ideaId)
}

export function productIdeaNotesCol(ideaId: string) {
  return collection(db, "productIdeas", ideaId, "notes")
}

export function productIdeaNoteDoc(ideaId: string, noteId: string) {
  return doc(db, "productIdeas", ideaId, "notes", noteId)
}


// Create a new product idea
export async function createProductIdea(input: {
  title: string
  summary: string
  status?: ProductIdeaStatus
  priority?: ProductIdeaPriority
  tags?: string[]
  ownerId: string
  assigneeId?: string
  targetDate?: Timestamp
}) {
  const docRef = await addDoc(productIdeasCol(), {
    title: input.title,
    summary: input.summary,
    status: input.status ?? "draft",
    priority: input.priority ?? "medium",
    tags: input.tags ?? [],
    ownerId: input.ownerId,
    assigneeId: input.assigneeId ?? null,
    targetDate: input.targetDate ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

// Create a new note for an idea
export async function createProductIdeaNote(
  ideaId: string,
  input: {
    body: string
    authorId: string
  }
) {
  const docRef = await addDoc(productIdeaNotesCol(ideaId), {
    body: input.body,
    authorId: input.authorId,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}




// Get a single product idea by ID
export async function getProductIdea(ideaId: string): Promise<ProductIdea | null> {
  const docSnap = await getDoc(productIdeaDoc(ideaId))
  
  if (!docSnap.exists()) {
    return null
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as ProductIdea
}

// Get all product ideas
export async function getAllProductIdeas(): Promise<ProductIdea[]> {
  const q = query(productIdeasCol(), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductIdea[]
}

// Get product ideas filtered by status
export async function getProductIdeasByStatus(status: ProductIdeaStatus): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(), 
    where("status", "==", status),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductIdea[]
}

// Get ideas filtered by owner
export async function getProductIdeasByOwner(
  ownerId: string
): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductIdea[]
}

// Get ideas filtered by tag
export async function getProductIdeasByTag(
  tag: string
): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(),
    where("tags", "array-contains", tag),
    orderBy("createdAt", "desc")
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductIdea[]
}

export interface ProductIdeaFilters {
  status?: ProductIdeaStatus
  ownerId?: string
  tag?: string
}

export async function getFilteredProductIdeas(
  filters: ProductIdeaFilters = {}
): Promise<ProductIdea[]> {
  let q = query(productIdeasCol(), orderBy("createdAt", "desc"))
  
  if (filters.status) {
    q = query(q, where("status", "==", filters.status))
  }
  
  if (filters.ownerId) {
    q = query(q, where("ownerId", "==", filters.ownerId))
  }
  
  if (filters.tag) {
    q = query(q, where("tags", "array-contains", filters.tag))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductIdea[]
}

// Get notes for a specific idea
export async function getProductIdeaNotes(ideaId: string): Promise<ProductIdeaNote[]> {
  const q = query(productIdeaNotesCol(ideaId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductIdeaNote[]
}


// Update a product idea
export async function updateProductIdea(
  ideaId: string,
  updates: Partial<Pick<ProductIdea, "title" | "summary" | "status" | "priority" | "tags" | "assigneeId" | "targetDate">>
) {
  await updateDoc(productIdeaDoc(ideaId), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// Delete a product idea
export async function deleteProductIdea(ideaId: string) {
  await deleteDoc(productIdeaDoc(ideaId))
}

// Delete a note
export async function deleteProductIdeaNote(ideaId: string, noteId: string) {
  await deleteDoc(productIdeaNoteDoc(ideaId, noteId))
}

// Clear all product ideas and their subcollections
export async function clearProductIdeas() {
  const snapshot = await getDocs(productIdeasCol())
  
  const deletePromises = snapshot.docs.map(async (ideaDoc) => {
    // 1. Delete all notes in the subcollection
    const notesSnapshot = await getDocs(productIdeaNotesCol(ideaDoc.id))
    const noteDeletePromises = notesSnapshot.docs.map((noteDoc) => 
      deleteDoc(noteDoc.ref)
    )
    await Promise.all(noteDeletePromises)
    
    // 2. Delete the parent idea document
    return deleteDoc(ideaDoc.ref)
  })
  
  await Promise.all(deletePromises)
}
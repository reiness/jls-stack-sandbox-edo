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
  orderBy,
  serverTimestamp,
  where,
  limit,
  startAfter,
  writeBatch,
  Timestamp,
  DocumentSnapshot,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore"
import { faker } from "@faker-js/faker"
import type { ProductIdea, ProductIdeaNote, ProductIdeaStatus, ProductIdeaPriority } from "@/types/productIdeas"

// --- TYPES (From New Update) ---
// Note: These align with @/types/productIdeas but are re-exported or used locally for the snippet logic.
export type { ProductIdea, ProductIdeaStatus }

// --- COLLECTION REFERENCE ---
const ideasCol = collection(db, "productIdeas")

// --- HELPER (From New Update) ---
function normalizeIdea(id: string, data: Record<string, unknown>): ProductIdea {
  return {
    id,
    title: (data.title as string) ?? "",
    summary: (data.summary as string) ?? "",
    status: (data.status as ProductIdeaStatus) ?? "draft",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    ownerId: (data.ownerId as string) ?? "",
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
    archivedAt: (data.archivedAt as Timestamp) ?? null,
    // Merge existing features: preserve fields used in current UI
    priority: (data.priority as ProductIdeaPriority) ?? "medium",
    assigneeId: data.assigneeId as string | undefined,
    targetDate: data.targetDate as Timestamp | undefined,
  }
}

// --- NEW CRUD API (Newest Update) ---

export async function listActiveIdeas(ownerId?: string): Promise<ProductIdea[]> {
  // Active = not archived
  let q = query(ideasCol, where("archivedAt", "==", null), orderBy("createdAt", "desc"))
  
  if (ownerId) {
    q = query(q, where("ownerId", "==", ownerId))
  }

  console.log("listActiveIdeas: Executing query...", { ownerId })
  const snap = await getDocs(q)
  return snap.docs.map(d => normalizeIdea(d.id, d.data()))
}

export async function getIdeaById(id: string): Promise<ProductIdea | null> {
  const ref = doc(db, "productIdeas", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return normalizeIdea(snap.id, snap.data())
}

export async function createIdea(input: {
  title: string
  summary: string
  status: ProductIdeaStatus
  tags: string[]
  ownerId: string
}) {
  // addDoc is the standard way to create a doc with an auto-id
  return addDoc(ideasCol, {
    ...input,
    archivedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateIdea(
  id: string,
  patch: Partial<Pick<ProductIdea, "title" | "summary" | "status" | "tags">>
) {
  const ref = doc(db, "productIdeas", id)
  // updateDoc updates selected fields
  return updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

export async function archiveIdea(id: string) {
  const ref = doc(db, "productIdeas", id)
  return updateDoc(ref, {
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function restoreIdea(id: string) {
  const ref = doc(db, "productIdeas", id)
  return updateDoc(ref, {
    archivedAt: null,
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToActiveIdeas(
  onNext: (ideas: ProductIdea[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  // Active ideas: archivedAt == null, newest created first (to match existing indices)
  const q = query(
    ideasCol,
    where("archivedAt", "==", null),
    orderBy("createdAt", "desc")
  )

  return onSnapshot(
    q,
    (snap) => {
      const ideas = snap.docs.map((d) => normalizeIdea(d.id, d.data()))
      onNext(ideas)
    },
    (err) => onError?.(err)
  )
}

export function subscribeToIdeaById(
  id: string,
  onNext: (idea: ProductIdea | null) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const ref = doc(db, "productIdeas", id)

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onNext(null)
        return
      }
      onNext(normalizeIdea(snap.id, snap.data()))
    },
    (err) => onError?.(err)
  )
}

export async function touchIdea(id: string) {
  const ref = doc(db, "productIdeas", id)
  return updateDoc(ref, { updatedAt: serverTimestamp() })
}

// --- EXISTING FEATURES (Preserved) ---

export type ProductIdeaCursor = DocumentSnapshot

export function productIdeasCol() {
  return ideasCol
}

export async function createHelloIdea(ownerId: string) {
  return addDoc(ideasCol, {
    title: "Hello Firestore",
    summary: "This is a proof document created in Lesson 3.1.",
    status: "draft",
    tags: ["week-3", "intro"],
    ownerId,
    archivedAt: null,
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
  const getRandomTargetDate = () => Timestamp.fromDate(faker.date.future())
  const statuses: ProductIdeaStatus[] = ["draft", "active", "paused", "shipped"]
  const priorities: ProductIdeaPriority[] = ["low", "medium", "high"]
  const possibleTags = ["analytics", "customer-success", "hr", "internal-tools", "operations", "logistics", "productivity", "ai", "mobile", "design"]

  for (let i = 0; i < 7; i++) {
    const newDocRef = doc(ideasCol)
    const idea = {
      title: faker.company.catchPhrase(),
      summary: faker.commerce.productDescription(),
      status: faker.helpers.arrayElement(statuses),
      priority: faker.helpers.arrayElement(priorities),
      tags: faker.helpers.arrayElements(possibleTags, Math.floor(Math.random() * 3) + 1),
      ownerId,
      assigneeId: getRandomDevId(),
      targetDate: getRandomTargetDate(),
      archivedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    batch.set(newDocRef, idea)
    if (i < 3) {
      const notesPath = `productIdeas/${newDocRef.id}/notes`
      for (let j = 0; j < Math.floor(Math.random() * 3) + 2; j++) {
        const noteRef = doc(collection(db, notesPath))
        batch.set(noteRef, {
          body: faker.hacker.phrase(),
          authorId: ownerId,
          createdAt: serverTimestamp(),
        })
      }
    }
  }
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
  const docRef = await addDoc(ideasCol, {
    title: input.title,
    summary: input.summary,
    status: input.status ?? "draft",
    priority: input.priority ?? "medium",
    tags: input.tags ?? [],
    ownerId: input.ownerId,
    assigneeId: input.assigneeId ?? null,
    targetDate: input.targetDate ?? null,
    archivedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function createProductIdeaNote(ideaId: string, input: { body: string, authorId: string }) {
  const docRef = await addDoc(productIdeaNotesCol(ideaId), {
    body: input.body,
    authorId: input.authorId,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getProductIdea(ideaId: string): Promise<ProductIdea | null> {
  return getIdeaById(ideaId)
}

export async function getAllProductIdeas(): Promise<ProductIdea[]> {
  const q = query(ideasCol, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => normalizeIdea(doc.id, doc.data()))
}

export async function getProductIdeasByStatus(status: ProductIdeaStatus): Promise<ProductIdea[]> {
  const q = query(ideasCol, where("status", "==", status), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => normalizeIdea(doc.id, doc.data()))
}

export async function getProductIdeasByOwner(ownerId: string): Promise<ProductIdea[]> {
  const q = query(ideasCol, where("ownerId", "==", ownerId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => normalizeIdea(doc.id, doc.data()))
}

export async function getProductIdeasByTag(tag: string): Promise<ProductIdea[]> {
  const q = query(ideasCol, where("tags", "array-contains", tag), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => normalizeIdea(doc.id, doc.data()))
}

export interface ProductIdeaFilters {
  status?: ProductIdeaStatus
  ownerId?: string
  tag?: string
  archived?: boolean
}

export async function getFilteredProductIdeas(filters: ProductIdeaFilters = {}): Promise<ProductIdea[]> {
  let q = query(ideasCol, orderBy("createdAt", "desc"))
  if (filters.status) q = query(q, where("status", "==", filters.status))
  if (filters.ownerId) q = query(q, where("ownerId", "==", filters.ownerId))
  if (filters.tag) q = query(q, where("tags", "array-contains", filters.tag))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => normalizeIdea(doc.id, doc.data()))
}

export async function getProductIdeasPaginated(
  pageSize: number = 5,
  lastDoc?: ProductIdeaCursor,
  filters: ProductIdeaFilters = {}
): Promise<{ ideas: ProductIdea[], lastDoc: ProductIdeaCursor | null, hasMore: boolean }> {
  let q = query(ideasCol)

  if (filters.archived === true) {
    q = query(q, where("archivedAt", "!=", null), orderBy("archivedAt", "desc"), orderBy("createdAt", "desc"))
  } else {
    q = query(q, where("archivedAt", "==", null), orderBy("createdAt", "desc"))
  }

  if (filters.status) q = query(q, where("status", "==", filters.status))
  if (filters.ownerId) q = query(q, where("ownerId", "==", filters.ownerId))
  if (filters.tag) q = query(q, where("tags", "array-contains", filters.tag))
  if (lastDoc) q = query(q, startAfter(lastDoc))
  q = query(q, limit(pageSize + 1))
  const snapshot = await getDocs(q)
  const ideas = snapshot.docs.slice(0, pageSize).map((doc) => normalizeIdea(doc.id, doc.data()))
  const hasMore = snapshot.docs.length > pageSize
  const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[ideas.length - 1] : null
  return { ideas, lastDoc: lastVisible, hasMore }
}

export async function getProductIdeaNotes(ideaId: string): Promise<ProductIdeaNote[]> {
  const q = query(productIdeaNotesCol(ideaId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ProductIdeaNote[]
}

export async function updateProductIdea(ideaId: string, updates: Partial<ProductIdea>) {
  await updateDoc(productIdeaDoc(ideaId), { ...updates, updatedAt: serverTimestamp() })
}

export async function deleteProductIdea(ideaId: string) {
  await deleteDoc(productIdeaDoc(ideaId))
}

export async function updateProductIdeaNote(ideaId: string, noteId: string, body: string) {
  await updateDoc(productIdeaNoteDoc(ideaId, noteId), {
    body,
  })
}

export async function deleteProductIdeaNote(ideaId: string, noteId: string) {
  await deleteDoc(productIdeaNoteDoc(ideaId, noteId))
}

export async function clearProductIdeas() {
  const snapshot = await getDocs(ideasCol)
  const deletePromises = snapshot.docs.map(async (ideaDoc) => {
    const notesSnapshot = await getDocs(productIdeaNotesCol(ideaDoc.id))
    for (const noteDoc of notesSnapshot.docs) await deleteDoc(noteDoc.ref)
    return deleteDoc(ideaDoc.ref)
  })
  await Promise.all(deletePromises)
}

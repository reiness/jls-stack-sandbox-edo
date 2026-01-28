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
  startAt,
  endAt,
  writeBatch,
  Timestamp,
  DocumentSnapshot,
  onSnapshot,
  type Unsubscribe,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { faker } from "@faker-js/faker"
import type { ProductIdea, ProductIdeaNote, ProductIdeaStatus, ProductIdeaPriority } from "@/types/productIdeas"

// --- TYPES (From New Update) ---
// Note: These align with @/types/productIdeas but are re-exported or used locally for the snippet logic.
export type { ProductIdea, ProductIdeaStatus }

// --- COLLECTION REFERENCE ---
const ideasCol = collection(db, "productIdeas")

function normalizeTitleLower(title: string) {
  return title.trim().toLowerCase()
}

function normalizeTags(tags: string[]) {
  const cleaned = tags
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)

  // de-dupe while preserving order
  return Array.from(new Set(cleaned))
}

// --- HELPER (From New Update) ---
function normalizeIdea(id: string, data: Record<string, unknown>): ProductIdea {
  const title = (data.title as string) ?? ""

  return {
    id,
    title,
    titleLower: (data.titleLower as string) ?? normalizeTitleLower(title),
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
  const titleLower = normalizeTitleLower(input.title)
  const tags = normalizeTags(input.tags)

  return addDoc(ideasCol, {
    ...input,
    titleLower,
    tags,
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

  const next: any = {
    ...patch,
    updatedAt: serverTimestamp(),
  }

  if (typeof patch.title === "string") {
    next.titleLower = normalizeTitleLower(patch.title)
  }

  if (Array.isArray(patch.tags)) {
    next.tags = normalizeTags(patch.tags)
  }

  return updateDoc(ref, next)
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

// --- EXISTING FEATURES (Preserved) ---

export type ProductIdeaCursor = DocumentSnapshot

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
    const title = faker.company.catchPhrase()
    const tags = faker.helpers.arrayElements(possibleTags, Math.floor(Math.random() * 3) + 1)

    const idea = {
      title,
      titleLower: normalizeTitleLower(title),
      summary: faker.commerce.productDescription(),
      status: faker.helpers.arrayElement(statuses),
      priority: faker.helpers.arrayElement(priorities),
      tags: normalizeTags(tags),
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

export type IdeaListStatus = ProductIdeaStatus | "all"

export type IdeaListFilters = {
  status?: IdeaListStatus
  tag?: string
  q?: string
  archived?: boolean
}

export type IdeasPageResult = {
  items: ProductIdea[]
  nextCursor: QueryDocumentSnapshot<DocumentData> | null
}

export async function fetchIdeasPage(options: {
  filters: IdeaListFilters
  pageSize: number
  cursor: QueryDocumentSnapshot<DocumentData> | null
}): Promise<IdeasPageResult> {
  const { filters, pageSize, cursor } = options

  const clauses: any[] = []

  // Archived filter
  if (filters.archived) {
    clauses.push(where("archivedAt", "!=", null))
  } else {
    clauses.push(where("archivedAt", "==", null))
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    clauses.push(where("status", "==", filters.status))
  }

  // Tag filter (single tag)
  if (filters.tag && filters.tag !== "all") {
    clauses.push(where("tags", "array-contains", filters.tag.toLowerCase()))
  }

  const qRaw = (filters.q ?? "").trim().toLowerCase()
  const hasSearch = qRaw.length > 0

  // Ordering strategy:
  // - If searching: order by titleLower so we can do prefix search with cursors
  // - Otherwise: order by updatedAt desc (more "product-like")
  let qBuilt = hasSearch
    ? query(ideasCol, ...clauses, orderBy("titleLower", "asc"))
    : query(ideasCol, ...clauses, orderBy("updatedAt", "desc"))

  // Prefix search (only if searching)
  // Uses ordered cursors: startAt(q) ... endAt(q + "\uf8ff")
  // This is a standard Firestore cursor technique. :contentReference[oaicite:13]{index=13}
  if (hasSearch) {
    qBuilt = query(qBuilt, startAt(qRaw), endAt(qRaw + "\uf8ff"))
  }

  // Pagination
  qBuilt = cursor
    ? query(qBuilt, startAfter(cursor), limit(pageSize))
    : query(qBuilt, limit(pageSize))

  const snap = await getDocs(qBuilt)
  const items = snap.docs.map((d) => normalizeIdea(d.id, d.data()))

  const nextCursor =
    snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null

  return { items, nextCursor }
}

export async function getProductIdeaNotes(ideaId: string): Promise<ProductIdeaNote[]> {
  const q = query(productIdeaNotesCol(ideaId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ProductIdeaNote[]
}

export async function updateProductIdea(ideaId: string, updates: Partial<ProductIdea>) {
  await updateDoc(productIdeaDoc(ideaId), { ...updates, updatedAt: serverTimestamp() })
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

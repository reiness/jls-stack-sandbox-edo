import { db } from "@/lib/firebase"
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
  type Unsubscribe,
} from "firebase/firestore"

export type IdeaNote = {
  id: string
  body: string
  authorId: string
  createdAt?: any
}

function notesCol(ideaId: string) {
  return collection(db, "productIdeas", ideaId, "notes")
}

export function subscribeToIdeaNotes(
  ideaId: string,
  onNext: (notes: IdeaNote[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const q = query(notesCol(ideaId), orderBy("createdAt", "desc"))

  return onSnapshot(
    q,
    (snap) => {
      const notes = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as IdeaNote[]
      onNext(notes)
    },
    (err) => onError?.(err)
  )
}

export async function addIdeaNote(ideaId: string, input: { body: string; authorId: string }) {
  return addDoc(notesCol(ideaId), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

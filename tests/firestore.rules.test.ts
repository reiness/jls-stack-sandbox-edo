import { describe, test, beforeAll, afterAll, beforeEach } from 'vitest';

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  Firestore
} from "firebase/firestore"
import { readFileSync } from "fs"

let testEnv: RulesTestEnvironment

const rules = readFileSync("firestore.rules", "utf8")

// Test data factory
function createTestIdea(ownerId: string, overrides = {}) {
  return {
    title: "Test Idea",
    summary: "A test product idea",
    status: "draft",
    ownerId,
    tags: ["test"],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

function createTestNote(authorId: string, overrides = {}) {
  return {
    body: "Test note content",
    authorId,
    createdAt: new Date(),
    ...overrides,
  }
}

// Setup helper to create data without rules
async function setupTestData(callback: (db: Firestore) => Promise<void>) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await callback(context.firestore() as unknown as Firestore)
  })
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "test-project-3-6",
    firestore: {
      rules,
      host: "127.0.0.1",
      port: 8080,
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

// ============================================
// 1. productIdeas collection (minimum 8 tests)
// ============================================

describe("productIdeas collection", () => {
  
  test("1. Unauthenticated users cannot read ideas", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(getDoc(doc(db, "productIdeas", "idea-1")))
  })
  
  test("2. Authenticated users cannot read others' ideas", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("other-user"))
    })
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(getDoc(doc(db, "productIdeas", "idea-1")))
  })

  test("2b. Authenticated users can read their own ideas", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(getDoc(doc(db, "productIdeas", "idea-1")))
  })
  
  test("3. Users can create ideas they own", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(addDoc(collection(db, "productIdeas"), createTestIdea("user-1")))
  })
  
  test("4. Users cannot create ideas owned by others", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(addDoc(collection(db, "productIdeas"), createTestIdea("user-2")))
  })
  
  test("5. Owners can update their ideas", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(updateDoc(doc(db, "productIdeas", "idea-1"), { title: "Updated" }))
  })
  
  test("6. Non-owners cannot update ideas", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertFails(updateDoc(doc(db, "productIdeas", "idea-1"), { title: "Hacked" }))
  })
  
  test("7. Owners can delete their ideas", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(deleteDoc(doc(db, "productIdeas", "idea-1")))
  })
  
  test("8. Non-owners cannot delete ideas", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertFails(deleteDoc(doc(db, "productIdeas", "idea-1")))
  })

})

// ============================================
// 2. notes subcollection (minimum 4 tests)
// ============================================

describe("notes subcollection", () => {
  
  beforeEach(async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
      await setDoc(doc(db, "productIdeas", "idea-1", "notes", "note-1"), createTestNote("user-1"))
    })
  })
  
  test("1. Authenticated users can read notes", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertSucceeds(getDoc(doc(db, "productIdeas", "idea-1", "notes", "note-1")))
  })
  
  test("2. Users can create notes they author", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertSucceeds(addDoc(collection(db, "productIdeas", "idea-1", "notes"), createTestNote("user-2")))
  })
  
  test("3. Users cannot create notes authored by others", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertFails(addDoc(collection(db, "productIdeas", "idea-1", "notes"), createTestNote("user-1")))
  })
  
  test("4. Authors can delete their own notes", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(deleteDoc(doc(db, "productIdeas", "idea-1", "notes", "note-1")))
  })

})

// ============================================
// 3. Validation tests (minimum 2 tests)
// ============================================

describe("Validation tests", () => {
  
  test("1. Create fails with invalid data (e.g., invalid status)", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(addDoc(collection(db, "productIdeas"), createTestIdea("user-1", { status: "invalid" })))
  })
  
  test("2. Update fails with invalid data", async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(updateDoc(doc(db, "productIdeas", "idea-1"), { status: "invalid" }))
  })

  test("3. Create fails if summary is too long", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(addDoc(collection(db, "productIdeas"), createTestIdea("user-1", { summary: "a".repeat(1001) })))
  })

  test("4. Create fails if priority is invalid", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(addDoc(collection(db, "productIdeas"), createTestIdea("user-1", { priority: "very-high" })))
  })

  test("5. Create succeeds with valid priority", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(addDoc(collection(db, "productIdeas"), createTestIdea("user-1", { priority: "high" })))
  })

})

// ============================================
// 4. Extension & Advanced Security
// ============================================

describe("Extension & Advanced Security", () => {
  
  beforeEach(async () => {
    await setupTestData(async (db) => {
      await setDoc(doc(db, "productIdeas", "idea-1"), createTestIdea("user-1"))
    })
  })
  
  test("1. Test admin permissions (Admin can update any idea)", async () => {
    const db = testEnv.authenticatedContext("admin-user", { admin: true }).firestore()
    await assertSucceeds(updateDoc(doc(db, "productIdeas", "idea-1"), { title: "Admin Update" }))
  })

  test("2. Test admin permissions (Admin update must still be valid)", async () => {
    const db = testEnv.authenticatedContext("admin-user", { admin: true }).firestore()
    await assertFails(updateDoc(doc(db, "productIdeas", "idea-1"), { status: "invalid-status" }))
  })
  
  test("3. Test that ownerId cannot be changed on update", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(updateDoc(doc(db, "productIdeas", "idea-1"), { ownerId: "user-2" }))
  })

  test("4. Test that createdAt cannot be changed on update", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(updateDoc(doc(db, "productIdeas", "idea-1"), { createdAt: new Date(2000, 1, 1) }))
  })

  test("5. Test that notes must have a createdAt timestamp", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    const noteWithoutDate = { body: "No date", authorId: "user-1" }
    await assertFails(addDoc(collection(db, "productIdeas", "idea-1", "notes"), noteWithoutDate))
  })

})

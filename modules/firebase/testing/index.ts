import { Firestore } from 'firebase-admin/firestore'

export const clearFirestore = async () => {
  const projectId = process.env.GOOGLE_PROJECT

  await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`, {
    method: 'DELETE',
  })
}

export const fetchFirst = async (firestore: Firestore, collectionId: string) => {
  const query = firestore.collectionGroup(collectionId).limit(1)
  const snapshot = await query.get()

  return snapshot.docs[0]?.data()
}

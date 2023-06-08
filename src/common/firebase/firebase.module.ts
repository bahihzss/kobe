import { Module } from '@nestjs/common'
import { getFirestore } from 'firebase-admin/lib/firestore'
import { App, initializeApp } from 'firebase-admin/app'
import { Firestore } from 'firebase-admin/firestore'

const app: App = initializeApp()
const firestore = getFirestore(app)

@Module({
  providers: [
    {
      provide: Firestore,
      useValue: firestore,
    },
  ],
})
export class FirebaseModule {}

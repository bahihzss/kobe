import { Module } from '@nestjs/common'
import { App, initializeApp } from 'firebase-admin/app'
import { Firestore, getFirestore } from 'firebase-admin/firestore'
import { Refs } from './utils'

const app: App = initializeApp()
const firestore: Firestore = getFirestore(app)

@Module({
  providers: [
    {
      provide: Firestore,
      useValue: firestore,
    },
    Refs,
  ],
  exports: [Firestore, Refs],
})
export class FirebaseModule {}

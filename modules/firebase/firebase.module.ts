import { Module, Scope } from '@nestjs/common'
import { App, initializeApp } from 'firebase-admin/app'
import { Firestore, getFirestore } from 'firebase-admin/firestore'
import { ConfigModule } from '@nestjs/config'

let firestore: Firestore

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: Firestore,
      useFactory() {
        if (!firestore) {
          const app: App = initializeApp()
          firestore = getFirestore(app)
        }

        return firestore
      },
    },
  ],
  exports: [Firestore],
})
export class FirebaseModule {}

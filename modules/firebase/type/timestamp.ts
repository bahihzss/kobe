import { Stack } from '@kobe/common/infra/type'
import { Timestamp as FirebaseTimestamp } from 'firebase-admin/firestore'

export type Timestamp<S extends Stack> = S extends 'write' ? Date : FirebaseTimestamp

import { SerializedValue } from './serialized.inteface'

export interface IValue<T extends SerializedValue> {
  readonly type: string
  readonly value: T

  equals(other: IValue<T>): boolean
}

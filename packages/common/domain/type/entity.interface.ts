import { Serialized } from './serialized.inteface'

export interface IEntity {
  equals(other: IEntity): boolean
  serialize(): Serialized
}

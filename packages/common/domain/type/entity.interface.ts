import { Serialized } from './serialized.inteface'

export interface IEntity {
  serialize(): Serialized
}

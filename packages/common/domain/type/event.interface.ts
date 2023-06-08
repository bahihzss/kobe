import { Serialized } from './serialized.inteface'

export interface IEvent {
  serialize(): {
    type: string
    payload: Serialized
  }
}

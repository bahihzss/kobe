import { IEntity } from './entity.interface'
import { IValue } from './value.interface'

type SerializedItem<T> = T extends IValue<infer U> ? U : T extends IEntity ? ReturnType<T['serialize']> : never

export interface ICollection<T extends IValue<any> | IEntity> {
  readonly type: string

  serialize(): SerializedItem<T>[]
}

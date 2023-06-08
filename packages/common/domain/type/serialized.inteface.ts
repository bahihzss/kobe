export type SerializedValue = string | number | boolean | Date | Serialized | SerializedValue[]
export type Serialized = { [key: string]: SerializedValue }

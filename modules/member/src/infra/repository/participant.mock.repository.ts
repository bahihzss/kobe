import { ParticipantRepository } from '@domain/participant/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ParticipantMockRepository implements ParticipantRepository {
  store = jest.fn()
  findById = jest.fn()
  findByEmail = jest.fn()
}

import { EnrollNewParticipantCommandHandler } from '@domain/participant/commands'
import { CreateTeamCommandHandler } from '@domain/team/commands'

export const commandHandlers = [EnrollNewParticipantCommandHandler, CreateTeamCommandHandler]

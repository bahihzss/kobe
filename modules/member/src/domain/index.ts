import { EnrollNewParticipantCommandHandler } from '@domain/participant/commands'
import { AddMemberCommandHandler, CreateTeamCommandHandler } from '@domain/team/commands'
import { OpenTeamFinder } from '@domain/team/services'

export const commandHandlers = [EnrollNewParticipantCommandHandler, CreateTeamCommandHandler, AddMemberCommandHandler]
export const domainServices = [OpenTeamFinder]

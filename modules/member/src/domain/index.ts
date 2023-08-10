import { EnrollNewParticipantCommandHandler } from '@domain/participant/commands'
import { EmailDuplicationChecker } from '@domain/participant/services/email-duplication-checker'
import { AddTeamMemberCommandHandler, CreateTeamCommandHandler } from '@domain/team/commands'
import { OpenTeamFinder } from '@domain/team/services'

export const commandHandlers = [
  EnrollNewParticipantCommandHandler,
  CreateTeamCommandHandler,
  AddTeamMemberCommandHandler,
]
export const domainServices = [OpenTeamFinder, EmailDuplicationChecker]

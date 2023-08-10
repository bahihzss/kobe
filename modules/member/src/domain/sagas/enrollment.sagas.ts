import { ParticipantEnrolled } from '@domain/participant/events'
import { AddTeamMemberCommand } from '@domain/team/commands'
import { ofType, Saga } from '@nestjs/cqrs'
import { map, Observable } from 'rxjs'

export class EnrollmentSagas {
  @Saga()
  participantEnrolled = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(ParticipantEnrolled),
      map((event) => new AddTeamMemberCommand(event.participantId)),
    )
  }
}

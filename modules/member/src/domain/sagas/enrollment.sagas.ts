import { ParticipantEnrolled } from '@domain/participant/events'
import { AddMemberCommand } from '@domain/team/commands'
import { ofType, Saga } from '@nestjs/cqrs'
import { map, Observable } from 'rxjs'

export class EnrollmentSagas {
  @Saga()
  participantEnrolled = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(ParticipantEnrolled),
      map((event) => new AddMemberCommand(event.participantId)),
    )
  }
}

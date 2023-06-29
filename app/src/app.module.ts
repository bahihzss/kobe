/* istanbul ignore file */
import { ChallengeModule } from '@kobe/challenge'
import { FirebaseModule } from '@kobe/firebase'
import { MemberCommandModule } from '@kobe/member'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), MemberCommandModule, ChallengeModule],
})
export class AppModule {}

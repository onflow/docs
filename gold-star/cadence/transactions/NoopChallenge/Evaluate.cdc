import "GoldStar"
import "NoopChallenge"

transaction {
    let challengeType: Type
    let submission: &{GoldStar.Submission}

    prepare(signer: auth(BorrowValue) &Account) {
        let profile = signer.storage
            .borrow<auth(GoldStar.UpdateSubmissions) &GoldStar.Profile>(from: GoldStar.profileStoragePath)
            ?? panic("could not borrow reference to the Profile resource")

        let submission <- NoopChallenge.createSubmission()
        self.challengeType = Type<@NoopChallenge.Challenge>()
        self.submission = profile.submissions.add(
            <-submission,
            challengeType: self.challengeType
        )
    }

    execute {
        let challenge = GoldStar.challenges[self.challengeType]
            ?? panic("challenge not found")

        challenge.evaluate(submission: self.submission)
        assert(self.submission.isAccepted())
    }
}

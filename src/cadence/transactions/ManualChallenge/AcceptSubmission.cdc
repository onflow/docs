import "GoldStar"
import "ManualChallenge"

transaction(profile: Address) {
    let evaluator: &ManualChallenge.Evaluator

    prepare(signer: auth(BorrowValue) &Account) {
        self.evaluator = signer.storage
            .borrow<&ManualChallenge.Evaluator>(from: ManualChallenge.evaluatorStoragePath)
            ?? panic("could not borrow reference to the Evaluator resource")
    }

    execute {
        let challengeType = Type<@ManualChallenge.Challenge>()

        let profile = getAccount(profile)
            .capabilities.borrow<&GoldStar.Profile>(GoldStar.profilePublicPath)
            ?? panic("could not borrow reference to the Profile resource")

        let submission = profile.submissions.submissions[challengeType]
            ?? panic("submission not found")

        let manualChallengeSubmission = submission as? &ManualChallenge.Submission
            ?? panic("invalid submission type")

        self.evaluator.accept(submission: manualChallengeSubmission)

        assert(submission.isAccepted())
    }
}

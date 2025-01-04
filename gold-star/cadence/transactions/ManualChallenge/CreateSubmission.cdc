import "GoldStar"
import "ManualChallenge"

transaction {

    let profile: auth(GoldStar.UpdateSubmissions) &GoldStar.Profile

    prepare(signer: auth(BorrowValue) &Account) {
        self.profile = signer.storage
            .borrow<auth(GoldStar.UpdateSubmissions) &GoldStar.Profile>(from: GoldStar.profileStoragePath)
            ?? panic("could not borrow reference to the Profile resource")
    }

    execute {
        let challengeType = Type<@ManualChallenge.Challenge>()
        if self.profile.submissions.submissions[challengeType] == nil {
            let submission <- ManualChallenge.createSubmission()
            self.profile.submissions.add(
                <-submission,
                challengeType: challengeType
            )
        }
    }
}

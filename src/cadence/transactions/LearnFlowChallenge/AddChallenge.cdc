import "GoldStar"
import "LearnFlowChallenge"

transaction {
    let admin: &GoldStar.Admin

    prepare(signer: auth(BorrowValue) &Account) {
        self.admin = signer.storage.borrow<&GoldStar.Admin>(from: GoldStar.adminStoragePath)
            ?? panic("could not borrow reference to the Admin resource")
    }

    execute {
        if GoldStar.challenges[Type<@LearnFlowChallenge.Challenge>()] != nil {
            return
        }
        let challenge <- LearnFlowChallenge.createChallenge()
        self.admin.addChallenge(<-challenge)
    }

    post {
        GoldStar.challenges.length == 1: "Challenge not added"
    }
}

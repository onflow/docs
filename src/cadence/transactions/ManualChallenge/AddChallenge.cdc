import "GoldStar"
import "ManualChallenge"

transaction {
    let admin: &GoldStar.Admin

    prepare(signer: auth(BorrowValue) &Account) {
        self.admin = signer.storage.borrow<&GoldStar.Admin>(from: GoldStar.adminStoragePath)
            ?? panic("could not borrow reference to the Admin resource")
    }

    execute {
        if GoldStar.challenges[Type<@ManualChallenge.Challenge>()] != nil {
            return
        }
        let challenge <- ManualChallenge.createChallenge()
        self.admin.addChallenge(<-challenge)
    }

    post {
        GoldStar.challenges.length == 1: "Challenge not added"
    }
}

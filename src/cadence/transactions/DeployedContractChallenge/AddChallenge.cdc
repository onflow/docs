import "GoldStar"
import "DeployedContractChallenge"

transaction {
    let adminRef: &GoldStar.Admin

    prepare(signer: auth(BorrowValue) &Account) {
        self.adminRef = signer.storage.borrow<&GoldStar.Admin>(from: GoldStar.adminStoragePath)
            ?? panic("could not borrow reference to the Admin resource")
    }

    execute {
        if GoldStar.challenges[Type<@DeployedContractChallenge.Challenge>()] != nil {
            return
        }
        let challenge <- DeployedContractChallenge.createChallenge()
        self.adminRef.addChallenge(<-challenge)
    }

    post {
        GoldStar.challenges.length == 1: "Challenge not added"
    }
}

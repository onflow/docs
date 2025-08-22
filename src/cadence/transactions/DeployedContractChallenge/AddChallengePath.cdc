import "GoldStar"
import "DeployedContractChallenge"

transaction {
    let adminRef: &GoldStar.Admin

    prepare(signer: auth(BorrowValue) &Account) {
        self.adminRef = signer.storage.borrow<&GoldStar.Admin>(from: GoldStar.adminStoragePath)
            ?? panic("could not borrow reference to the Admin resource")
    }

    execute {
        let name = "Onchain"
        if GoldStar.challengePaths[name] != nil {
            return
        }
        let challengePath <- GoldStar.createChallengePath(
            name: name,
            description: "Go onchain",
            challenges: <-[
                <-DeployedContractChallenge.createChallenge()
            ]
        )
        self.adminRef.addChallengePath(<-challengePath)
    }

    post {
        GoldStar.challengePaths.length == 1: "Challenge path not added"
    }
}

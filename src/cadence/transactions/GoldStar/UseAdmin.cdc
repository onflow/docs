import "GoldStar"

transaction {
    let adminRef: &GoldStar.Admin

    prepare(signer: auth(BorrowValue) &Account) {
        self.adminRef = signer.storage.borrow<&GoldStar.Admin>(from: GoldStar.adminStoragePath)
            ?? panic("could not borrow reference to the Admin resource")
    }

    execute {
        let challenge <- self.adminRef.removeChallenge(type: Type<Void>())
        destroy challenge
    }
}

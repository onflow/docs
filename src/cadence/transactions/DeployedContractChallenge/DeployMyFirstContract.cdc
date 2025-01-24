transaction {
    prepare(signer: auth(AddContract) &Account) {
        signer.contracts.add(
            name: "MyFirstContract",
            code: "access(all) contract MyFirstContract {}".utf8
        )
    }

    execute {}
}

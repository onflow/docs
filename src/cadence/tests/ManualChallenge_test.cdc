import Test
import BlockchainHelpers
import "GoldStar"
import "ManualChallenge"

access(all)
let admin = Test.getAccount(0x0000000000000007)

access(all)
let user = Test.createAccount()

access(all)
fun setup() {
    var err = Test.deployContract(
        name: "GoldStar",
        path: "../contracts/GoldStar.cdc",
        arguments: [],
    )
    Test.expect(err, Test.beNil())

    err = Test.deployContract(
        name: "ManualChallenge",
        path: "../contracts/ManualChallenge.cdc",
        arguments: [],
    )

    Test.expect(err, Test.beNil())
}

access(all)
fun testAddChallenge() {
    let txResult = executeTransaction("../transactions/ManualChallenge/AddChallenge.cdc", [], admin)
    Test.expect(txResult, Test.beSucceeded())
}

access(self)
fun createProfile() {
    let txResult = executeTransaction("../transactions/GoldStar/CreateProfile.cdc", [
        "flow_blockchain",
        nil,
        {} as {Address: {String: Bool}},
        {} as {String: String}
    ], user)
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testCreateSubmission() {
    testAddChallenge()

    createProfile()

    let txResult = executeTransaction("../transactions/ManualChallenge/CreateSubmission.cdc", [], user)
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testAcceptSubmission() {
    testCreateSubmission()

    let txResult = executeTransaction("../transactions/ManualChallenge/AcceptSubmission.cdc", [user.address], admin)
    Test.expect(txResult, Test.beSucceeded())
}

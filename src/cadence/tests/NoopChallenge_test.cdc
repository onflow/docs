import Test
import BlockchainHelpers
import "GoldStar"
import "NoopChallenge"

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
        name: "NoopChallenge",
        path: "../contracts/NoopChallenge.cdc",
        arguments: [],
    )
    Test.expect(err, Test.beNil())
}

access(all)
fun testEvaluate() {
    var txResult = executeTransaction("../transactions/NoopChallenge/AddChallenge.cdc", [], admin)
    Test.expect(txResult, Test.beSucceeded())

    txResult = executeTransaction("../transactions/GoldStar/CreateProfile.cdc", [
        "flow_blockchain",
        nil,
        {} as {Address: {String: Bool}},
        {} as {String: String}
    ], user)
    Test.expect(txResult, Test.beSucceeded())

    txResult = executeTransaction("../transactions/NoopChallenge/Evaluate.cdc", [], user)
    Test.expect(txResult, Test.beSucceeded())
}

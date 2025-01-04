import Test
import BlockchainHelpers
import "GoldStar"
import "DeployedContractChallenge"

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
        name: "DeployedContractChallenge",
        path: "../contracts/DeployedContractChallenge.cdc",
        arguments: [],
    )

    Test.expect(err, Test.beNil())
}

access(all)
fun testCreateSubmission() {

    // Act
    let submission <- DeployedContractChallenge.createSubmission(contractName: "GoldStar")

    // Assert
    Test.assertEqual("GoldStar", submission.contractName)

    destroy submission
}

access(all)
fun testAddChallenge() {
    let txResult = executeTransaction("../transactions/DeployedContractChallenge/AddChallenge.cdc", [], admin)
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testAddChallengePath() {
    let txResult = executeTransaction("../transactions/DeployedContractChallenge/AddChallengePath.cdc", [], admin)
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testEvaluateSubmissionNotStored() {
    testAddChallenge()

    let txResult = executeTransaction("../transactions/DeployedContractChallenge/EvaluateSubmissionNotStored.cdc", [], user)
    Test.expect(txResult, Test.beFailed())
    Test.assert(txResult.error!.message.contains("submission must be stored"))
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
fun testEvaluateContractNotFound() {
    testAddChallenge()

    createProfile()

    let txResult = executeTransaction("../transactions/DeployedContractChallenge/EvaluateContractNotFound.cdc", [], user)
    Test.expect(txResult, Test.beFailed())
    Test.assert(txResult.error!.message.contains("contract not found"))
}

access(all)
fun testEvaluateAccepted() {
    testAddChallenge()

    createProfile()

    var txResult = executeTransaction("../transactions/DeployedContractChallenge/DeployMyFirstContract.cdc", [], user)
    Test.expect(txResult, Test.beSucceeded())

    txResult = executeTransaction("../transactions/DeployedContractChallenge/EvaluateAccepted.cdc", [], user)
    Test.expect(txResult, Test.beSucceeded())
}

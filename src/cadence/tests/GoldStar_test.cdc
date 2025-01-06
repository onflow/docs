import Test
import BlockchainHelpers
import "GoldStar"

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
}

access(all)
fun testCreateProfile() {
    let deployments = {
        Address(0x01): {
            "Foo": true
        }
    }
    let socials = {
        "twitter": "flow_blockchain"
    }

    let txResult = executeTransaction("../transactions/GoldStar/CreateProfile.cdc", [
        "flow_blockchain",
        nil,
        deployments,
        socials
    ], user)

    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testUseAdmin() {
    let txResult = executeTransaction("../transactions/GoldStar/UseAdmin.cdc", [], admin)
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testUpdateProfile() {
    testCreateProfile()

    let deployments = {
        Address(0x02): {
            "Bar": true
        }
    }
    let socials = {
        "instagram": "flow_blockchain"
    }

    let txResult = executeTransaction(
        "../transactions/GoldStar/UpdateProfile.cdc",
        [
            "something_else",
            "flow.com",
            deployments,
            socials
        ],
        user
    )
    Test.expect(txResult, Test.beSucceeded())
}
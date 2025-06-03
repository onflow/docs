import "GoldStar"

access(all)
contract DeployedContractChallenge {

    access(all)
    resource Challenge: GoldStar.Challenge {

        access(all)
        let name: String

        access(all)
        let description: String

        init() {
            self.name = "Deployed a contract"
            self.description = "Deploy a contract to Flow"
        }

        access(all)
        fun evaluate(submission: &{GoldStar.Submission}) {
            let submission = submission as? &Submission
                ?? panic("invalid submission type")

            let owner = submission.owner
                ?? panic("submission must be stored in an account")

            let name = submission.contractName
            if owner.contracts.borrow<&AnyStruct>(name: name) == nil {
                panic("contract not found")
            }

            submission.accept()
        }
    }

    access(all)
    resource Submission: GoldStar.Submission {

        access(all)
        let contractName: String

        access(self)
        var accepted: Bool

        init(contractName: String) {
            self.contractName = contractName
            self.accepted = false
        }

        access(all)
        fun isAccepted(): Bool {
            return self.accepted
        }

        access(contract)
        fun accept() {
            self.accepted = true
        }
    }

    access(all)
    fun createChallenge(): @Challenge {
        return <- create Challenge()
    }

    access(all)
    fun createSubmission(contractName: String): @Submission {
        return <- create Submission(
            contractName: contractName
        )
    }
}

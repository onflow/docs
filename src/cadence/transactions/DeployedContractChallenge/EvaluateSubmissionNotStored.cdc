import "GoldStar"
import "DeployedContractChallenge"

transaction {

    prepare(signer: &Account) {}

   execute {
        let challenge = GoldStar.challenges[Type<@DeployedContractChallenge.Challenge>()]
            ?? panic("challenge not found")

        let submission <- DeployedContractChallenge.createSubmission(contractName: "")
        let submissionRef: &{GoldStar.Submission} = &submission

        challenge.evaluate(submission: submissionRef)
        assert(submission.isAccepted())
        destroy submission
    }
}
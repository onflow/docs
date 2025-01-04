import "GoldStar"

access(all)
contract ManualChallenge {

    access(all)
    let evaluatorStoragePath: StoragePath

    access(all)
    resource Challenge: GoldStar.Challenge {

        access(all)
        let name: String

        access(all)
        let description: String

        init() {
            self.name = "Manual Challenge"
            self.description = "This submission needs to be manually accepted."
        }

        access(all)
        fun evaluate(submission: &{GoldStar.Submission}) {
            panic("submission cannot be evaluated automatically, it requires manual evaluation")
        }
    }

    access(all)
    resource Submission: GoldStar.Submission {

        access(self)
        var accepted: Bool

        init() {
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
    fun createSubmission(): @Submission {
        return <- create Submission()
    }

    access(all)
    resource Evaluator {

        access(all)
        fun accept(submission: &Submission) {
            submission.accept()
        }
    }

    init() {
        self.evaluatorStoragePath = /storage/manualChallengeEvaluator

        self.account.storage.save(
            <-create Evaluator(),
            to: self.evaluatorStoragePath
        )
    }
}

import "GoldStar"

access(all)
contract NoopChallenge {

    access(all)
    resource Challenge: GoldStar.Challenge {

        access(all)
        let name: String

        access(all)
        let description: String

        init() {
            self.name = "NOOP Challenge"
            self.description = "Nothing required for this challenge. All submissions are accepted."
        }

        access(all)
        fun evaluate(submission: &{GoldStar.Submission}) {
            let submission = submission as? &Submission
                ?? panic("invalid submission type")

            submission.accept()
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
}
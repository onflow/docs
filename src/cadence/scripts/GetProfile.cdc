import "GoldStar"

access(all) struct Profile {
    access(all) var handle: String
    access(all) var referralSource: String?
    access(all) var deployedContracts: {Address: [String]}
    access(all) var socials: {String: String}
    access(all) var submissions: {Type: Submission}

    init(ref: &GoldStar.Profile) {
        let submissions: {Type: Submission} = {}
        for challengeType in ref.submissions.submissions.keys {
            submissions[challengeType] = Submission(ref: ref.submissions.submissions[challengeType]!)
        }

        let deployedContracts: {Address: [String]} = {}
        for addr in ref.deployedContracts.contracts.keys {
            deployedContracts[addr] = []
            for name in ref.deployedContracts.contracts[addr]!.keys {
                deployedContracts[addr]!.append(name)
            }
        }

        self.handle = ref.handle.handle
        self.referralSource = ref.referralSource
        self.deployedContracts = deployedContracts
        self.socials = *ref.socials.socials
        self.submissions = submissions
    }
}

access(all) struct Submission {
    access(all) var completed: Bool

    init(ref: &{GoldStar.Submission}) {
        self.completed = ref.isAccepted()
    }
}

access(all)
fun main(address: Address): Profile {
    let ref = getAccount(address).capabilities.borrow<&GoldStar.Profile>(GoldStar.profilePublicPath)
        ?? panic("Could not borrow a reference to the profile")

    return Profile(ref: ref)
}
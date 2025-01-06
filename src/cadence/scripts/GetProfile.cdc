import "GoldStar"

access(all) struct Profile {
    access(all) var handle: String
    access(all) var referralSource: String?
    access(all) var deployedContracts: [DeployedContractInfo]
    access(all) var socials: {String: String}
    access(all) var submissions: [Submission]

    init(ref: &GoldStar.Profile) {
        let submissions = [] as [Submission]
        for challengeType in ref.submissions.submissions.keys {
            submissions.append(Submission(challengeType: challengeType, ref: ref.submissions.submissions[challengeType]!))
        }

        let deployedContracts = [] as [DeployedContractInfo]
        for addr in ref.deployedContracts.contracts.keys {
            for name in ref.deployedContracts.contracts[addr]!.keys {
                deployedContracts.append(DeployedContractInfo(address: addr, name: name))
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
    access(all) var challengeType: Type
    access(all) var completed: Bool

    init(challengeType: Type, ref: &{GoldStar.Submission}) {
        self.challengeType = challengeType
        self.completed = ref.isAccepted()
    }
}

access(all) struct DeployedContractInfo {
    access(all) var address: Address
    access(all) var name: String

    init(address: Address, name: String) {
        self.address = address
        self.name = name
    }
}

access(all)
fun main(address: Address): Profile {
    let ref = getAccount(address).capabilities.borrow<&GoldStar.Profile>(GoldStar.profilePublicPath)
        ?? panic("Could not borrow a reference to the profile")

    return Profile(ref: ref)
}
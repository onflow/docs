import "GoldStar"

access(all) struct Profile {
    access(all) var handle: String
    access(all) var referralSource: String?
    access(all) var deployedContracts: DeployedContracts
    access(all) var socials: {String: String}
    access(all) var submissions: {String: Submission}

    init(ref: &GoldStar.Profile) {
        let submissions: {String: Submission} = {}
        for challengeType in ref.submissions.submissions.keys {
            submissions[challengeType.identifier] = Submission(ref: ref.submissions.submissions[challengeType]!)
        }
        
        self.handle = ref.handle.handle
        self.referralSource = ref.referralSource.source
        self.deployedContracts = DeployedContracts(ref: ref.deployedContracts)
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

access(all) struct DeployedContracts {
    access(all) var cadenceContracts: {Address: [String]}
    access(all) var evmContracts: [String]

    init(ref: &GoldStar.DeployedContracts) {
        let cadenceContracts: {Address: [String]} = {}
        for addr in ref.cadenceContracts.keys {
            cadenceContracts[addr] = []
            for name in ref.cadenceContracts[addr]!.keys {
                cadenceContracts[addr]!.append(name)
            }
        }

        let evmContracts: [String] = []
        for name in ref.evmContracts.keys {
            evmContracts.append(name)
        }

        self.cadenceContracts = cadenceContracts
        self.evmContracts = evmContracts
    }
}

access(all)
fun main(address: Address): Profile? {
    let ref = getAccount(address).capabilities.borrow<&GoldStar.Profile>(GoldStar.profilePublicPath)
    if ref == nil {
        return nil
    }

    return Profile(ref: ref!)
}
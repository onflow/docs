access(all)
contract GoldStar {

    access(all)
    let profilePublicPath: PublicPath

    access(all)
    let profileStoragePath: StoragePath

    access(all)
    let adminStoragePath: StoragePath

    access(all)
    entitlement UpdateHandle

    access(all)
    entitlement UpdateReferralSource

    access(all)
    entitlement UpdateDeployedContracts

    access(all)
    entitlement UpdateSocials

    access(all)
    entitlement UpdateSubmissions

    access(all)
    resource Profile {
        access(all)
        var handle: ProfileHandle

        access(all)
        var referralSource: String?

        access(mapping Identity)
        var deployedContracts: DeployedContracts

        access(mapping Identity)
        var socials: ProfileSocials

        access(mapping Identity)
        var submissions: @ProfileSubmissions

        access(UpdateReferralSource)
        fun updateReferralSource(source: String) {
            self.referralSource = source
        }

        init(handle: String) {
            self.handle = ProfileHandle(value: handle)
            self.referralSource = nil
            self.deployedContracts = DeployedContracts()
            self.socials = ProfileSocials()
            self.submissions <- create ProfileSubmissions()
        }
    }

    access(all)
    struct ProfileHandle {
        access(all)
        var handle: String

        access(UpdateHandle)
        fun update(newHandle: String) {
            self.handle = newHandle
        }

        init(value: String) {
            self.handle = value
        }
    }

    access(all)
    struct DeployedContracts {
        access(all)
        var contracts: {Address: {String: Bool}}

        access(UpdateDeployedContracts)
        fun add(address: Address, name: String) {
            if let names = self.contracts[address] {
                names[name] = true
            } else {
                self.contracts[address] = {name: true}
            }
        }

        access(UpdateDeployedContracts)
        fun remove(address: Address, name: String) {
            if let names = self.contracts[address] {
                names.remove(key: name)
                if names.length == 0 {
                    self.contracts.remove(key: address)
                }
            }
        }

        init() {
            self.contracts = {}
        }
    }

    access(all)
    struct ProfileSocials {
        access(all)
        var socials: {String: String}

        access(UpdateSocials)
        fun set(name: String, handle: String) {
            self.socials[name] = handle
        }

        access(UpdateSocials)
        fun remove(name: String) {
            self.socials.remove(key: name)
        }
        
        init() {
            self.socials = {}
        }
    }

    access(all)
    resource ProfileSubmissions {
        access(all)
        var submissions: @{Type: {Submission}}

        access(UpdateSubmissions)
        fun add(_ submission: @{Submission}, challengeType: Type): &{Submission} {
            self.submissions[challengeType] <-! submission
            let ref = &self.submissions[challengeType] as &{Submission}?
            return ref!
        }

        access(UpdateSubmissions)
        fun remove(challengeType: Type): @{Submission}? {
            return <-self.submissions.remove(key: challengeType)
        }

        init() {
            self.submissions <- {}
        }
    }

    access(all)
    resource interface Challenge {

        access(all)
        let name: String

        access(all)
        let description: String

        access(all)
        fun evaluate(submission: &{Submission})
    }

    access(all)
    resource ChallengePath {

        access(all)
        let name: String

        access(all)
        let description: String

        access(all)
        let challenges: @[{Challenge}]

        init(
            name: String,
            description: String,
            challenges: @[{Challenge}]
        ) {
            self.name = name
            self.description = description
            self.challenges <- challenges
        }
    }

    access(all)
    resource Admin {

        access(all)
        fun addChallenge(_ challenge: @{Challenge}) {
            GoldStar.challenges[challenge.getType()] <-! challenge
        }

        access(all)
        fun removeChallenge(type: Type): @{Challenge}? {
            return <- GoldStar.challenges.remove(key: type)
        }

        access(all)
        fun addChallengePath(_ challengePath: @ChallengePath) {
            GoldStar.challengePaths[challengePath.name] <-! challengePath
        }

        access(all)
        fun removeChallengePath(name: String): @ChallengePath? {
            return <- GoldStar.challengePaths.remove(key: name)
        }
    }

    access(all)
    resource interface Submission {

        access(all)
        fun isAccepted(): Bool
    }

    access(all)
    var challenges: @{Type: {Challenge}}

    access(all)
    var challengePaths: @{String: ChallengePath}

    init() {
        self.profilePublicPath = /public/goldStarProfile
        self.profileStoragePath = /storage/goldStarProfile
        self.adminStoragePath = /storage/goldStarAdmin

        self.challenges <- {}
        self.challengePaths <- {}

        self.account.storage.save(
            <-create Admin(),
            to: GoldStar.adminStoragePath
        )
    }

    access(all)
    fun createProfile(handle: String): @Profile {
        return <- create Profile(handle: handle)
    }

    access(all)
    fun createChallengePath(
        name: String,
        description: String,
        challenges: @[{Challenge}]
    ): @ChallengePath {
        return <- create ChallengePath(
            name: name,
            description: description,
            challenges: <-challenges
        )
    }
}

import "GoldStar"

access(all) struct Challenge {
    access(all) let name: String
    access(all) let description: String

    init(name: String, description: String) {
        self.name = name
        self.description = description
    }
}

access(all)
fun main(): {String: Challenge} {
    let challenges: {String: Challenge} = {}
    for challengeType in GoldStar.challenges.keys {
        challenges[challengeType.identifier] = Challenge(
            name: GoldStar.challenges[challengeType]!.name,
            description: GoldStar.challenges[challengeType]!.description
        )
    }

    return challenges
}

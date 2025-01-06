import "GoldStar"

access(all)
fun main(address: Address): &GoldStar.Profile {
    let profile = getAccount(address).capabilities.borrow<&GoldStar.Profile>(GoldStar.profilePublicPath)
        ?? panic("Could not borrow a reference to the profile")

    return profile
}
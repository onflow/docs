import "GoldStar"

transaction(
    handle: String,
    referralSource: String?,
    deployedContracts: {Address: {String: Bool}},
    socials: {String: String}
) {
    prepare(signer: auth(SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        if signer.storage.type(at: GoldStar.profileStoragePath) == nil {
            let profile <- GoldStar.createProfile(handle: handle)
            
            if let referralSource = referralSource {
                profile.updateReferralSource(source: referralSource)
            }

            for addr in deployedContracts.keys {
                if let addrContracts = deployedContracts[addr] {
                    for name in addrContracts.keys {
                        profile.deployedContracts.add(address: addr, name: name)
                    }
                }
            }

            for social in socials.keys {
                profile.socials.set(name: social, handle: socials[social]!)
            }

            signer.storage.save(
                <- profile,
                to: GoldStar.profileStoragePath
            )
        }
        if !signer.capabilities.exists(GoldStar.profilePublicPath) {
            let cap = signer.capabilities.storage.issue<&GoldStar.Profile>(GoldStar.profileStoragePath)
            signer.capabilities.publish(cap, at: GoldStar.profilePublicPath)
        }
    }

    execute {}
}

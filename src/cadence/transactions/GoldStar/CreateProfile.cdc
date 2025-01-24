import "GoldStar"

transaction(
    handle: String,
    referralSource: String?,
    deployedCadenceContracts: {Address: [String]},
    deployedEvmContracts: [String],
    socials: {String: String}
) {
    prepare(signer: auth(SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        if signer.storage.type(at: GoldStar.profileStoragePath) == nil {
            let profile <- GoldStar.createProfile(handle: handle)
            
            if let referralSource = referralSource {
                profile.referralSource.update(newSource: referralSource)
            }

            for addr in deployedCadenceContracts.keys {
                if let addrContracts = deployedCadenceContracts[addr] {
                    for name in addrContracts {
                        profile.deployedContracts.addCadenceContract(address: addr, name: name)
                    }
                }
            }

            for addr in deployedEvmContracts {
                profile.deployedContracts.addEvmContract(address: addr.decodeHex().toConstantSized<[UInt8; 20]>()!)
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

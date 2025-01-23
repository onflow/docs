import "GoldStar"

// This transaction updates fields for a user's GoldStar profile
transaction(
    handle: String,
    referralSource: String?,
    deployedContracts: {Address: [String]},
    socials: {String: String}
) {
    let profile: auth(GoldStar.UpdateHandle, GoldStar.UpdateSocials, GoldStar.UpdateDeployedContracts, GoldStar.UpdateReferralSource) &GoldStar.Profile

    prepare(signer: auth(BorrowValue) &Account) {
        self.profile = signer.storage
            .borrow<auth(GoldStar.UpdateHandle, GoldStar.UpdateSocials, GoldStar.UpdateDeployedContracts, GoldStar.UpdateReferralSource) &GoldStar.Profile>(from: GoldStar.profileStoragePath)
            ?? panic("missing profile")
    }

    execute {
        // Update the handle
        self.profile.handle.update(newHandle: handle)

        // Update the referral source
        if let referralSource = referralSource {
            if referralSource != self.profile.referralSource.source {
                self.profile.referralSource.update(newSource: referralSource)
            }
        }

        // Diff the deployed contracts and update
        for addr in self.profile.deployedContracts.cadenceContracts.keys {
            for name in self.profile.deployedContracts.cadenceContracts[addr]!.keys {
                if deployedContracts[addr] == nil || deployedContracts[addr]!.contains(name) == false {
                    self.profile.deployedContracts.removeCadenceContract(address: addr, name: name)
                }
            }
        }
        
        for addr in deployedContracts.keys {
            for name in deployedContracts[addr]! {
                if self.profile.deployedContracts.cadenceContracts[addr] == nil || self.profile.deployedContracts.cadenceContracts[addr]![name] == nil {
                    self.profile.deployedContracts.addCadenceContract(address: addr, name: name)
                }
            }
        }

        // Diff the socials and update
        for social in self.profile.socials.socials.keys {
            if socials[social] == nil {
                self.profile.socials.remove(name: social)
            }
        }

        for social in socials.keys {
            if self.profile.socials.socials[social] == nil {
                self.profile.socials.set(name: social, handle: socials[social]!)
            }
        }
    }
}

import "GoldStar"

// This transaction updates fields for a user's GoldStar profile
transaction(
    handle: String,
    referralSource: String?,
    deployedContracts: {Address: [String]},
    socials: {String: String}
) {
    let profile: auth(GoldStar.UpdateSocials, GoldStar.UpdateDeployedContracts, GoldStar.UpdateReferralSource) &GoldStar.Profile

    prepare(signer: auth(BorrowValue) &Account) {
        self.profile = signer.storage
            .borrow<auth(GoldStar.UpdateSocials, GoldStar.UpdateDeployedContracts, GoldStar.UpdateReferralSource) &GoldStar.Profile>(from: GoldStar.profileStoragePath)
            ?? panic("missing profile")
    }

    execute {
        if let referralSource = referralSource {
            self.profile.updateReferralSource(source: referralSource)
        }

        // Replace all deployed contracts
        for addr in self.profile.deployedContracts.contracts.keys {
            for name in self.profile.deployedContracts.contracts[addr]!.keys {
                self.profile.deployedContracts.remove(address: addr, name: name)
            }
        }
        
        for addr in deployedContracts.keys {
            if let addrContracts = deployedContracts[addr] {
                for name in addrContracts {
                    self.profile.deployedContracts.add(address: addr, name: name)
                }
            }
        }

        // Replace all socials
        for social in self.profile.socials.socials.keys {
            self.profile.socials.remove(name: social)
        }

        for social in socials.keys {
            self.profile.socials.set(name: social, handle: socials[social]!)
        }
    }

    post {
        *self.profile.socials.socials == socials: "Socials not updated";
        self.profile.referralSource == referralSource: "Referral source not updated"
    }
}

import "GoldStar"

// This transaction updates fields for a user's GoldStar profile
transaction(
    handle: String,
    referralSource: String?,
    deployedCadenceContracts: {Address: [String]},
    deployedEvmContracts: [String],
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

        // Diff the deployed cadence contracts and update
        for addr in self.profile.deployedContracts.cadenceContracts.keys {
            for name in self.profile.deployedContracts.cadenceContracts[addr]!.keys {
                if deployedCadenceContracts[addr] == nil || deployedCadenceContracts[addr]!.contains(name) == false {
                    self.profile.deployedContracts.removeCadenceContract(address: addr, name: name)
                }
            }
        }
        
        for addr in deployedCadenceContracts.keys {
            for name in deployedCadenceContracts[addr]! {
                if self.profile.deployedContracts.cadenceContracts[addr] == nil || self.profile.deployedContracts.cadenceContracts[addr]![name] == nil {
                    self.profile.deployedContracts.addCadenceContract(address: addr, name: name)
                }
            }
        }

        // Diff the deployed evm contracts and update
        for name in self.profile.deployedContracts.evmContracts.keys {
            if deployedEvmContracts.contains(name) == false {
                self.profile.deployedContracts.removeEvmContract(address: name.decodeHex().toConstantSized<[UInt8; 20]>()!)
            }
        }

        for name in deployedEvmContracts {
            if self.profile.deployedContracts.evmContracts[name] != true {
                self.profile.deployedContracts.addEvmContract(address: name.decodeHex().toConstantSized<[UInt8; 20]>()!)
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

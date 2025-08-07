import React from "react"
import { TransactionButton, TransactionDialog } from "@onflow/react-sdk"
import FlowProviderDemo from "./FlowProviderDemo"
import { useState } from "react"

export default function DialogDemo() {
  const [txId, setTxId] = useState<string | undefined>(undefined)

  return (
    <FlowProviderDemo>
      <TransactionButton
        transaction={{
          cadence: `transaction() { prepare(acct: &Account) { log("Demo transaction") } }`,
          args: (arg, t) => [],
          limit: 100,
        }}
        label="Demo Transaction"
        mutation={{
          onSuccess: (txId) => {
            setTxId(txId)
          }
        }}
      />
      <TransactionDialog
        open={!!txId}
        onOpenChange={() => setTxId(undefined)}
        txId={txId}
        pendingTitle="Sending..."
        successTitle="All done!"
        closeOnSuccess
      />
    </FlowProviderDemo>
  )
}

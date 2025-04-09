---
sidebar_position: 2
---

# Error Codes

List of error codes returned from failing transactions and scripts. The error code has an accompanied error message that usually gives more clarification. This list is meant to give more information and helpful hints.
[Code file](https://github.com/onflow/flow-go/blob/master/fvm/errors/codes.go)

### 1006
**ErrCodeInvalidProposalSignatureError**

Example: 
`
...
`



### 1007
**ErrCodeInvalidProposalSeqNumberError**

Example: 
`
[Error Code: 1007] invalid proposal key: public key 0 on account xxx has sequence number xxx, but given xxx
`




### 1008
**ErrCodeInvalidPayloadSignatureError**

Example: 
`
[Error Code: 1008] invalid payload signature: public key 0 on account xxx does not have a valid signature: signature is not valid
`




### 1009
**ErrCodeInvalidEnvelopeSignatureError**

Example: 
`
[Error Code: 1009] invalid envelope key: public key 1 on account xxx does not have a valid signature: signature is not valid
`




### 1051
**ErrCodeValueError**

Example: 
`
[Error Code: 1051] invalid value (xxx): invalid encoded public key value: rlp: expected input list for flow.runtimeAccountPublicKeyWrapper...
`



### 1052
**ErrCodeInvalidArgumentError**

Example: 
`
[Error Code: 1052] transaction arguments are invalid: (argument is not json decodable: failed to decode value: runtime error: slice bounds out of range [:2] with length 0)
`



### 1053
**ErrCodeInvalidAddressError**

Example: 
`
...
`



### 1054
**ErrCodeInvalidLocationError**

Example: 
`
[Error Code: 1054] location (../contracts/FungibleToken.cdc) is not a valid location: expecting an AddressLocation, but other location types are passed ../contracts/FungibleToken.cdc
`



### 1055
**ErrCodeAccountAuthorizationError**

Example: 
`
[Error Code: 1055] authorization failed for account e85d442d61a611d8: payer account does not have sufficient signatures (1 < 1000)
`



### 1056
**ErrCodeOperationAuthorizationError**

Example: 
`
[Error Code: 1056] (RemoveContract) is not authorized: removing contracts requires authorization from specific accounts goroutine 5688834491 [running]:
`



### 1057
**ErrCodeOperationNotSupportedError**

Example: 
`
...
`



### 1101
**ErrCodeCadenceRunTimeError**

Example: 
`
[Error Code: 1101] cadence runtime error Execution failed: error: pre-condition failed: Amount withdrawn must be less than or equal than the balance of the Vault
`



### 1103
**ErrCodeStorageCapacityExceeded**

Example: 
`
[Error Code: 1103] The account with address (xxx) uses 96559611 bytes of storage which is over its capacity (96554500 bytes). Capacity can be increased by adding FLOW tokens to the account.
`


For more information refer to [Fees](../build/basics/fees.md#maximum-available-balance)



### 1105
**ErrCodeEventLimitExceededError**

Example: 
`
[Error Code: 1105] total event byte size (256200) exceeds limit (256000)
`



### 1106
**ErrCodeLedgerInteractionLimitExceededError**

Example: 
`
[Error Code: 1106] max interaction with storage has exceeded the limit (used: 20276498 bytes, limit 20000000 bytes)
`



### 1107
**ErrCodeStateKeySizeLimitError**

Example: 
`
...
`




### 1108
**ErrCodeStateValueSizeLimitError**

Example: 
`
...
`


### 1109
**ErrCodeTransactionFeeDeductionFailedError**

Example: 
`
[Error Code: 1109] failed to deduct 0 transaction fees from 14af75b8c487333c: Execution failed: f919ee77447b7497.FlowFees:97:24
`



### 1110
**ErrCodeComputationLimitExceededError**

Example: 
`
[Error Code: 1110] computation exceeds limit (100)
`



### 1111
**ErrCodeMemoryLimitExceededError**

Example: 
`
...
`


### 1112
**ErrCodeCouldNotDecodeExecutionParameterFromState**

Example: 
`
...
`


### 1113
**ErrCodeScriptExecutionTimedOutError**

Example: 
`
...
`

### 1114
**ErrCodeScriptExecutionCancelledError**

Example: 
`
...
`

### 1115
**ErrCodeEventEncodingError**

Example: 
`
...
`



### 1116
**ErrCodeInvalidInternalStateAccessError**

Example: 
`
...
`

### 1118
**ErrCodeInsufficientPayerBalance**

Example: 
`
 [Error Code: 1118] payer ... has insufficient balance to attempt transaction execution (required balance: 0.00100000)
`


### 1201
**ErrCodeAccountNotFoundError**

Example: 
`
[Error Code: 1201] account not found for address xxx
`



### 1202
**ErrCodeAccountPublicKeyNotFoundError**

Example: 
`
[Error Code: 1202] account public key not found for address xxx and key index 3
`



### 1203
**ErrCodeAccountAlreadyExistsError**

Example: 
`
...
`


### 1204
**ErrCodeFrozenAccountError**

Example: 
`
...
`



### 1206
**ErrCodeAccountPublicKeyLimitError**

Example: 
`
...
`



### 1251
**ErrCodeContractNotFoundError**

Example: 
`
...
`



### 2000
**FailureCodeUnknownFailure**

Example: 
`
...
`


### 2001
**FailureCodeEncodingFailure**

Example: 
`
...
`



### 2002
**FailureCodeLedgerFailure**

Example: 
`
...
`



### 2003
**FailureCodeStateMergeFailure**

Example: 
`
...
`



### 2004
**FailureCodeBlockFinderFailure**

Example: 
`
...
`

  
### 2006
**FailureCodeParseRestrictedModeInvalidAccessFailure**

Example: 
`
...
`


### 2007
**FailureCodePayerBalanceCheckFailure**

Example: 
`
...
`

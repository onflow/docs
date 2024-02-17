```

------------

Usage:
  flow [command]

👋 Welcome Flow developer!
   If you are starting a new flow project use our super commands, start by running 'flow setup'. 

🔥 Super Commands
  dev          Build your Flow project
  generate     Generate template files for common Cadence code
  setup        Start a new Flow project

📦 Flow Entities
  accounts     Create and retrieve accounts and deploy contracts
  blocks       Retrieve blocks
  collections  Retrieve collections
  events       Retrieve events

💬 Flow Interactions
  scripts      Execute Cadence scripts
  transactions Build, sign, send and retrieve transactions

🔨 Flow Tools
  cadence      Execute Cadence code
  dev-wallet   Run a development wallet
  emulator     Run Flow network for development
  flix         execute, generate, package
  flowser      Run Flowser project explorer
  test         Run Cadence tests

🏄 Flow Project
  deploy       Deploy all project contracts
  init         Initialize a new configuration
  project      Manage your Cadence project
  run          Start emulator and deploy all project contracts

🔒 Flow Security
  keys         Generate and decode Flow keys
  signatures   Signature verification and creation

🔗 Dependency Manager
  dependencies Manage contracts and dependencies

Additional Commands:
  allHelp      Outputs help for all the CLI commands
  completion   Generate the autocompletion script for the specified shell
  config       Utilities to manage configuration
  help         Help about any command
  settings     Manage persisted global settings
  snapshot     Retrieve the protocol state snapshot
  status       Display the status of the Flow network
  version      View version and commit information

Flags:
  -f, --config-path strings   Path to flow configuration file (default [/Users/tomhaile/flow.json,flow.json])
  -x, --filter string         Filter result values by property name
      --format string         Format result values (default "text")
      --host string           Flow Access API host address
  -l, --log string            Log level, options: "debug", "info", "error", "none" (default "info")
  -n, --network string        Network from configuration file (default "emulator")
      --network-key string    Flow Access API host network key for secure client connections
  -o, --output string         Output format, options: "text", "json", "inline" (default "text")
  -s, --save string           Save result to a filename
      --skip-version-check    Skip version check during start up
  -y, --yes                   Approve any prompts

Use "flow [command] --help" for more information about a command.


------------

Create and retrieve accounts and deploy contracts

Usage:
  flow accounts [command]

Available Commands:
  add-contract    Deploy a new contract to an account
  create          Create a new account on network
  fund            Funds an account by address through the Testnet Faucet
  get             Gets an account by address
  remove-contract Remove a contract deployed to an account
  staking-info    Get account staking info
  update-contract Update a contract deployed to an account

Use "flow accounts [command] --help" for more information about a command.


------------

Deploy a new contract to an account

Usage:
  flow accounts add-contract <filename> <args> [flags]

Examples:
flow accounts add-contract ./FungibleToken.cdc helloArg


Flags:
      --args-json string   arguments in JSON-Cadence format
      --include strings    Fields to include in the output. Valid values: contracts.
      --show-diff          Shows diff between existing and new contracts on update
      --signer string      Account name from configuration used to sign the transaction (default "emulator-account")



------------

Create a new account on network

Usage:
  flow accounts create [flags]

Examples:
flow accounts create --key d651f1931a2...8745


Flags:
      --hash-algo strings   Hash used for the digest (default [SHA3_256])
      --include strings     Fields to include in the output
      --key strings         Public keys to attach to account
      --key-weight ints     Weight for the key
      --sig-algo strings    Signature algorithm used to generate the keys (default [ECDSA_P256])
      --signer string       Account name from configuration used to sign the transaction (default "emulator-account")



------------

Funds an account by address through the Testnet Faucet

Usage:
  flow accounts fund <address> [flags]

Examples:
flow accounts fund 8e94eaa81771313a


Flags:
      --include strings   Fields to include in the output. Valid values: contracts.



------------

Gets an account by address

Usage:
  flow accounts get <address> [flags]

Examples:
flow accounts get f8d6e0586b0a20c7


Flags:
      --include strings   Fields to include in the output. Valid values: contracts.



------------

Remove a contract deployed to an account

Usage:
  flow accounts remove-contract <name> [flags]

Examples:
flow accounts remove-contract FungibleToken


Flags:
      --include strings   Fields to include in the output. Valid values: contracts.
      --network string    Network name from configuration to use
      --signer string     Account name from configuration used to sign the transaction (default "emulator-account")



------------

Get account staking info

Usage:
  flow accounts staking-info <address> [flags]

Examples:
flow accounts staking-info f8d6e0586b0a20c7




------------

Update a contract deployed to an account

Usage:
  flow accounts update-contract <filename> <args> [flags]

Examples:
flow accounts update-contract ./FungibleToken.cdc helloArg


Flags:
      --args-json string   arguments in JSON-Cadence format
      --include strings    Fields to include in the output. Valid values: contracts.
      --show-diff          Shows diff between existing and new contracts on update
      --signer string      Account name from configuration used to sign the transaction (default "emulator-account")



------------

Outputs help for all the CLI commands

Usage:
  flow allHelp [flags]

Examples:
flow cheat sheet


Flags:
  -h, --help   help for allHelp



------------

Retrieve blocks

Usage:
  flow blocks [command]

Available Commands:
  get         Get block info

Use "flow blocks [command] --help" for more information about a command.


------------

Get block info

Usage:
  flow blocks get <block_id|latest|block_height> [flags]

Examples:
flow blocks get latest --network testnet


Flags:
      --events string     List events of this type for the block
      --include strings   Fields to include in the output. Valid values: transactions.



------------

Execute Cadence code

Usage:
  flow cadence [flags]
  flow cadence [command]

Available Commands:
  language-server Start the Cadence language server

Use "flow cadence [command] --help" for more information about a command.


------------

Start the Cadence language server

Usage:
  flow cadence language-server [flags]


Flags:
      --enable-flow-client   Enable Flow client functionality (default true)



------------

Retrieve collections

Usage:
  flow collections [command]

Available Commands:
  get         Get collection info

Use "flow collections [command] --help" for more information about a command.


------------

Get collection info

Usage:
  flow collections get <collection_id> [flags]

Examples:
flow collections get 270d...9c31e




------------

Generate the autocompletion script for flow for the specified shell.
See each sub-command's help for details on how to use the generated script.

Usage:
  flow completion [command]

Available Commands:
  bash        Generate the autocompletion script for bash
  fish        Generate the autocompletion script for fish
  powershell  Generate the autocompletion script for powershell
  zsh         Generate the autocompletion script for zsh

Use "flow completion [command] --help" for more information about a command.


------------

Generate the autocompletion script for the bash shell.

This script depends on the 'bash-completion' package.
If it is not installed already, you can install it via your OS's package manager.

To load completions in your current shell session:

	source <(flow completion bash)

To load completions for every new session, execute once:

#### Linux:

	flow completion bash > /etc/bash_completion.d/flow

#### macOS:

	flow completion bash > $(brew --prefix)/etc/bash_completion.d/flow

You will need to start a new shell for this setup to take effect.

Usage:
  flow completion bash


Flags:
      --no-descriptions   disable completion descriptions



------------

Generate the autocompletion script for the fish shell.

To load completions in your current shell session:

	flow completion fish | source

To load completions for every new session, execute once:

	flow completion fish > ~/.config/fish/completions/flow.fish

You will need to start a new shell for this setup to take effect.

Usage:
  flow completion fish [flags]


Flags:
      --no-descriptions   disable completion descriptions



------------

Generate the autocompletion script for powershell.

To load completions in your current shell session:

	flow completion powershell | Out-String | Invoke-Expression

To load completions for every new session, add the output of the above command
to your powershell profile.

Usage:
  flow completion powershell [flags]


Flags:
      --no-descriptions   disable completion descriptions



------------

Generate the autocompletion script for the zsh shell.

If shell completion is not already enabled in your environment you will need
to enable it.  You can execute the following once:

	echo "autoload -U compinit; compinit" >> ~/.zshrc

To load completions in your current shell session:

	source <(flow completion zsh)

To load completions for every new session, execute once:

#### Linux:

	flow completion zsh > "${fpath[1]}/_flow"

#### macOS:

	flow completion zsh > $(brew --prefix)/share/zsh/site-functions/_flow

You will need to start a new shell for this setup to take effect.

Usage:
  flow completion zsh [flags]


Flags:
      --no-descriptions   disable completion descriptions



------------

Utilities to manage configuration

Usage:
  flow config [command]

Available Commands:
  add         Add resource to configuration
  init        Initialize a new configuration
  remove      Remove resource from configuration

Use "flow config [command] --help" for more information about a command.


------------

Add resource to configuration

Usage:
  flow config add [command]

Examples:
flow config add account

Available Commands:
  account     Add account to configuration
  contract    Add contract to configuration
  deployment  Add deployment to configuration
  network     Add network to configuration

Use "flow config add [command] --help" for more information about a command.


------------

Add account to configuration

Usage:
  flow config add account [flags]

Examples:
flow config add account


Flags:
      --address string       Account address
      --hash-algo string     Hash algorithm to pair with this account key (default "SHA3_256")
      --key-index string     Account key index (default "0")
      --name string          Name for the account
      --private-key string   Account private key
      --sig-algo string      Signature algorithm of this account key (default "ECDSA_P256")



------------

Add contract to configuration

Usage:
  flow config add contract [flags]

Examples:
flow config add contract


Flags:
      --emulator-alias string   Address for the emulator alias
      --filename string         Filename of the contract source
      --mainnet-alias string    Address for the mainnet alias
      --name string             Name of the contract
      --testnet-alias string    Address for the testnet alias



------------

Add deployment to configuration

Usage:
  flow config add deployment [flags]

Examples:
flow config add deployment


Flags:
      --account string     Account name used for deployment
      --contract strings   Name of the contract to be deployed
      --network string     Network name used for deployment



------------

Add network to configuration

Usage:
  flow config add network [flags]

Examples:
flow config add network


Flags:
      --host string          Flow Access API host address
      --name string          Network name
      --network-key string   Flow Access API host network key for secure client connections



------------

Initialize a new configuration

Usage:
  flow config init [flags]


Flags:
      --global                       Initialize global user configuration
      --reset                        Reset configuration file
      --service-hash-algo string     Service account key hash algorithm (default "SHA3_256")
      --service-private-key string   Service account private key
      --service-sig-algo string      Service account key signature algorithm (default "ECDSA_P256")



------------

Remove resource from configuration

Usage:
  flow config remove [command]

Examples:
flow config remove account

Available Commands:
  account     Remove account from configuration
  contract    Remove contract from configuration
  deployment  Remove deployment from configuration
  network     Remove network from configuration

Use "flow config remove [command] --help" for more information about a command.


------------

Remove account from configuration

Usage:
  flow config remove account <name> [flags]

Examples:
flow config remove account Foo




------------

Remove contract from configuration

Usage:
  flow config remove contract <name> [flags]

Examples:
flow config remove contract Foo




------------

Remove deployment from configuration

Usage:
  flow config remove deployment <account> <network> [flags]

Examples:
flow config remove deployment Foo testnet




------------

Remove network from configuration

Usage:
  flow config remove network <name> [flags]

Examples:
flow config remove network Foo




------------

Manage contracts and dependencies

Usage:
  flow dependencies [command]

Aliases:
  dependencies, deps

Available Commands:
  add         Add a single contract and its dependencies.
  install     Install contract and dependencies.

Use "flow dependencies [command] --help" for more information about a command.


------------

Add a single contract and its dependencies.

Usage:
  flow dependencies add <source string> [flags]

Examples:
flow dependencies add testnet://0afe396ebc8eee65.FlowToken


Flags:
      --name string   Name of the dependency



------------

Install contract and dependencies.

Usage:
  flow dependencies install [flags]

Examples:
flow dependencies install




------------

Deploy all project contracts

Usage:
  flow deploy [flags]

Examples:
flow deploy


Flags:
      --show-diff   use show-diff flag to show diff between existing and new contracts on update
      --update      use update flag to update existing contracts



------------

Build your Flow project

Usage:
  flow dev [flags]

Examples:
flow dev




------------

Run a development wallet

Usage:
  flow dev-wallet [flags]

Examples:
flow dev-wallet


Flags:
      --emulator-host string   Host for access node connection (default "http://localhost:8888")
      --port uint              Dev wallet port to listen on (default 8701)



------------

Run Flow network for development

Usage:
  flow emulator [flags]
  flow emulator [command]

Available Commands:
  snapshot    Create/Load/List emulator snapshots

Flags:
      --admin-port int                  port to run the admin API (default 8080)
  -b, --block-time duration             time between sealed blocks, e.g. '300ms', '-1.5h' or '2h45m'. Valid units are 'ns', 'us' (or 'µs'), 'ms', 's', 'm', 'h'
      --chain-id string                 chain to emulate for address generation. Valid values are: 'emulator', 'testnet', 'mainnet' (default "emulator")
      --contract-removal                allow removal of already deployed contracts, used for updating during development (default true)
      --contracts                       deploy common contracts when emulator starts
      --coverage-reporting              enable Cadence code coverage reporting
      --dbpath string                   path to database directory (default "./flowdb")
      --debugger-port int               port to run the Debugger (Debug Adapter Protocol) (default 2345)
      --evm-enabled                     enable EVM support
      --grpc-debug                      enable gRPC server reflection for debugging with grpc_cli
      --host string                     host to listen on for emulator GRPC/REST/Admin servers (default: all interfaces)
      --init                            whether to initialize a new account profile
      --log-format string               logging output format. Valid values (text, JSON) (default "text")
      --min-account-balance string      The minimum account balance of an account. This is also the cost of creating one account. e.g. '0.001'. The default is taken from the current version of flow-go
      --persist                         enable persistent storage
  -p, --port int                        port to run RPC server (default 3569)
      --redis-url string                redis-server URL for persisting redis storage backend ( redis://[[username:]password@]host[:port][/database] ) 
      --rest-debug                      enable REST API debugging output
      --rest-port int                   port to run the REST API (default 8888)
      --script-gas-limit int            gas limit for scripts (default 100000)
      --service-hash-algo string        service account key hash algorithm (default "SHA3_256")
      --service-priv-key string         service account private key
      --service-pub-key string          service account public key
      --service-sig-algo string         service account key signature algorithm (default "ECDSA_P256")
      --simple-addresses                use sequential addresses starting with 0x01
      --skip-tx-validation              skip verification of transaction signatures and sequence numbers
      --snapshot                        enable snapshots for emulator
      --sqlite-url string               sqlite db URL for persisting sqlite storage backend 
      --storage-limit                   enable account storage limit (default true)
      --storage-per-flow string         the MB amount of storage capacity an account has per 1 FLOW token it has. e.g. '100.0'. The default is taken from the current version of flow-go
      --token-supply string             initial FLOW token supply (default "1000000000.0")
      --transaction-expiry int          transaction expiry, measured in blocks (default 10)
      --transaction-fees                enable transaction fees
      --transaction-max-gas-limit int   maximum gas limit for transactions (default 9999)
  -v, --verbose                         enable verbose logging

Use "flow emulator [command] --help" for more information about a command.


------------

Create/Load/List emulator snapshots

Usage:
  flow emulator snapshot <create|load|list> [snapshotName] [flags]

Examples:
flow emulator snapshot create testSnapshot




------------

Retrieve events

Usage:
  flow events [command]

Available Commands:
  get         Get events in a block range

Use "flow events [command] --help" for more information about a command.


------------

Get events in a block range

Usage:
  flow events get <event_name> [flags]

Examples:
#fetch events from the latest 10 blocks is the default behavior
flow events get A.1654653399040a61.FlowToken.TokensDeposited

#specify manual start and stop blocks
flow events get A.1654653399040a61.FlowToken.TokensDeposited --start 11559500 --end 11559600

#in order to get and event from the 20 latest blocks on a network run
flow events get A.1654653399040a61.FlowToken.TokensDeposited --last 20 --network mainnet

#if you want to fetch multiple event types that is done by sending in more events. Even fetching will be done in parallel.
flow events get A.1654653399040a61.FlowToken.TokensDeposited A.1654653399040a61.FlowToken.TokensWithdrawn
	


Flags:
      --batch uint    Number of blocks each worker will fetch (default 25)
      --end uint      End block height
      --last uint     Fetch number of blocks relative to the last block. Ignored if the start flag is set. Used as a default if no flags are provided (default 10)
      --start uint    Start block height
      --workers int   Number of workers to use when fetching events in parallel (default 10)



------------

execute, generate, package

Usage:
  flow flix [command]

Available Commands:
  execute     execute FLIX template with a given id, name, local filename, or url
  generate    generate FLIX json template given local Cadence filename
  package     package file for FLIX template fcl-js is default

Use "flow flix [command] --help" for more information about a command.


------------

execute FLIX template with a given id, name, local filename, or url

Usage:
  flow flix execute <id | name | path | url> [flags]

Examples:
flow flix execute transfer-flow 1 0x123456789


Flags:
      --args-json string     arguments in JSON-Cadence format
      --authorizer strings   Name of a single or multiple comma-separated accounts used as authorizers from configuration
      --block-height uint    block height to execute the script at
      --block-id string      block ID to execute the script at
      --exclude strings      Fields to exclude from the output (events)
      --gas-limit uint       transaction gas limit (default 1000)
      --include strings      Fields to include in the output
      --lang string          language to generate the template for (default "js")
      --payer string         Account name from configuration used as payer
      --pre-fill string      template path to pre fill the FLIX
      --proposer string      Account name from configuration used as proposer
      --signer string        Account name from configuration used to sign the transaction as proposer, payer and suthorizer



------------

generate FLIX json template given local Cadence filename

Usage:
  flow flix generate <cadence.cdc> [flags]

Examples:
flow flix generate multiply.cdc


Flags:
      --args-json string     arguments in JSON-Cadence format
      --authorizer strings   Name of a single or multiple comma-separated accounts used as authorizers from configuration
      --block-height uint    block height to execute the script at
      --block-id string      block ID to execute the script at
      --exclude strings      Fields to exclude from the output (events)
      --gas-limit uint       transaction gas limit (default 1000)
      --include strings      Fields to include in the output
      --lang string          language to generate the template for (default "js")
      --payer string         Account name from configuration used as payer
      --pre-fill string      template path to pre fill the FLIX
      --proposer string      Account name from configuration used as proposer
      --signer string        Account name from configuration used to sign the transaction as proposer, payer and suthorizer



------------

package file for FLIX template fcl-js is default

Usage:
  flow flix package <id | name | path | url> --lang <lang> [flags]

Examples:
flow flix package multiply.template.json --lang js


Flags:
      --args-json string     arguments in JSON-Cadence format
      --authorizer strings   Name of a single or multiple comma-separated accounts used as authorizers from configuration
      --block-height uint    block height to execute the script at
      --block-id string      block ID to execute the script at
      --exclude strings      Fields to exclude from the output (events)
      --gas-limit uint       transaction gas limit (default 1000)
      --include strings      Fields to include in the output
      --lang string          language to generate the template for (default "js")
      --payer string         Account name from configuration used as payer
      --pre-fill string      template path to pre fill the FLIX
      --proposer string      Account name from configuration used as proposer
      --signer string        Account name from configuration used to sign the transaction as proposer, payer and suthorizer



------------

Run Flowser project explorer

Usage:
  flow flowser [flags]

Examples:
flow flowser


Flags:
      --emulator-host string   Host for access node connection (default "http://localhost:8888")
      --port uint              Dev wallet port to listen on (default 8701)



------------

Generate template files for common Cadence code

Usage:
  flow generate [command]

Aliases:
  generate, g

Available Commands:
  contract    Generate Cadence smart contract template
  script      Generate a Cadence script template
  transaction Generate a Cadence transaction template

Use "flow generate [command] --help" for more information about a command.


------------

Generate Cadence smart contract template

Usage:
  flow generate contract <name> [flags]

Examples:
flow generate contract HelloWorld


Flags:
      --dir string   Directory to generate files in



------------

Generate a Cadence script template

Usage:
  flow generate script <name> [flags]

Examples:
flow generate script SomeScript


Flags:
      --dir string   Directory to generate files in



------------

Generate a Cadence transaction template

Usage:
  flow generate transaction <name> [flags]

Examples:
flow generate transaction SomeTransaction


Flags:
      --dir string   Directory to generate files in



------------

Help provides help for any command in the application.
Simply type flow help [path to command] for full details.

Usage:
  flow help [command] [flags]




------------

Initialize a new configuration

Usage:
  flow init [flags]

Examples:
flow project init


Flags:
      --global                       Initialize global user configuration
      --reset                        Reset configuration file
      --service-hash-algo string     Service account key hash algorithm (default "SHA3_256")
      --service-private-key string   Service account private key
      --service-sig-algo string      Service account key signature algorithm (default "ECDSA_P256")



------------

Generate and decode Flow keys

Usage:
  flow keys [command]

Available Commands:
  decode      Decode an encoded public key
  derive      Derive public key from a private key
  generate    Generate a new key-pair

Use "flow keys [command] --help" for more information about a command.


------------

Decode an encoded public key

Usage:
  flow keys decode <rlp|pem> <encoded public key> [flags]

Examples:
flow keys decode rlp f847b8408...2402038203e8


Flags:
      --from-file string   Load key from file
      --sig-algo string    Signature algorithm (default "ECDSA_P256")



------------

Derive public key from a private key

Usage:
  flow keys derive <encoded private key> [flags]

Examples:
flow keys derive 4247b8408...2402038203e8


Flags:
      --sig-algo string   Signature algorithm (default "ECDSA_P256")



------------

Generate a new key-pair

Usage:
  flow keys generate [flags]

Examples:
flow keys generate


Flags:
      --derivationPath string   Derivation path (default "m/44'/539'/0'/0/0")
      --mnemonic string         Mnemonic seed to use
      --sig-algo string         Signature algorithm (default "ECDSA_P256")



------------

Manage your Cadence project

Usage:
  flow project [command]

Available Commands:
  deploy      Deploy Cadence contracts

Use "flow project [command] --help" for more information about a command.


------------

Deploy Cadence contracts

Usage:
  flow project deploy [flags]

Examples:
flow project deploy --network testnet


Flags:
      --show-diff   use show-diff flag to show diff between existing and new contracts on update
      --update      use update flag to update existing contracts



------------

Start emulator and deploy all project contracts

Usage:
  flow run [flags]

Examples:
flow run




------------

Execute Cadence scripts

Usage:
  flow scripts [command]

Available Commands:
  execute     Execute a script

Use "flow scripts [command] --help" for more information about a command.


------------

Execute a script

Usage:
  flow scripts execute <filename> [<argument> <argument> ...] [flags]

Examples:
flow scripts execute script.cdc "Meow" "Woof"


Flags:
      --args-json string    arguments in JSON-Cadence format
      --block-height uint   block height to execute the script at
      --block-id string     block ID to execute the script at



------------

Manage persisted global settings

Usage:
  flow settings [command]

Available Commands:
  metrics     Configure command usage metrics settings

Use "flow settings [command] --help" for more information about a command.


------------

Configure command usage metrics settings

Usage:
  flow settings metrics [flags]

Examples:
flow settings metrics disable 
flow settings metrics enable




------------

Start a new Flow project

Usage:
  flow setup <project name> [flags]

Examples:
flow setup my-project


Flags:
      --scaffold          Interactively select a provided scaffold for project creation
      --scaffold-id int   Use provided scaffold ID for project creation



------------

Signature verification and creation

Usage:
  flow signatures [command]

Available Commands:
  generate    Generate the message signature
  verify      Verify the signature

Use "flow signatures [command] --help" for more information about a command.


------------

Generate the message signature

Usage:
  flow signatures generate <message> [flags]

Examples:
flow signatures generate 'The quick brown fox jumps over the lazy dog' --signer alice


Flags:
      --signer string   name of the account used to sign (default "emulator-account")



------------

Verify the signature

Usage:
  flow signatures verify <message> <signature> <public key> [flags]

Examples:
flow signatures verify 'The quick brown fox jumps over the lazy dog' 99fa...25b af3...52d


Flags:
      --hash-algo string   Hashing algorithm used to create signature (default "SHA3_256")
      --sig-algo string    Signature algorithm used to create the public key (default "ECDSA_P256")



------------

Retrieve the protocol state snapshot

Usage:
  flow snapshot [command]

Available Commands:
  save        Get the latest finalized protocol snapshot

Use "flow snapshot [command] --help" for more information about a command.


------------

Get the latest finalized protocol snapshot

Usage:
  flow snapshot save [flags]

Examples:
flow snapshot save /tmp/snapshot.json




------------

Display the status of the Flow network

Usage:
  flow status [flags]




------------

Run Cadence tests

Usage:
  flow test <filename> [flags]

Examples:
flow test script.cdc


Flags:
      --cover                 Use the cover flag to calculate coverage report
      --covercode string      Use the covercode flag to calculate coverage report only for certain types of code. Available values are "all" & "contracts" (default "all")
      --coverprofile string   Filename to write the calculated coverage report. Supported extensions are .json and .lcov (default "coverage.json")
      --name string           Use the name flag to run only tests that match the given name
      --random                Use the random flag to execute test cases randomly
      --seed int              Use the seed flag to manipulate random execution of test cases



------------

Build, sign, send and retrieve transactions

Usage:
  flow transactions [command]

Available Commands:
  build       Build an unsigned transaction
  decode      Decode a transaction
  get         Get the transaction by ID
  send        Send a transaction
  send-signed Send signed transaction
  sign        Sign built transaction

Use "flow transactions [command] --help" for more information about a command.


------------

Build an unsigned transaction

Usage:
  flow transactions build <code filename>  [<argument> <argument> ...] [flags]

Examples:
flow transactions build ./transaction.cdc "Hello" --proposer alice --authorizer alice --payer bob


Flags:
      --args-json string         arguments in JSON-Cadence format
      --authorizer strings       transaction authorizer (default [emulator-account])
      --gas-limit uint           transaction gas limit (default 1000)
      --payer string             transaction payer (default "emulator-account")
      --proposer string          transaction proposer (default "emulator-account")
      --proposer-key-index int   proposer key index



------------

Decode a transaction

Usage:
  flow transactions decode <transaction filename> [flags]

Examples:
flow transactions decode ./transaction.rlp


Flags:
      --include strings   Fields to include in the output. Valid values: signatures, code, payload.



------------

Get the transaction by ID

Usage:
  flow transactions get <tx_id> [flags]

Aliases:
  get, status

Examples:
flow transactions get 07a8...b433


Flags:
      --exclude strings   Fields to exclude from the output. Valid values: events.
      --include strings   Fields to include in the output. Valid values: signatures, code, payload, fee-events.
      --sealed            Wait for a sealed result (default true)



------------

Send a transaction

Usage:
  flow transactions send <code filename> [<argument> <argument> ...] [flags]

Examples:
flow transactions send tx.cdc "Hello world"


Flags:
      --args-json string     arguments in JSON-Cadence format
      --authorizer strings   Name of a single or multiple comma-separated accounts used as authorizers from configuration
      --exclude strings      Fields to exclude from the output (events)
      --gas-limit uint       transaction gas limit (default 1000)
      --include strings      Fields to include in the output
      --payer string         Account name from configuration used as payer
      --proposer string      Account name from configuration used as proposer
      --signer string        Account name from configuration used to sign the transaction as proposer, payer and suthorizer



------------

Send signed transaction

Usage:
  flow transactions send-signed <signed transaction filename> [flags]

Examples:
flow transactions send-signed signed.rlp


Flags:
      --exclude strings   Fields to exclude from the output (events)
      --include strings   Fields to include in the output. Valid values: signatures, code, payload.



------------

Sign built transaction

Usage:
  flow transactions sign [<built transaction filename> | --from-remote-url <url>] [flags]

Examples:
flow transactions sign ./built.rlp --signer alice


Flags:
      --from-remote-url string   server URL where RLP can be fetched, signed RLP will be posted back to remote URL.
      --include strings          Fields to include in the output. Valid values: signatures, code, payload.
      --signer strings           name of a single or multiple comma-separated accounts used to sign (default [emulator-account])



------------

View version and commit information

Usage:
  flow version [flags]


Global Flags:
  -f, --config-path strings   Path to flow configuration file (default [/Users/tomhaile/flow.json,flow.json])
  -x, --filter string         Filter result values by property name
      --format string         Format result values (default "text")
      --host string           Flow Access API host address
  -l, --log string            Log level, options: "debug", "info", "error", "none" (default "info")
  -n, --network string        Network from configuration file (default "emulator")
      --network-key string    Flow Access API host network key for secure client connections
  -o, --output string         Output format, options: "text", "json", "inline" (default "text")
  -s, --save string           Save result to a filename
      --skip-version-check    Skip version check during start up
  -y, --yes                   Approve any prompts


------------

```

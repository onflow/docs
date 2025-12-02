// Prism language definition for Cadence
// Based on Cadence syntax patterns from Code Hike's TextMate grammar

// Import Prism from prism-react-renderer
import { Prism } from 'prism-react-renderer';

// Register Cadence language with Prism
if (Prism && !(Prism.languages as any).cadence) {
  (Prism.languages as any).cadence = {
    // Comments - must come first to avoid conflicts
    'comment': [
      {
        pattern: /\/\/.*/,
        greedy: true,
      },
      {
        pattern: /\/\*[\s\S]*?\*\//,
        greedy: true,
      },
    ],
    // Strings - must come before other patterns
    'string': {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
    // Addresses - must come before numbers to avoid conflicts, use 'number' token type for theme compatibility
    'number': [
      {
        pattern: /\b0x[a-fA-F0-9]{16,}\b/i,
        greedy: true,
      },
      {
        pattern: /\b\d+\.?\d*(?:e[+-]?\d+)?\b/i,
        greedy: true,
      },
    ],
    // Keywords - includes 'from' which was missing
    'keyword': /\b(?:access|all|any|as|attachment|auth|before|break|case|catch|class|continue|contract|else|event|false|for|from|fun|if|import|in|init|interface|let|nil|post|pre|prepare|priv|pub|public|remove|resource|return|self|struct|switch|then|to|transaction|true|try|type|var|while|execute)\b/,
    // Built-in types and standard library types - use 'class-name' for better theme support
    'class-name': [
      {
        pattern: /\b(?:Address|String|Int|Int8|Int16|Int32|Int64|Int128|Int256|UInt|UInt8|UInt16|UInt32|UInt64|UInt128|UInt256|Word8|Word16|Word32|Word64|Fix64|UFix64|Bool|Character|Void|Never|AnyStruct|AnyResource|Type|Capability|Path|StoragePath|PublicPath|PrivatePath|AuthAccount|PublicAccount|Account|DeployedContract)\b/,
        greedy: true,
      },
      {
        // User-defined types (capitalized identifiers that aren't keywords or built-ins)
        pattern: /\b[A-Z][a-zA-Z0-9_]*(?:\.[A-Z][a-zA-Z0-9_]*)*\b/,
        greedy: true,
      },
    ],
    // Function names
    'function': {
      pattern: /\b[a-z_$][a-zA-Z0-9_$]*(?=\s*\()/,
      greedy: true,
    },
    // Constants
    'constant': /\b(?:nil|true|false)\b/,
    // Operators including reference (&) and optional (?)
    'operator': {
      pattern: /[+\-*\/%=<>!&|?]+|&&|\|\||\?\?|\.\./,
      greedy: true,
    },
    // Punctuation
    'punctuation': /[{}[\];(),.:]/,
  };

  // Also register as 'cdc' alias
  (Prism.languages as any).cdc = (Prism.languages as any).cadence;
}


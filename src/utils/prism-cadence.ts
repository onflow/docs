// Prism language definition for Cadence
// Based on Cadence syntax patterns from Code Hike's TextMate grammar

// Import Prism from prism-react-renderer
import { Prism } from 'prism-react-renderer';

// Register Cadence language with Prism
if (Prism && !(Prism.languages as any).cadence) {
  (Prism.languages as any).cadence = {
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
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  'keyword': /\b(?:access|all|any|as|attachment|auth|before|break|case|catch|class|continue|contract|else|event|false|for|fun|if|import|in|init|interface|let|nil|post|pre|prepare|priv|pub|public|remove|resource|return|self|struct|switch|then|to|transaction|true|try|type|var|while|execute)\b/,
  'function': /\b[a-z_$][\w$]*(?=\s*\()/i,
  'number': {
    pattern: /\b0x[\da-f]+\b|\b\d+\.?\d*(?:e[+-]?\d+)?/i,
    greedy: true,
  },
  'operator': /[+\-*\/%=<>!&|]+/,
  'punctuation': /[{}[\];(),.:]/,
  'type': /\b[A-Z][\w]*\b/,
  'constant': /\b(?:nil|true|false)\b/,
    'address': /\b0x[a-fA-F0-9]{16}\b/,
    'storage-path': /StoragePath\s*\(/,
  };

  // Also register as 'cdc' alias
  (Prism.languages as any).cdc = (Prism.languages as any).cadence;
}


---
title: SEO-Rich Title That Matches Document Name and Path
description: A one sentence description.
sidebar_label: Title (match title if possible; can shorten if more than 2 lines, prefer 1 line)
sidebar_position: 5
keywords:
  - keywords
  - describing
  - the main topics
  - cursor is great at this
---

# Complete Title (Must Match Front Matter Title)

1-2 Paragraphs describing what the tutorial will teach, why someone might learn it, and if possible, a link to a live version of the app demoing the techniques and content taught.

**Important:** Do not add an H2 "Overview" heading. The overview text goes directly after the H1 title.

## Objectives

Now that you've completed this tutorial, you'll be able to:

- 3-5 high-level Bloom's taxonomy verb learning objectives (terminal objectives, not enabling objectives)
- Don't wordsmith these - clarity and directness are more important than variety
- It's okay if they're repetitive (e.g., "Construct X, Construct Y, Construct Z" is fine)
- Can use lower-level verbs if it makes sense for the learning goal

## Prerequisites

**Note:** Use canonical prerequisite text from the templates folder. When the import system is available, import prerequisites rather than copying and pasting.

### Next.js and Modern Frontend Development

This tutorial uses [Next.js]. You don't need to be an expert, but it's helpful to be comfortable with development using a current React framework. You'll be on your own to select and use a package manager, manage Node versions, and other frontend environment tasks. If you don't have your own preference, you can just follow along with us and use [Yarn].

### (Additional Prerequisites)

This doesn't need to be exhaustive, but it should be comprehensive. It's a good place to outline what you're specifically **not** going to teach in this tutorial.

## Descriptive H2 Heading (Not "Part 1", "Part 2", etc.)

Text can go here. Usually it will be either an introduction to a long section with subsections, or a short section with no subsections that doesn't fit under a higher level.

### Document Length Guidelines

- Target size: ~500 lines (with each paragraph as a line, no manual line breaks)
- Maximum: 1000 lines
- Minimum: 200-300 lines (unless standalone like a simple configuration guide)
- If a tutorial exceeds 1000 lines, consider splitting into separate documents at logical breakpoints

### Subsection (H3)

Divide each section into appropriate categories.

**Recommended document structure:** Most documents should have 2-3 H2 sections with 2-5 H3 subsections in each.

**Avoid H4 and above** - If you're getting into H4, you're cutting the content into too small pieces.

## Another Descriptive H2 Heading

More text goes here. Use explicit, descriptive headings that tell the reader what they'll be doing in that section.

### Subsection (H3)

Continue as appropriate

## Tutorial Approach

**We are opinionated and provide one golden path.** We tell people one and only one specific way to do things in tutorials. This doesn't mean we can't teach multiple things - we can take learners through a journey - but we don't overwhelm them with choices when they're not informed enough to make decisions.

**Example:** In the getting started tutorial, we don't say "you could deploy this on testnet or emulator or mainnet." Instead, we say "first you are going to deploy this on emulator, here's how. Next you are going to deploy this on testnet, here's how."

**Why?** Learners coming to a tutorial don't know what they're doing - that's why they're at the tutorial. Cognitive friction from making decisions while learning prevents effective learning. If they have more experience, they can adapt our approach to their needs.

**Our opinionated choices:**

- Frontend: Next.js and Tailwind
- EVM: Wagmi
- Cadence: React SDK

**Rationale:** If they're a non-professional frontend developer writing smart contracts, they need exact instructions. If they're a professional frontend developer, they'll adapt it anyway and know how to do that.

## Style Guide

This section is a **guide** for the style and tone we use writing tutorials at Flow. It is **not** rigid or inflexible, but should be generally adhered to without specific reasons for exceptions.

Our standard is to achieve approximately 85% adherence or better before publication. It does not need to be perfect and we can iterate later.

### Tone, Format, Language, and General Guidance

- Write content in a friendly and approachable tone, think business casual.
  - Tutorials are less formal, docs are more formal, articles are in the middle.
- **Subheadings use sentence case** (not title case)
- **Use proper heading levels (H2, H3) for subheadings - do not use bold text alone as a heading**
  - Use H2 for main sections
  - Use H3 for subsections (can be used freely)
  - **Recommended structure:** Most documents should have 2-3 H2 sections with 2-5 H3 subsections in each
  - Avoid H4 and above
  - Bold text is for emphasis within content, not for creating headings
- Avoid passive voice
- **Target eighth grade reading level** - We're teaching difficult and complicated things to people from many different backgrounds with many different first languages. We do not need to show off our vocabulary.
- Use **you** and **we** to speak directly to the learner
  - Use **you** when giving specific instructions to the learner or things they need to be aware of.
    - Next, you'll need to implement a function that does X, Y, and Z.
    - You might find that it's useful to index this property, but there is a performance cost.
  - Use **we** when speaking as Flow Foundation (not "Flow Foundation" in third person - we're people talking to people).
    - We recommend this approach.
    - We found that a setting of 50 works best, but it's more of an art than a science.
    - **Exception:** Only use "Flow Foundation" in third person for legal disclaimers when required by counsel.
- Avoid gerunds (-ing) when possible, but prioritize technical accuracy and clarity. If avoiding a gerund makes the text passive, uses 12 words instead of 5, or reduces technical accuracy, use the gerund.
- We do not use profanity.
- Released content should be free of spelling and grammar errors.
- We use US English spellings.
- We do **not** use manual line breaks.
- We can be tactfully critical of other networks, but we must back up criticism with facts and evidence. We are not harsh or insulting.
- We use the Oxford comma.
- We use one space after periods.
  - Use an ESLint plugin for markdown that auto-formats your document
  - The site will render the same with 1 space or 2, so it is a moot point

### Organization

- If you move a file, you **must** add a permanent redirect to `vercel.json`.
- File and folder names are kebab case.
  - `docs/build/cadence/guides/account-linking/account-linking-with-dapper.md`
- Images can be stored either:
  - Flat in the same folder as the document: `docs/build/cadence/guides/account-linking/example-app.png`
  - In an `images` folder within the document's directory: `docs/build/cadence/guides/account-linking/images/example-app.png`
  - Either approach is acceptable. Using an images folder is better organization, but having images flat in the folder is more convenient and encourages more image usage.

### Emphasis

- We use two asterisks to **bold** text for emphasis.
  - When stating a negative, always emphasize the part where you say that you should **not** do something.
- We use one underscore to highlight, introduce, or emphasize _technical terms_.
  - Every instance of the term should **not** be highlighted. Only the first, the first in awhile, or when special attention must be called.
- Inline code samples or references, filenames, or interactive elements are surrounded by `backticks`.
  - Next, call the `approve()` function.
  - After filling out the form, click Submit (prefer "click Submit" over "click the `Submit` button" - more declarative and cleaner).
  - UI interface elements can be in backticks to make them look like buttons: click the `Submit` button.
  - The `.borrow()` function is a property used to...
  - Create a file called `providers.ts` in the `app` folder.
  - Function names must include the parentheses after the name but should **not** include parameters.

### Code Blocks and Admonitions

- [Code Blocks] should be used for any segment of code longer than 15 characters.
  - Supply the appropriate language
  - Cadence is supported
  - Always use `tsx` and `jsx` for TypeScript or JavaScript (they render TS/JS correctly too)
  - Use `zsh` for terminal text (not `bash`) to match MacBook defaults
- [Admonitions] are used to highlight important sections of text.
  - **Important:** You must have a blank new line before and after the admonition text, otherwise the auto-formatter will break them.
  - `tip` is used to share a tip or suggestion, or to remind the learner of something. **Use `tip`, not `note`** (note makes the box white and doesn't call enough attention).
  - `reminder` is used to remind the learner of something.
  - `info` is used to highlight unusual, confusing, or particularly important information.
  - `warning` is used to highlight cases in which a mistake can cause confusion, frustration, or cost developer time.
  - `danger` is used for anything in which a mistake can cause account compromise, loss of funds, key exposure, or any other type of permanent harm for developers or their users. Use sparingly but appropriately - we work in a high-stakes environment where mistakes can cost millions of dollars.

### Links

- We use reference-style links using the text itself to identify the link.
  - See lines 11 and 17 in this [markdown reference links] document.
  - This makes the raw file more readable for editing and allows you to repeat links easily.
- Link the first reference to a function, property, tool, library, etc. and the first reference in the section in which it is used.
  - This is critically important for links both within docs and to external sites
  - Don't link every instance - it quickly gets overwhelming and can hurt SEO if you have too many links.
- Avoid linking to other networks' sites unless:
  - Citing a source or specific piece of information (e.g., "their own documents say that there is one single sequencer...")
  - Making a critical point backed by facts
  - Otherwise, don't make it easier for people to go to competitor information
- We strongly cross-link with products that work with our stuff (e.g., Wagmi docs, RainbowKit docs) and encourage them to cross-link with us.
- Internal links are relative and link to the **file name** (not the URL). Docusaurus will sort itself at build time, and adding the `.md` or `.mdx` makes the link clickable in the editor.
  - `[link example]: ../up-one-folder/other-document.md`
  - This only gets tricky when pages have names like `cadence-index.md` that don't match the URL, but the build will break and you'll know to fix it.

### Lists

- Unordered lists are defined using a dash `-`. The auto-formatter will do this for you.
- Ordered lists are defined with the number `1.` for every item. These will render the correct number automatically.
  - Using `1.` for every item makes it much easier to maintain - if you need to add an item in the middle, you don't need to renumber everything.
  1. One
  1. Two
  1. Three
  1. Four
- Sentences in bulleted lists end in a period.
  - When a bulleted list is introduced by a colon, each bullet effectively completes that first sentence, so periods are grammatically correct.
  - Lists of 1-3 word items, such as product names, do not need periods.

## Canonical Spelling and Capitalization

- For other brands, we are diligent to follow their spelling and capitalization
- Flow
- Flow Foundation
- Flow Cadence
- Flow Cadence Mainnet
- Flow Cadence Testnet
- Flow EVM
- Flow EVM Mainnet
- Flow EVM Testnet
- **onchain** (one word, never "on-chain" or "on chain")
  - This matches how Base talks about it
- **web3**, **blockchain**, **crypto** (lowercase, used frequently for SEO reasons)
- **app** (not "mobile app" - in 2025, you just say "app")
- onchain app
  - Only when needed to distinguish from web apps, mobile apps, etc.
  - **Never dapp, Dapp, or dApp** (DAP is banned)
- frontend
- backend
- DevRel

## Conclusion

**Always include a conclusion.** The conclusion repeats the learning objectives verbatim.

After you complete this tutorial, you'll be able to:

- Copy/paste the Objectives from above here (repeat them exactly)

(OPTIONAL) Now that you've completed this tutorial, you're ready to...

**Note:** Both the overview (after H1) and conclusion can be written with Cursor/AI assistance, but you'll almost always need to edit them afterward.

<!-- Reference-style links, will not render on page -->

[Cadence]: https://cadence-lang.org/docs
[Next.js]: https://nextjs.org/docs/app/getting-started/installation
[Yarn]: https://yarnpkg.com
[Code Blocks]: https://docusaurus.io/docs/markdown-features/code-blocks
[Admonitions]: https://docusaurus.io/docs/markdown-features/admonitions
[markdown reference links]: https://gist.github.com/emedinaa/28ed71b450243aba48accd634679f805

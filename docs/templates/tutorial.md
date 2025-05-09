---
title: Title, shorten if necessary, will be on sidebar
description: A one sentence description.
sidebar_position: 5
keywords:
  - keywords
  - describing
  - the main topics
  - cursor is great at this
---

# Complete Title

1-2 Paragraphs describing what the tutorial will teach, why someone might learn it, and if possible, a link to a live version of the app demoing the techniques and content taught.

## Objectives

After completing this guide, you'll be able to:

- 3-5 appropriate level Bloom's taxonomy verb objectives
- Don't wordsmith these
- It's ok of they're repetitive

## Prerequisites

### Next.js and Modern Frontend Development

This tutorial uses [Next.js]. You don't need to be an expert, but it's helpful to be comfortable with development using a current React framework. You'll be on your own to select and use a package manager, manage Node versions, and other frontend environment tasks. If you don't have your own preference, you can just follow along with us and use [Yarn].

### (Additional Prerequisites)

This doesn't need to be exhaustive, but it should be comprehensive. It's a good place to outline what you're specifically **not** going to teach in this tutorial.

## Part 1

Text can go here. Usually it will be either an introduction to a long section with subsections, or a short section with no subsections that doesn't fit under a higher level.

### Subsection 1

Divide each part into appropriate categories.

**Avoid h4 and above**

## Part 2

More text goes here

### Subsection 1

Continue as appropriate

## Style Guide

This section is a **guide** for the style and tone we use writing tutorials at Flow. It is **not** rigid or inflexible, but should be generally adhered to without specific reasons for exceptions.

Our standard is to achieve approximately 85% adherence or better before publication. It does not need to be perfect and we can iterate later.

### Tone, Format, Language, and General Guidance

- Write content in a friendly and approachable tone, think business casual.
  - Tutorials are less formal, docs are more formal, articles are in the middle.
- Avoid passive voice
- Use **you** and **we** to speak directly to the learner
  - Generally, use **you** when giving specific instructions to the learner to do on their own or giving them advice.
    - Next, you'll need to implement a function that does X, Y, and Z. Try doing this on your own first.
    - You might find that it's useful to index this property, but there is a performance cost.
  - Use **we** when walking the learner through a task in a guided fashion, or when sharing an opinion (lead with **the team**).
    - Next, we'll go step by step to implement the function to handle this task.
    - We've found that a setting of 50 works best, but it's more of an art than a science.
- We do not use profanity.
- Released content should be free of spelling and grammar errors.
- We use US English spellings.
- We do **not** use manual line breaks.
- We are open and honest about our pros and cons as compared to other networks, but we are not harsh, critical, or insulting.
- We use the Oxford comma.
- We use one space after periods.
  - Use an autoformatter if you are unable to type only one.
  - The site will render the same with 1 space or 2, so it is a moot point.

### Organization

- If you move a file, you **must** add a permanent re-direct to `vercel.json`.
- File and folder names are kebab case.
  - `docs/build/guides/account-linking/account-linking-with-dapper.md`
- Images are stored flat in the same folder as the document that uses them.
  - `docs/build/guides/account-linking/example-app.png`
  - This balances organization vs. convenience. We can re-evaluate if it gets out of control.

### Emphasis

- We use two asterisks to **bold** text for emphasis.
  - When stating a negative, always emphasize the part where you say that you should **not** do something.
- We use one underscore to highlight, introduce, or emphasize _technical terms_.
  - Every instance of the term should **not** be highlighted. Only the first, the first in awhile, or when special attention must be called.
- Inline code samples or references, filenames, or interactive elements are surrounded by `backticks`.
  - Next, call the `approve()` function.
  - After filling out the form, click the `Submit` button.
  - The `.borrow()` function is a property used to...
  - Create a file called `providers.ts` in the `app` folder.
  - Function names must include the parentheses after the name but should **not** include parameters.

### Code Blocks and Admonitions

- [Code Blocks] should be used for any segment of code longer than 15 characters.
  - Supply the appropriate language
  - Cadence is supported
  - Always use `tsx` and `jsx` for TypeScript or JavaScript
  - Use `zsh` for terminal text
- [Admonitions] are used to highlight important sections of text.
  - `tip` is used to share a tip or suggestion, or to remind the learner of something.
  - `info` is used to highlight unusual, confusing, or particularly important information.
  - `warning` is used to highlight cases in which a mistake can cause confusion, frustration, or cost developer time.
  - `danger` is used for anything in which a mistake can cause account compromise, loss of funds, key exposure, or any other type of permanent harm for developers or their users.

### Links

- We use reference-style links using the text itself to identify the link.
  - See lines 11 and 17 in this [markdown reference links] document.
- Link the first reference to a function, property, tool, library, etc. and the first reference in the section in which it is used.
  - This is critically important for links both within docs and to external sites
  - Avoid unnecessarily linking directly to other networks' sites or properties unless citing a source.
- Internal links are relative and link to the file name. Docusaurus will sort itself and adding the `.md` or `.mdx` makes the link clickable in the editor.
  - `[link example]: ../up-one-folder/other-document.md]`

### Lists

- Unordered lists are defined using a dash `-`.
- Ordered lists are defined with the number `1.` for every item. These will render the correct number automatically.
  1. 1.-One
  1. 1.-Two
  1. 1.-Three
  1. 1.-Four
- Sentences in lists end in a period
  - Lists of 1-3 word items, such as product names, do not.

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
- onchain
  - Never on chain or on-chain
  - web3 is acceptable but not preferred unless speaking about the industry or era
- onchain app
  - Only when needed to distinguish from web apps, mobile apps, etc.
  - Never dapp, Dapp, or dApp
- frontend
- backend
- DevRel

## Conclusion

In this tutorial, you ...

Now that you have completed the tutorial, you should be able to:

- Copy/paste the Objectives from above here

(OPTIONAL) Now that you've completed this tutorial, you're ready to...

<!-- Reference-style links, will not render on page -->

[Cadence]: https://cadence-lang.org/docs
[Next.js]: https://nextjs.org/docs/app/getting-started/installation
[Yarn]: https://yarnpkg.com
[Code Blocks]: https://docusaurus.io/docs/markdown-features/code-blocks
[Admonitions]: https://docusaurus.io/docs/markdown-features/admonitions
[markdown reference links]: https://gist.github.com/emedinaa/28ed71b450243aba48accd634679f805

---
title: Use Flow Knowledge Base in Cursor
sidebar_label: Use Cursor AI
keywords:
  - Cursor
  - AI
  - Flow documentation
  - Cadence documentation
  - Flow development
  - Flow tools
  - Flow IDE
  - Flow setup
  - Flow configuration
  - Flow AI assistance
---

[Cursor](https://www.cursor.com/) is an AI code editor that makes it easy to write code while building Flow apps.  
Let's walk through how to setup Cursor for the best possible experience when writing applications on Flow.

## Installation

Adding Flow docs lets you interact with our docs directly and get the most accurate answers to your questions.

1. Go to Cursor Settings > Features > Docs and click "+ Add new doc".
   ![Cursor Settings](./images//use-cursor-1.png)
2. Set Flow Docs:

- Enter the URL of the Flow docs: `https://developers.flow.com/tools` and press Enter.
  - Note: This **will index all** the docs. We're investigating why you need `/tools`
  - Cursor will automatically detect the Flow docs and index them for you.
  - Ensure the name is `Flow`, and click "Confirm" to add the docs.
    ![Cursor Settings](./images//use-cursor-2.png)

3. Set Cadence Docs: (Optional, but recommended)
   - Click "+ Add new doc" again, now enter the URL of the Cadence docs: `https://cadence-lang.org/docs/` and press Enter.
   - Same process as before, ensure the name is `Cadence`, and click "Confirm" to add the docs.
4. Now wait for Cursor to index the docs. You can check the progress in the Docs section of the settings. After the indexing is complete, you can start using the docs in Cursor.

## Using Flow Docs in Cursor

You can then reference the Flow docs in your prompt with the `@Flow` symbol or `@Cadence` for the Cadence docs.  
![Cursor Settings](./images//use-cursor-3.png)

## Best Practices

When using Cursor with Flow documentation:

- Use `@Flow` when asking questions about Flow-specific concepts, tools, or ecosystem
- Use `@Cadence` when asking questions about Cadence programming language syntax or features
- Be specific in your prompts to get more accurate and relevant answers
- Combine both `@Flow` and `@Cadence` when working on cross-VM applications
- Use the documentation to verify AI-generated code and ensure best practices

## Troubleshooting

If you encounter any issues:

1. Ensure both Flow and Cadence docs are properly indexed
2. Try refreshing the documentation if answers seem outdated
3. Check your internet connection as Cursor needs to access the documentation
4. Verify the URLs are correct in your settings
5. Contact Cursor support if issues persist

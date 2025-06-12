---
title: Use Flow Knowledge Base in ChatGPT
sidebar_label: Use ChatGPT
sidebar_position: 2
keywords:
  - ChatGPT
  - Gemini
  - AI
  - OpenAI
  - Flow documentation
  - Cadence documentation
  - Flow development
  - Flow tools
  - Flow IDE
  - Flow setup
  - Flow configuration
  - Flow AI assistance
---

# Use Flow Knowledge Base in Custom LLMs

LLMs can help with tasks such as writing, coding, and answering questions. It adapts to context and user input to provide relevant, conversational responses. They can be integrated into developer tools or workflows to assist with documentation, debugging, and productivity.

This guide walks you through creating a **Custom LLM**, such as [ChatGPT]'s GPTs or [Gemini]'s Gems, that can reference the [Flow Data Sources] file to answer questions.

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
  <iframe 
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    src="https://www.youtube.com/embed/Lu6KrNvGthI" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
  ></iframe>
</div>

:::warning

You'll need a [ChatGPT Plus subscription] to use the **Custom GPT** feature or a [Gemini Pro subscription] to use the **Custom Gem** feature.

:::

## 📍 Step 1: Open the "Custom LLM" Section

1. Log in to [ChatGPT] or [Gemini]
2. In the sidebar on the left
  - If using ChatGPT, click on **GPTs**
  - If using Gemini, click on **Explore Gems**

<img width="462" alt="Screenshot 2025-06-12 at 15 12 17" src="https://github.com/user-attachments/assets/74513927-fea2-46e2-9602-43bd726f525c" />
<img width="462" alt="Screenshot 2025-06-12 at 15 11 56" src="https://github.com/user-attachments/assets/144dab4b-c0e9-4511-9af4-fccc282a97f7" />

---

## 📍 Step 2: Click "Create a GPT"

- In the **GPTs** screen, click the **"Create"** button in the top-right corner.
- In the **Explore Gems** screen, click the **New Gem** button in the center-right of the screen. 

<img width="202" alt="Screenshot 2025-06-12 at 15 15 18" src="https://github.com/user-attachments/assets/e7455803-6e8f-4d29-af33-2cde3f077696" />
<img width="202" alt="Screenshot 2025-06-12 at 15 15 33" src="https://github.com/user-attachments/assets/d22647a3-4a86-4f8e-b61a-9b7ebd6eea24" />


---

## 📍 Step 3: Walk Through the Agent Coniguration

- If using ChatGPT, click on the **Configure** button before proceeding.

1. Fill the **Name and description** of your custom LLM.
    - You can name the agent **FlowDocs** and set the description as: **Provides knowledge about building on Flow**.
3. **Instructions**: Tell it how to behave and what to prioritize (e.g., always reference the uploaded document)
4. **Capabilities**: Enable file browsing, code interpreter, or DALL·E if needed

### Suggested Prompt

```text
I want to make an agent called FlowDocs that uses the linked file as its primary source.  This file changes, so it should reference the live file at least once a day:  https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md

Please imagine you are a fast and smart junior developer who is eager to help and has memorized all the information in the linked file
```

Please let us know if you find any other useful customization prompts!

- You can further customize your personalized agent by providing more files and determining the actions it can do.

---

## 📍 Step 5: Test Your GPT

Once the personalized agent is built, you'll be taken to a preview chat window. Test it by asking a few questions based on your uploaded document.

---

## 📍 Step 6: Save and Publish (Optional)

When you're ready:

- Click **"Update & Save"** to finalize
- You can choose to keep it **private** or make it **public**

---

## ✅ That's it!

You've now created a custom GPT that references your uploaded file as a primary source. You can update the file or instructions later if needed.

[ChatGPT]: https://chatgpt.com/
[Gemini]: https://gemini.google.com/app
[OpenAI]: https://openai.com/
[ChatGPT Plus subscription]: https://chat.openai.com
[Gemini Pro subscription]: https://gemini.google/subscriptions/
[Flow Data Sources]: ../flow-data-sources.md
[Flow Data Sources All Merged]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md

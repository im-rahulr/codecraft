# Augment Code Extension: Prompt and Answer Feature

## Overview

In the current Augment documentation, this experience appears to be described as **Chat** rather than as a separate feature literally named **Prompt and Answer**.

In practice, **Prompt and Answer** is the chat-based workflow where a user asks Augment a question or gives it an instruction, and Augment responds with an explanation, guidance, or code.

Its purpose is to help users:

- explore a codebase
- understand unfamiliar code
- work through technical problems
- generate or refine code
- move faster without leaving the editor

## Purpose of the Feature

The feature is designed to let users ask coding questions **inside the IDE** and receive answers that are informed by the workspace.

According to Augment's documentation, Chat can be used to:

- explore your codebase
- get up to speed on unfamiliar code
- get help working through a technical problem

If the workspace is indexed, Augment can tailor answers to the user's:

- codebase
- coding patterns
- best practices
- preferences

## How a User Interacts With It

### 1. Open Augment in the IDE

Open the Augment panel in VS Code and use the chat or prompt area.

### 2. Enter a prompt

Type a question, instruction, or request in natural language.

Examples:

- "Explain how authentication works in this project."
- "Why is this function failing?"
- "Refactor this to be easier to read."
- "Write a test for this endpoint."
- "Summarize this file."

### 3. Add context if needed

You can improve the answer by explicitly giving Augment context, such as:

- selected code
- files
- folders
- external documentation

This is especially useful when the question depends on a specific part of the project.

### 4. Read the answer and continue

Augment replies in chat. You can then:

- ask follow-up questions
- clarify the request
- narrow or expand the scope
- ask for code changes or examples

## What Kinds of Prompts It Supports

### Understanding code

- What does this class do?
- Explain this function step by step.
- Trace how a request flows through this code.

### Debugging

- Why might this throw an error?
- What are possible causes of this bug?
- Help me investigate this failing test.

### Code generation

- Write a helper for parsing this data.
- Generate a unit test for this file.
- Create a React component that matches this pattern.

### Refactoring and improvement

- Simplify this logic.
- Make this more readable.
- Suggest safer error handling.

### Project navigation and onboarding

- Where is authentication implemented?
- Which files handle uploads?
- How is this service wired together?

## Typical Workflow

### Step 1: Ask a question

Start with a plain-language prompt.

### Step 2: Provide context

If the question is code-specific, attach or select the relevant code or files.

### Step 3: Review the answer

Augment responds with an explanation, recommendation, or code.

### Step 4: Refine through follow-ups

You can continue the conversation with prompts like:

- Make that more concise.
- Show me the exact code.
- Now write tests too.
- Explain only the important part.

### Step 5: Apply code if provided

If Augment returns code, the documentation indicates you can apply it to your codebase using options such as:

- `Copy`
- `Create`

## What Output to Expect

Depending on the prompt, Augment may return:

- a plain-English explanation
- a step-by-step breakdown
- debugging suggestions
- implementation ideas
- code snippets
- refactoring suggestions
- test examples

In practice, the output is usually a mix of:

- reasoning and explanation
- recommended next steps
- code when appropriate

## Requirements and Limitations

### Workspace context matters

The quality of answers depends heavily on the context Augment has.

If the workspace is indexed, answers can be much more tailored.

### It is not magic

If the prompt is vague, the answer may also be vague.

For example:

- "Fix this" is weak
- "Fix this null error in `upload.ts` when `file` is missing" is much better

### It may need explicit context

Even with indexing, Augment may still need you to point it to:

- the right file
- the selected code
- the error message
- the relevant documentation

### Generated code should still be reviewed

Generated code should be treated as a strong draft, not something to accept blindly.

Check for:

- correctness
- edge cases
- style consistency
- project-specific constraints

## Best Practices

### Be specific

Good prompts usually include:

- the goal
- the file or feature involved
- the problem you are seeing
- any constraints

### Provide relevant context

Attach or select the exact code when possible.

### Use follow-up prompts

You do not need a perfect prompt on the first try. A strong workflow is:

1. ask broadly
2. inspect the answer
3. refine with follow-up prompts

### Ask for the format you want

You can steer the answer with requests like:

- Explain briefly.
- Show only the code.
- Give me a step-by-step plan.
- Write tests too.

### Validate the result

If Augment suggests code, review and test it before relying on it.

## Simple New-User Summary

If you are new to Augment, think of Prompt and Answer like this:

1. Open Augment Chat.
2. Ask a coding question in natural language.
3. Give it code or files when needed.
4. Read the answer.
5. Ask follow-up questions.
6. Copy or create code from the response if useful.

## Bottom Line

The feature's main job is to let users **ask coding questions directly in the editor and get codebase-aware answers back**.

The most important things to remember are:

- it works best with good context
- indexed workspace context improves answers
- specific prompts beat vague prompts
- code suggestions should still be reviewed and tested


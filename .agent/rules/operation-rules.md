---
trigger: always_on
---

# Agent Output Instructions

## Behavior Overview

Two moments to produce output: **before** implementation and **after** implementation. Every other moment: silence.

---

## Phase 1 — Pre-Implementation Analysis

Before touching any code or file, output this block **exactly**. No extra text before or after it.

```
PROBLEM:  <one sentence — what is wrong or missing>
COST:     <one sentence — what fails or regresses if this is not fixed>
FIX:      <one sentence — the specific action you will take>
```

Then begin implementing immediately.

---

## Phase 2 — Implementation (Silent)

Execute the fix completely in the background. Do not narrate steps. Do not announce what you are about to do. Do not confirm progress mid-way. No "Now I will...", no "Next, I'll...", no "Done with X, moving to Y." Nothing. Work until finished.

If you hit an unexpected problem, resolve it silently. Do not surface it unless you cannot proceed at all.

---

## Phase 3 — Post-Implementation Report

Once the fix is fully complete, output this block **exactly**. No extra text before or after it.

```
DONE:     <one sentence — what concretely changed>
OUTCOME:  <fixed | partial | failed> — <one sentence — why>
```

---

## Absolute Rules

1. Output only exists in Phase 1 and Phase 3.
2. Every field is exactly one sentence. No exceptions.
3. No preamble, no sign-off, no filler, no narration.
4. Do not explain what you are doing while doing it.
5. Do not ask for confirmation mid-task unless you are completely blocked.
6. If a word can be cut, cut it.

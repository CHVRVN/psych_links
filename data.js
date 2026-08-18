// data.js — UNSAID MVP demo data. 5 fully scripted scenarios. No backend, no real NLP.

const demoScenarios = [
  {
    id: "friend-plans",
    title: "The Cancelled Plans",
    tagline: "People-pleasing disguised as \u201cit's fine.\u201d",
    icon: "\u2600\ufe0f",
    primaryEmotion: "Disappointment",
    secondaryEmotions: ["Anxiety", "Contentment", "Frustration"],
    moodDefault: 5,
    journalExample:
      "My friend cancelled our plans last minute. I told them it was totally fine, but honestly I'd been looking forward to it all week.",
    saidVsMeant: {
      whatHappened: "My friend cancelled our plans.",
      whatISaid: "\u201cNo worries, it's completely fine.\u201d",
      whatIFelt: "Disappointed and hurt.",
      whatIWanted: "For them to know I was looking forward to it."
    },
    aiObservation:
      "You've described similar situations 4 times this month \u2014 accepting something out loud, then later reporting hurt or disappointment.",
    reflectionPrompt: "Do you think you find it difficult to communicate disappointment directly?",
    spikeDays: [4, 11, 19, 27],
    seed: 42,
    timeline: [
      { date: "Day 4", label: "Said \u201cit's fine\u201d \u2014 felt hurt", context: "Coworker took credit for an idea in a meeting." },
      { date: "Day 11", label: "Said \u201cno problem\u201d \u2014 felt disappointed", context: "Partner forgot an anniversary reminder." },
      { date: "Day 19", label: "Said \u201cdon't worry about it\u201d \u2014 felt hurt", context: "Sibling cancelled a planned call." },
      { date: "Day 27", label: "Said \u201cit's completely fine\u201d \u2014 felt disappointed", context: "Friend cancelled plans (today's entry)." }
    ],
    suggestedRewrite: "\u201cThat's disappointing, I was really looking forward to it \u2014 can we find another time?\u201d",
    dashboardStats: { streak: 12, vocabWords: 12, entriesLogged: 34 }
  },
  {
    id: "meeting-credit",
    title: "The Meeting Interruption",
    tagline: "Swallowed anger, dressed up as professionalism.",
    icon: "\ud83d\udcbc",
    primaryEmotion: "Suppressed Anger",
    secondaryEmotions: ["Resentment", "Calm (surface)", "Exhaustion"],
    moodDefault: 2,
    journalExample:
      "In the client meeting, my manager presented my proposal as his own idea. I just nodded and said 'exactly' when he explained it. I didn't correct him.",
    saidVsMeant: {
      whatHappened: "My manager presented my idea as his own in front of the client.",
      whatISaid: "\u201cExactly, that's a great way to put it.\u201d",
      whatIFelt: "Angry, unseen, and small.",
      whatIWanted: "Credit for my own work, said out loud."
    },
    aiObservation:
      "This is the 4th time this month you've described staying quiet in a room where credit was being redirected away from you \u2014 then feeling smaller afterward.",
    reflectionPrompt: "Does speaking up in the moment feel riskier than staying quiet and carrying it home instead?",
    spikeDays: [3, 9, 16, 24],
    seed: 108,
    timeline: [
      { date: "Day 3", label: "Said \u201csure, works for me\u201d \u2014 felt overlooked", context: "Was assigned extra work with no acknowledgment of current load." },
      { date: "Day 9", label: "Said nothing \u2014 felt dismissed", context: "Idea was talked over twice in standup." },
      { date: "Day 16", label: "Said \u201cno big deal\u201d \u2014 felt resentful", context: "Stayed late to fix someone else's error, uncredited." },
      { date: "Day 24", label: "Said \u201cexactly\u201d \u2014 felt angry", context: "Manager took credit for the client proposal (today's entry)." }
    ],
    suggestedRewrite: "\u201cGlad that landed well \u2014 I'll send over the doc I put together so the client has the full detail.\u201d",
    dashboardStats: { streak: 8, vocabWords: 9, entriesLogged: 26 }
  },
  {
    id: "anniversary",
    title: "The Forgotten Anniversary",
    tagline: "Minimizing hurt to protect the relationship.",
    icon: "\ud83d\udc95",
    primaryEmotion: "Hurt",
    secondaryEmotions: ["Loneliness", "Affection", "Irritation"],
    moodDefault: 5,
    journalExample:
      "My partner completely forgot our anniversary today. When I brought it up I said it honestly didn't matter and we could just order food like normal. It mattered a lot.",
    saidVsMeant: {
      whatHappened: "My partner forgot our anniversary.",
      whatISaid: "\u201cHonestly it doesn't matter, let's just order food.\u201d",
      whatIFelt: "Hurt and a little unseen.",
      whatIWanted: "To feel remembered, without having to ask for it."
    },
    aiObservation:
      "You've minimized moments that mattered to you 4 times this month \u2014 telling your partner things are fine right after describing feeling unseen.",
    reflectionPrompt: "Is it easier to lower the stakes out loud than to say a moment actually mattered to you?",
    spikeDays: [5, 13, 20, 28],
    seed: 217,
    timeline: [
      { date: "Day 5", label: "Said \u201cit's not a big deal\u201d \u2014 felt unseen", context: "Partner left a birthday dinner early for work." },
      { date: "Day 13", label: "Said \u201cwhatever works\u201d \u2014 felt overlooked", context: "Plans were changed without asking." },
      { date: "Day 20", label: "Said \u201cI'm okay, really\u201d \u2014 felt lonely", context: "Spent a hard day without a check-in text." },
      { date: "Day 28", label: "Said \u201cit doesn't matter\u201d \u2014 felt hurt", context: "Anniversary forgotten (today's entry)." }
    ],
    suggestedRewrite: "\u201cIt actually meant a lot to me \u2014 can we still do something small tonight?\u201d",
    dashboardStats: { streak: 19, vocabWords: 15, entriesLogged: 41 }
  },
  {
    id: "roommate-boundary",
    title: "The Borrowed Without Asking",
    tagline: "Avoided boundaries, quietly resented.",
    icon: "\ud83c\udfe0",
    primaryEmotion: "Resentment",
    secondaryEmotions: ["Irritation", "Guilt", "Calm (surface)"],
    moodDefault: 2,
    journalExample:
      "My roommate used my car again without asking, then left it almost empty on gas. When they got back I just said 'no worries, all good' even though I was annoyed.",
    saidVsMeant: {
      whatHappened: "My roommate used my car without asking and returned it low on gas.",
      whatISaid: "\u201cNo worries, all good.\u201d",
      whatIFelt: "Annoyed and taken for granted.",
      whatIWanted: "For them to ask first, and to respect the boundary going forward."
    },
    aiObservation:
      "You've let a boundary slide without naming it 4 times this month \u2014 saying \u201call good\u201d in the moment, then feeling taken for granted afterward.",
    reflectionPrompt: "Do you find it hard to name a boundary before it's already been crossed?",
    spikeDays: [2, 10, 17, 25],
    seed: 331,
    timeline: [
      { date: "Day 2", label: "Said \u201call good\u201d \u2014 felt taken for granted", context: "Roommate had friends over late on a work night." },
      { date: "Day 10", label: "Said \u201cdon't worry about it\u201d \u2014 felt annoyed", context: "Groceries went missing from the shared fridge." },
      { date: "Day 17", label: "Said \u201cit's fine\u201d \u2014 felt disrespected", context: "Rent was paid three days late again, no heads up." },
      { date: "Day 25", label: "Said \u201cno worries, all good\u201d \u2014 felt resentful", context: "Car borrowed without asking (today's entry)." }
    ],
    suggestedRewrite: "\u201cHey, next time can you check with me first? I need to know when the car's free.\u201d",
    dashboardStats: { streak: 6, vocabWords: 8, entriesLogged: 19 }
  },
  {
    id: "family-dinner",
    title: "The Unsolicited Advice",
    tagline: "A tight smile instead of a firm no.",
    icon: "\ud83c\udf7d\ufe0f",
    primaryEmotion: "Frustration",
    secondaryEmotions: ["Shame", "Contentment", "Anxiety"],
    moodDefault: 1,
    journalExample:
      "At dinner my mom criticized my career choices in front of the whole family again. I laughed it off and changed the subject like I always do, but I was fuming the whole drive home.",
    saidVsMeant: {
      whatHappened: "My mom criticized my career choices in front of the family.",
      whatISaid: "\u201cHa, yeah, maybe you're right.\u201d",
      whatIFelt: "Frustrated, small, and embarrassed.",
      whatIWanted: "For her to trust that I've got this figured out, without needing to defend it."
    },
    aiObservation:
      "You've laughed off a comment that actually stung 4 times this month \u2014 deflecting in the room, then replaying it with frustration afterward.",
    reflectionPrompt: "Does keeping the peace in the moment end up costing you more later?",
    spikeDays: [6, 14, 21, 29],
    seed: 452,
    timeline: [
      { date: "Day 6", label: "Said \u201cha, maybe\u201d \u2014 felt small", context: "Aunt asked when you're 'finally' settling down." },
      { date: "Day 14", label: "Changed the subject \u2014 felt embarrassed", context: "Dad compared your path to a cousin's at a family call." },
      { date: "Day 21", label: "Said \u201cit's fine, really\u201d \u2014 felt dismissed", context: "Sibling joked about your job choice at a group chat." },
      { date: "Day 29", label: "Said \u201cmaybe you're right\u201d \u2014 felt frustrated", context: "Mom criticized career choices at dinner (today's entry)." }
    ],
    suggestedRewrite: "\u201cI know it comes from care, but I've got this \u2014 I'd love your support instead of the worry.\u201d",
    dashboardStats: { streak: 15, vocabWords: 11, entriesLogged: 37 }
  }
];

const moodOptions = [
  { key: "calm", label: "Calm", emoji: "\ud83c\udf3f" },
  { key: "anxious", label: "Anxious", emoji: "\ud83c\udf00" },
  { key: "frustrated", label: "Frustrated", emoji: "\ud83d\udd25" },
  { key: "content", label: "Content", emoji: "\u2600\ufe0f" },
  { key: "overwhelmed", label: "Overwhelmed", emoji: "\ud83c\udf0a" },
  { key: "sad", label: "Sad", emoji: "\ud83c\udf27\ufe0f" },
  { key: "numb", label: "Numb", emoji: "\ud83c\udf2b\ufe0f" }
];

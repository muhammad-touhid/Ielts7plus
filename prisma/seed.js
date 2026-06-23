const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@ielts7plus.com" },
    update: {},
    create: {
      email: "admin@ielts7plus.com",
      password: hashedPassword,
      name: "Super Admin",
    },
  });
  console.log("Admin seeded");

  // Clear existing questions
  await prisma.mockTestQuestion.deleteMany();
  console.log("Cleared existing questions");

  // Listening questions
  const listeningQuestions = [
    {
      text: "What is the name of the student who calls the accommodation office?",
      options: ["Sarah Mitchell", "James Cooper", "Emily Watson", "David Lee"],
      correctAnswer: "Sarah Mitchell",
    },
    {
      text: "What type of room does the student initially request?",
      options: [
        "Single room",
        "Double room",
        "Shared dormitory",
        "Studio apartment",
      ],
      correctAnswer: "Single room",
    },
    {
      text: "On which floor is the available room located?",
      options: ["Ground floor", "Second floor", "Third floor", "Fourth floor"],
      correctAnswer: "Third floor",
    },
    {
      text: "How much is the weekly rent for the available room?",
      options: ["£85", "£95", "£105", "£115"],
      correctAnswer: "£95",
    },
    {
      text: "What is included in the rent?",
      options: ["Meals only", "Bills only", "Meals and bills", "Internet only"],
      correctAnswer: "Bills only",
    },
  ];

  for (let i = 0; i < listeningQuestions.length; i++) {
    await prisma.mockTestQuestion.create({
      data: {
        module: "listening",
        type: "mcq",
        order: i + 1,
        content: listeningQuestions[i],
        published: true,
      },
    });
  }
  console.log("Listening questions seeded");

  // Reading passage
  await prisma.mockTestQuestion.create({
    data: {
      module: "reading",
      type: "passage",
      order: 1,
      content: {
        title: "Emotional Intelligence",
        passage: `The concept of emotional intelligence (EI) was popularised in the 1990s by psychologist Daniel Goleman, who argued that a person's ability to understand and manage their own emotions — and those of others — was as important as cognitive intelligence in determining success in life and work. Goleman identified five core components of emotional intelligence: self-awareness, self-regulation, motivation, empathy, and social skills.\n\nResearch conducted over the past three decades has produced mixed findings regarding the predictive power of EI. Several studies suggest that individuals with higher emotional intelligence perform better in leadership roles, demonstrate greater resilience under stress, and report higher levels of job satisfaction. However, critics argue that EI is difficult to measure reliably and that many EI assessments overlap significantly with existing personality frameworks such as the Big Five model.\n\nDespite ongoing academic debate, emotional intelligence training programmes have been widely adopted in corporate settings. Multinational companies including Google, Amazon, and Unilever have invested substantially in EI-based leadership development, citing improvements in team cohesion, conflict resolution, and employee retention as key benefits.`,
      },
      published: true,
    },
  });
  console.log("Reading passage seeded");

  // Reading questions
  const readingQuestions = [
    {
      text: "Who popularised the concept of emotional intelligence in the 1990s?",
      options: [
        "Sigmund Freud",
        "Daniel Goleman",
        "Carl Jung",
        "Howard Gardner",
      ],
      correctAnswer: "Daniel Goleman",
    },
    {
      text: "How many core components of EI did Goleman identify?",
      options: ["Three", "Four", "Five", "Six"],
      correctAnswer: "Five",
    },
    {
      text: "According to the passage, individuals with higher EI are more likely to:",
      options: [
        "Score higher in IQ tests",
        "Perform better in leadership roles",
        "Avoid workplace stress completely",
        "Reject corporate training programmes",
      ],
      correctAnswer: "Perform better in leadership roles",
    },
    {
      text: "What do critics argue about EI assessments?",
      options: [
        "They are too expensive",
        "They are culturally biased",
        "They overlap with personality frameworks",
        "They are only useful for managers",
      ],
      correctAnswer: "They overlap with personality frameworks",
    },
    {
      text: "Which of the following companies is NOT mentioned in the passage?",
      options: ["Google", "Amazon", "Microsoft", "Unilever"],
      correctAnswer: "Microsoft",
    },
  ];

  for (let i = 0; i < readingQuestions.length; i++) {
    await prisma.mockTestQuestion.create({
      data: {
        module: "reading",
        type: "mcq",
        order: i + 1,
        content: readingQuestions[i],
        published: true,
      },
    });
  }
  console.log("Reading questions seeded");

  // Writing tasks
  const writingTasks = [
    {
      label: "Task 1",
      prompt:
        "The chart below shows the percentage of households in different income groups that owned at least one car in a European country between 1980 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
      minWords: 150,
      timeLabel: "20 minutes recommended",
    },
    {
      label: "Task 2",
      prompt:
        "Some people believe that the best way to improve road safety is to increase the minimum driving age to 21. Others feel that better driver education is the solution.\n\nDiscuss both views and give your own opinion.\n\nWrite at least 250 words.",
      minWords: 250,
      timeLabel: "40 minutes recommended",
    },
  ];

  for (let i = 0; i < writingTasks.length; i++) {
    await prisma.mockTestQuestion.create({
      data: {
        module: "writing",
        type: "task",
        order: i + 1,
        content: writingTasks[i],
        published: true,
      },
    });
  }
  console.log("Writing tasks seeded");

  // Speaking parts
  const speakingParts = [
    {
      part: "Part 1 — Introduction",
      instruction:
        "Answer these personal questions naturally. Aim for 2–3 sentences per answer.",
      questions: [
        "Can you tell me your full name and where you are from?",
        "Do you currently work or are you a student? Tell me about it.",
        "What do you enjoy doing in your free time?",
      ],
    },
    {
      part: "Part 2 — Cue Card",
      instruction:
        "You have one minute to prepare. Then speak for 1–2 minutes on the topic below.",
      questions: [
        "Describe a book or film that had a significant impact on you.\n\nYou should say:\n• what the book or film was\n• when you read or watched it\n• what it was about\n• and explain why it had such an impact on you.",
      ],
    },
    {
      part: "Part 3 — Discussion",
      instruction:
        "Discuss these broader questions in depth. Aim for 3–5 sentences per answer.",
      questions: [
        "Why do you think some books or films influence people more than others?",
        "How has the way people consume books and films changed in recent years?",
        "Do you think governments should fund the arts, including film and literature? Why or why not?",
      ],
    },
  ];

  for (let i = 0; i < speakingParts.length; i++) {
    await prisma.mockTestQuestion.create({
      data: {
        module: "speaking",
        type: "part",
        order: i + 1,
        content: speakingParts[i],
        published: true,
      },
    });
  }
  console.log("Speaking parts seeded");

  console.log("All questions seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

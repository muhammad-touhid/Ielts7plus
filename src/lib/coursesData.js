const courses = [
  {
    slug: "ielts-preparation",
    name: "IELTS Preparation",
    tagline: "Your complete roadmap to Band 7 and beyond.",
    description:
      "Our flagship IELTS Preparation course is designed for students who want a structured, expert-led path to achieving Band 7+. Covering all four modules — Listening, Reading, Writing, and Speaking — this course combines live classes, mock tests, and personalised feedback to get you exam-ready fast.",
    icon: "ti ti-certificate",
    price: "৳ 12,000",
    duration: "3 Months",
    batchSize: "15–20 Students",
    classes: "3 Classes / Week",
    level: "Beginner to Advanced",
    features: [
      "All 4 modules: Listening, Reading, Writing & Speaking",
      "Live classes with certified IELTS instructors",
      "10 full-length mock tests with answer analysis",
      "Personalised writing and speaking feedback",
      "Complete study materials and resources",
      "Dedicated doubt-clearing sessions",
      "Exam-day strategy and confidence training",
      "Access to recorded class sessions",
    ],
    whatYouWillLearn: [
      {
        icon: "ti ti-headphones",
        title: "Listening Mastery",
        desc: "Understand a wide range of accents and question types with targeted listening drills.",
      },
      {
        icon: "ti ti-book",
        title: "Reading Strategies",
        desc: "Learn skimming, scanning, and time management techniques to tackle all passage types.",
      },
      {
        icon: "ti ti-pencil",
        title: "Writing Excellence",
        desc: "Master Task 1 reports and Task 2 essays with structured frameworks and band-scoring criteria.",
      },
      {
        icon: "ti ti-microphone",
        title: "Speaking Confidence",
        desc: "Develop fluency, coherence, and pronunciation skills across all three parts of the Speaking test.",
      },
    ],
    highlights: [
      { icon: "ti ti-star", label: "96% Success Rate" },
      { icon: "ti ti-users", label: "3,000+ Students" },
      { icon: "ti ti-award", label: "Certified Trainers" },
      { icon: "ti ti-refresh", label: "Free Retake Support" },
    ],
  },
  {
    slug: "spoken-english",
    name: "Spoken English",
    tagline: "Speak with clarity, confidence, and fluency.",
    description:
      "The Spoken English course is built for learners who want to communicate naturally and confidently in everyday and professional situations. Through interactive group sessions and real-world practice, you will build the fluency, pronunciation, and vocabulary needed to express yourself clearly in any setting.",
    icon: "ti ti-microphone",
    price: "৳ 5,000",
    duration: "2 Months",
    batchSize: "10–15 Students",
    classes: "3 Classes / Week",
    level: "Beginner to Intermediate",
    features: [
      "Fluency and natural speech rhythm training",
      "Pronunciation and accent reduction techniques",
      "Real-life conversation and role-play sessions",
      "Vocabulary expansion for everyday use",
      "Weekly speaking assessments with feedback",
      "Group discussion and debate practice",
      "Business and academic English modules",
      "Certified and experienced instructors",
    ],
    whatYouWillLearn: [
      {
        icon: "ti ti-volume",
        title: "Clear Pronunciation",
        desc: "Eliminate common pronunciation errors and speak with natural clarity and confidence.",
      },
      {
        icon: "ti ti-message-circle",
        title: "Everyday Conversation",
        desc: "Handle real-world conversations — from casual chats to formal meetings — with ease.",
      },
      {
        icon: "ti ti-vocabulary",
        title: "Vocabulary Building",
        desc: "Learn high-frequency words and phrases to express ideas more precisely and naturally.",
      },
      {
        icon: "ti ti-trending-up",
        title: "Fluency & Flow",
        desc: "Develop the ability to speak at a natural pace without hesitation or awkward pauses.",
      },
    ],
    highlights: [
      { icon: "ti ti-message-dots", label: "Interactive Sessions" },
      { icon: "ti ti-users", label: "Small Batch Size" },
      { icon: "ti ti-award", label: "Certified Trainers" },
      { icon: "ti ti-heart", label: "Confidence Building" },
    ],
  },
  {
    slug: "advanced-writing",
    name: "Advanced Writing",
    tagline: "Write with precision, structure, and impact.",
    description:
      "The Advanced Writing course is designed for learners who want to master academic and professional writing. With a deep focus on IELTS Writing Task 1 and Task 2, this course teaches you how to structure arguments, use sophisticated vocabulary, and meet the band descriptors that examiners look for.",
    icon: "ti ti-pencil",
    price: "৳ 6,000",
    duration: "3 Months",
    batchSize: "10–15 Students",
    classes: "2 Classes / Week",
    level: "Intermediate to Advanced",
    features: [
      "In-depth Task 1 (graphs, charts, maps, diagrams)",
      "Task 2 essay types: opinion, discussion, problem-solution",
      "Coherence, cohesion, and paragraph structure",
      "Lexical resource and grammatical range training",
      "Weekly writing submissions with detailed marking",
      "Band 7+ writing frameworks and templates",
      "Peer review and instructor feedback sessions",
      "Timed writing practice under exam conditions",
    ],
    whatYouWillLearn: [
      {
        icon: "ti ti-chart-bar",
        title: "Task 1 Reporting",
        desc: "Describe graphs, charts, processes, and maps with accurate language and clear structure.",
      },
      {
        icon: "ti ti-list-details",
        title: "Essay Writing",
        desc: "Plan and write cohesive, well-argued essays across all IELTS Task 2 question types.",
      },
      {
        icon: "ti ti-ABC",
        title: "Advanced Vocabulary",
        desc: "Use a wide range of lexical items accurately to impress examiners and boost your score.",
      },
      {
        icon: "ti ti-check",
        title: "Self-Editing Skills",
        desc: "Identify and correct your own grammatical and structural errors before submission.",
      },
    ],
    highlights: [
      { icon: "ti ti-pencil", label: "Weekly Feedback" },
      { icon: "ti ti-file-check", label: "Band 7+ Templates" },
      { icon: "ti ti-award", label: "Expert Marking" },
      { icon: "ti ti-clock", label: "Timed Practice" },
    ],
  },
  {
    slug: "grammar-writing",
    name: "Grammar & Writing",
    tagline: "Build a rock-solid foundation in English grammar.",
    description:
      "The Grammar & Writing course is perfect for learners who want to strengthen their fundamental English skills before moving on to advanced preparation. You will master core grammar rules, sentence construction, and paragraph writing — building the confidence and accuracy needed for academic success.",
    icon: "ti ti-writing",
    price: "৳ 4,500",
    duration: "2 Months",
    batchSize: "15–20 Students",
    classes: "3 Classes / Week",
    level: "Beginner to Intermediate",
    features: [
      "Complete grammar fundamentals from scratch",
      "Tenses, modals, articles, and prepositions",
      "Sentence structure and clause types",
      "Paragraph writing and essay introduction",
      "Common grammatical error correction",
      "Practice worksheets and written exercises",
      "Weekly progress assessments",
      "Supportive, beginner-friendly environment",
    ],
    whatYouWillLearn: [
      {
        icon: "ti ti-grammar",
        title: "Core Grammar Rules",
        desc: "Understand and apply the fundamental rules of English grammar with accuracy and confidence.",
      },
      {
        icon: "ti ti-layout-rows",
        title: "Sentence Construction",
        desc: "Build simple, compound, and complex sentences that communicate ideas clearly.",
      },
      {
        icon: "ti ti-notes",
        title: "Paragraph Writing",
        desc: "Organise ideas into well-structured paragraphs with clear topic sentences and support.",
      },
      {
        icon: "ti ti-eraser",
        title: "Error Correction",
        desc: "Identify and fix the most common mistakes that hold English learners back.",
      },
    ],
    highlights: [
      { icon: "ti ti-star", label: "Beginner Friendly" },
      { icon: "ti ti-file-text", label: "Practice Worksheets" },
      { icon: "ti ti-award", label: "Certified Trainers" },
      { icon: "ti ti-trending-up", label: "Rapid Progress" },
    ],
  },
];

export function getCourse(slug) {
  return courses.find((c) => c.slug === slug) || null;
}

export function getAllSlugs() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default courses;

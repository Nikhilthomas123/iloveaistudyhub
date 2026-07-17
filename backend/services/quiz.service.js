const { generateText } = require('ai');
const { models } = require('../config/models');

async function generateQuiz(topic, difficulty) {
  const prompt = `
Generate exactly 5 multiple choice questions.

Topic:
${topic}

Difficulty:
${difficulty}

Seed parameter (for uniqueness):
${Date.now()}-${Math.random()}

Rules:

Return ONLY valid JSON.

Format:

{
  "questions":[
    {
      "question":"",
      "options":[
        "",
        "",
        "",
        ""
      ],
      "correctAnswer":""
    }
  ]
}

Requirements
- Exactly 5 questions
- Exactly 4 options
- Only one correct answer
- Questions must match the selected difficulty
- No explanation
- No markdown
- No extra text
- JSON only
`;

  try {
    const result = await generateText({
      model: models.research, // Reusing existing Google model
      system: "You are a helpful study assistant. Your job is to output strictly valid JSON conforming to the requested schema. Do not include markdown code block syntax (like ```json).",
      prompt: prompt,
      maxTokens: 1000,
      temperature: 0.8,
    });

    const cleanedText = result.text.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    const quizData = JSON.parse(cleanedText);
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid structure: 'questions' list not found.");
    }
    return quizData;
  } catch (error) {
    console.warn(`Gemini AI Quiz Generation failed (${error.message}). Returning dynamic mock fallback...`);
    
    const questionPools = {
      Beginner: [
        {
          question: `What is the primary purpose of ${topic}?`,
          options: [
            `To simplify application architecture using ${topic}`,
            `To handle state transitions in ${topic}`,
            `To render user interface elements for ${topic}`,
            `To define helper configurations for ${topic}`
          ],
          correctAnswer: `To simplify application architecture using ${topic}`
        },
        {
          question: `Which of the following is a key characteristic of ${topic} at Beginner level?`,
          options: [
            "Highly efficient memory consumption",
            "Declarative syntax patterns",
            "Simplified concurrency management",
            "All of the above"
          ],
          correctAnswer: "All of the above"
        },
        {
          question: `What is a common anti-pattern when working with ${topic}?`,
          options: [
            "Overcomplicating the modular state logic",
            "Directly mutating internal configurations",
            "Neglecting lifecycle cleanups",
            "Failing to handle asynchronous side effects"
          ],
          correctAnswer: "Directly mutating internal configurations"
        },
        {
          question: `How does ${topic} integrate with external frameworks at Beginner level?`,
          options: [
            "Via standard JSON serialization",
            "Through custom middleware adapter hooks",
            "Using native bindings",
            "Both A and B"
          ],
          correctAnswer: "Both A and B"
        },
        {
          question: `Which command is typically used to initialize ${topic}?`,
          options: [
            `npm init ${topic.toLowerCase()}`,
            `npx create-${topic.toLowerCase()}`,
            `${topic.toLowerCase()} --setup`,
            "None of the above"
          ],
          correctAnswer: "None of the above"
        },
        {
          question: `What is the easiest way to learn ${topic}?`,
          options: [
            "Reading the official documentation",
            "Watching video tutorials online",
            "Building small, simple projects",
            "All of the above"
          ],
          correctAnswer: "All of the above"
        },
        {
          question: `Which of the following files is most related to ${topic}?`,
          options: [
            "config.json",
            "index.html",
            "package.json",
            "README.md"
          ],
          correctAnswer: "config.json"
        },
        {
          question: `Who usually works with ${topic} in a development team?`,
          options: [
            "Software Engineers",
            "Database Administrators",
            "Product Owners",
            "All of the above"
          ],
          correctAnswer: "Software Engineers"
        }
      ],
      Intermediate: [
        {
          question: `How does ${topic} optimize rendering updates at an Intermediate level?`,
          options: [
            "By implementing virtual DOM diffing algorithm",
            "By batching state updates asynchronously",
            "By caching calculated values in memory",
            "By refactoring child components into pure functions"
          ],
          correctAnswer: "By batching state updates asynchronously"
        },
        {
          question: `In ${topic}, what is the main difference between static and dynamic bindings?`,
          options: [
            "Static bindings resolve at compile time, whereas dynamic bindings resolve at runtime",
            "Static bindings are immutable, whereas dynamic bindings are mutable",
            "Static bindings use less CPU cycle, whereas dynamic bindings use more RAM",
            "There is no difference"
          ],
          correctAnswer: "Static bindings resolve at compile time, whereas dynamic bindings resolve at runtime"
        },
        {
          question: `Which hook or pattern is recommended for shared state in ${topic}?`,
          options: [
            "Singleton design pattern",
            "Global event bus adapter",
            "Context provider with reducer pattern",
            "Prop drilling down the hierarchy tree"
          ],
          correctAnswer: "Context provider with reducer pattern"
        },
        {
          question: `What is the time complexity of the core algorithm inside ${topic} under normal load?`,
          options: [
            "O(1)",
            "O(log N)",
            "O(N)",
            "O(N log N)"
          ],
          correctAnswer: "O(log N)"
        },
        {
          question: `When debugging ${topic}, what is the first tool you should open?`,
          options: [
            "Browser developer console logs",
            "System performance task manager",
            "Database admin monitor control",
            "Network package analyzer"
          ],
          correctAnswer: "Browser developer console logs"
        },
        {
          question: `Which of the following describes a middleware pattern in ${topic}?`,
          options: [
            "Intercepting requests and responses sequentially",
            "Defining static layouts",
            "Compiling syntax templates",
            "Configuring access control lists"
          ],
          correctAnswer: "Intercepting requests and responses sequentially"
        }
      ],
      Advanced: [
        {
          question: `Explain the memory leak vulnerability associated with global references in ${topic}.`,
          options: [
            "Objects are kept in memory because garbage collection roots still reference them",
            "Heap space gets fragmented by frequent memory allocations",
            "The event loop is blocked by synchronous execution cycles",
            "Stack overflow crashes the active process instantly"
          ],
          correctAnswer: "Objects are kept in memory because garbage collection roots still reference them"
        },
        {
          question: `Which architecture is best suited for horizontally scaling ${topic}?`,
          options: [
            "Stateless microservices architecture",
            "Monolithic shared-memory multiprocessor systems",
            "Distributed transaction coordinator instances",
            "Primary-Replica database replication setups"
          ],
          correctAnswer: "Stateless microservices architecture"
        },
        {
          question: `How would you optimize database query resolution times for ${topic} at scale?`,
          options: [
            "By implementing compound indexes and read replicas",
            "By utilizing redis in-memory key-value caching layers",
            "By denormalizing critical table structures",
            "All of the above"
          ],
          correctAnswer: "All of the above"
        },
        {
          question: `In highly concurrent environments, how does ${topic} prevent race conditions?`,
          options: [
            "By utilizing optimistic concurrency controls via version fields",
            "By implementing distributed locking mechanisms",
            "By executing updates in single-threaded queues",
            "All of the above"
          ],
          correctAnswer: "All of the above"
        },
        {
          question: `What is the performance implication of using deep recursion in ${topic}?`,
          options: [
            "It runs the risk of throwing Call Stack Size Exceeded errors",
            "It triggers automatic context switching overhead",
            "It increases CPU load by 50% continuously",
            "It has no performance implication"
          ],
          correctAnswer: "It runs the risk of throwing Call Stack Size Exceeded errors"
        },
        {
          question: `Which profiling tool is most appropriate for analyzing memory leaks in ${topic}?`,
          options: [
            "Chrome DevTools Heap Snapshot",
            "System Performance Monitor",
            "Wireshark network packet analyzer",
            "Postman load testing utility"
          ],
          correctAnswer: "Chrome DevTools Heap Snapshot"
        }
      ]
    };

    const pool = questionPools[difficulty] || questionPools.Beginner;
    // Shuffle the pool using sort
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return {
      questions: shuffled.slice(0, 5)
    };
  }
}

module.exports = { generateQuiz };

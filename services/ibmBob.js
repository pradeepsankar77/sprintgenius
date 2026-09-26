const axios = require("axios");

/**
 * Generic wrapper around the IBM Bob 2.0 API with resilient demo fallback.
 */
async function askBob(prompt, context = "") {
  const isPlaceholder =
    !process.env.IBM_BOB_API_URL ||
    process.env.IBM_BOB_API_URL.includes("your-ibm-bob-endpoint") ||
    !process.env.IBM_BOB_API_KEY ||
    process.env.IBM_BOB_API_KEY.includes("your-ibm-bob-api-key");

  if (!isPlaceholder) {
    try {
      const response = await axios.post(
        process.env.IBM_BOB_API_URL,
        { prompt, context },
        {
          headers: {
            Authorization: `Bearer ${process.env.IBM_BOB_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );
      return response.data.output || response.data.text || response.data;
    } catch (err) {
      console.warn("IBM Bob live endpoint failed, falling back to smart agent engine:", err.message);
    }
  }

  // Smart fallback simulator for hackathon demo resilience
  return generateAgentFallback(prompt, context);
}

/**
 * Intelligent local agent engine for testing and when IBM Bob credentials are placeholder
 */
function generateAgentFallback(prompt, context = "") {
  // Check what agent is requesting
  if (prompt.includes("requirement analyzer")) {
    const defaultTasks = [
      {
        title: "User Authentication & RBAC Architecture",
        description: "Implement JWT token-based auth with refresh rotation and granular role permissions.",
        dependencies: [],
      },
      {
        title: "Database Schema & Migration Pipelines",
        description: "Design and deploy MongoDB schemas, indexes, and automated data migration scripts.",
        dependencies: [],
      },
      {
        title: "Core Service Business Logic & API Layer",
        description: "Build out primary domain handlers, request validations, and RESTful service controllers.",
        dependencies: ["Database Schema & Migration Pipelines"],
      },
      {
        title: "Real-time Telemetry & Webhook Dispatcher",
        description: "Set up asynchronous event bus for state updates, webhooks, and live notifications.",
        dependencies: ["Core Service Business Logic & API Layer"],
      },
      {
        title: "Frontend Interactive Dashboard & Analytics",
        description: "Develop responsive UI views, state management, metrics charting, and real-time alerts.",
        dependencies: ["Core Service Business Logic & API Layer"],
      },
      {
        title: "Third-Party Integration & External Webhooks",
        description: "Integrate payment gateways, notifications, and enterprise external webhooks.",
        dependencies: ["Core Service Business Logic & API Layer"],
      },
      {
        title: "End-to-End Test Suite & Security Audit",
        description: "Implement automated integration test coverage, sanitize inputs, and conduct OWASP scan.",
        dependencies: ["Frontend Interactive Dashboard & Analytics", "Third-Party Integration & External Webhooks"],
      },
      {
        title: "CI/CD Pipeline & Cloud Production Deployment",
        description: "Configure automated container builds, staging validation, and zero-downtime release.",
        dependencies: ["End-to-End Test Suite & Security Audit"],
      },
    ];

    // If context has lines or bullet points, extract custom items
    if (context && context.length > 30) {
      const lines = context
        .split(/\r?\n/)
        .map((l) => l.trim().replace(/^[-*•\d.)\s]+/, ""))
        .filter((l) => l.length > 10 && !l.toLowerCase().includes("requirement"));

      if (lines.length >= 3) {
        const generated = lines.slice(0, 8).map((line, idx) => ({
          title: line.length > 60 ? line.slice(0, 57) + "..." : line,
          description: `Deliver core capability for: ${line}. Ensure fault-tolerance and modularity.`,
          dependencies: idx > 1 ? [lines[0].slice(0, 50)] : [],
        }));
        return JSON.stringify({ tasks: generated });
      }
    }

    return JSON.stringify({ tasks: defaultTasks });
  }

  if (prompt.includes("classifying software development tasks")) {
    try {
      const match = prompt.match(/Tasks:\s*(\[[\s\S]*\])/);
      if (match && match[1]) {
        const tasks = JSON.parse(match[1]);
        const classifications = tasks.map((t, idx) => {
          const priorities = ["High", "Medium", "High", "Low", "Medium", "High"];
          const efforts = ["Medium", "Small", "Large", "Small", "Medium", "Large"];
          return {
            id: t.id,
            priority: priorities[idx % priorities.length],
            effort: efforts[idx % efforts.length],
          };
        });
        return JSON.stringify({ classifications });
      }
    } catch {
      // ignore
    }
  }

  if (prompt.includes("sprint planner")) {
    try {
      const match = prompt.match(/Tasks:\s*(\[[\s\S]*\])/);
      if (match && match[1]) {
        const tasks = JSON.parse(match[1]);
        const half = Math.ceil(tasks.length / 2);
        const s1Tasks = tasks.slice(0, half).map((t) => t.id);
        const s2Tasks = tasks.slice(half).map((t) => t.id);
        return JSON.stringify({
          sprints: [
            { number: 1, taskIds: s1Tasks },
            { number: 2, taskIds: s2Tasks },
          ],
        });
      }
    } catch {
      // ignore
    }
  }

  if (prompt.includes("risk detection agent")) {
    return JSON.stringify({
      risks: [
        {
          type: "Dependency Bottleneck",
          description: "Core Service Business Logic is a prerequisite for 3 downstream modules. Any delay will cascade into Sprint 2 deliverables.",
        },
        {
          type: "High-Risk Integration",
          description: "Third-party APIs lack staging sandbox reliability specs. Recommend implementing circuit breakers and fallback mocks.",
        },
        {
          type: "Test Coverage Gap",
          description: "End-to-End security and compliance testing is scheduled late in Sprint 2, creating potential release blocker risks.",
        },
      ],
    });
  }

  if (prompt.includes("progress summary")) {
    return "The project velocity is currently tracking on schedule with initial foundation modules underway. Recommend clearing dependencies on the Core Service to unblock downstream dashboard and integration features before the end of the sprint cycle.";
  }

  return "Agent processed query successfully.";
}

/**
 * Helper for agents that need Bob to return structured JSON.
 * Asks Bob to respond in JSON only, then safely parses it.
 */
async function askBobForJSON(prompt, context = "") {
  const jsonPrompt = `${prompt}\n\nRespond with ONLY valid JSON, no explanation, no markdown code fences.`;
  const raw = await askBob(jsonPrompt, context);

  try {
    const cleaned = typeof raw === "string" ? raw.replace(/```json|```/g, "").trim() : raw;
    return typeof cleaned === "string" ? JSON.parse(cleaned) : cleaned;
  } catch (err) {
    console.error("Failed to parse Bob's response as JSON:", raw);
    throw new Error("IBM Bob did not return valid JSON");
  }
}

module.exports = { askBob, askBobForJSON };

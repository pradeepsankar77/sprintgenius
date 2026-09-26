const API_BASE = "/api";

/**
 * Universal safe fetcher with error handling and fallback
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errMessage = `HTTP error ${res.status}`;
      try {
        const data = await res.json();
        if (data.error) errMessage = data.error;
      } catch {
        // ignore
      }
      throw new Error(errMessage);
    }

    return await res.json();
  } catch (err) {
    // If proxied backend fails, try direct backend on port 5000
    if (!options._retried && !url.startsWith("http://localhost:5000")) {
      try {
        const directUrl = `http://localhost:5000${endpoint}`;
        const directRes = await fetch(directUrl, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
          _retried: true,
        });
        if (directRes.ok) return await directRes.json();
      } catch {
        // fallback to throwing original error
      }
    }
    throw err;
  }
}

// ----------------------------------------------------
// Project Endpoints
// ----------------------------------------------------
export async function getProjects() {
  return await request("/projects");
}

export async function getProject(id) {
  return await request(`/projects/${id}`);
}

export async function createProject({ name, rawText }) {
  return await request("/projects", {
    method: "POST",
    body: JSON.stringify({ name, rawText }),
  });
}

export async function uploadDocument(file, projectName) {
  const formData = new FormData();
  formData.append("file", file);
  if (projectName) formData.append("projectName", projectName);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      // Try direct localhost:5000
      const directRes = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      if (directRes.ok) return await directRes.json();
      throw new Error("Failed to upload document");
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function deleteProject(id) {
  return await request(`/projects/${id}`, {
    method: "DELETE",
  });
}

export async function getProjectTasks(projectId) {
  return await request(`/projects/${projectId}/tasks`);
}

export async function getProjectSprints(projectId) {
  return await request(`/projects/${projectId}/sprints`);
}

// ----------------------------------------------------
// Task Endpoints
// ----------------------------------------------------
export async function updateTask(taskId, updates) {
  return await request(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function createTask(taskData) {
  return await request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function deleteTask(taskId) {
  return await request(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

// ----------------------------------------------------
// Agent Endpoints
// ----------------------------------------------------
export async function runAgent1_AnalyzeRequirements(projectId) {
  return await request("/agents/analyze-requirements", {
    method: "POST",
    body: JSON.stringify({ projectId }),
  });
}

export async function runAgents23_ClassifyTasks(projectId) {
  return await request("/agents/classify-tasks", {
    method: "POST",
    body: JSON.stringify({ projectId }),
  });
}

export async function runAgent4_PlanSprints(projectId) {
  return await request("/agents/plan-sprints", {
    method: "POST",
    body: JSON.stringify({ projectId }),
  });
}

export async function runAgent5_DetectRisks(projectId) {
  return await request("/agents/detect-risks", {
    method: "POST",
    body: JSON.stringify({ projectId }),
  });
}

export async function runAgent6_GetProgress(projectId) {
  return await request(`/agents/progress/${projectId}`);
}

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/`, { method: "GET" });
    if (res.ok) return { status: "online" };
  } catch {
    try {
      const res2 = await fetch("http://localhost:5000/", { method: "GET" });
      if (res2.ok) return { status: "online" };
    } catch {
      // offline
    }
  }
  return { status: "offline" };
}


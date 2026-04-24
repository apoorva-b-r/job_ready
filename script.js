window.nextStep = function() {};
window.prevStep = function() {};
window.submitForm = function() {};

function defaultUserData() {
  return {
    resume: {},
    analysis: {},
    solved: {
      dsa: [],
      hr: [],
      aptitude: []
    }
  };
}

window.getUserData = function() {
  const raw = localStorage.getItem("userData");

  if (!raw) {
    return defaultUserData();
  }

  try {
    const parsed = JSON.parse(raw);
    const base = defaultUserData();

    return {
      resume: parsed.resume || base.resume,
      analysis: parsed.analysis || base.analysis,
      solved: {
        dsa: Array.isArray(parsed?.solved?.dsa) ? parsed.solved.dsa : [],
        hr: Array.isArray(parsed?.solved?.hr) ? parsed.solved.hr : [],
        aptitude: Array.isArray(parsed?.solved?.aptitude) ? parsed.solved.aptitude : []
      }
    };
  } catch {
    return defaultUserData();
  }
};

window.setUserData = function(data) {
  localStorage.setItem("userData", JSON.stringify(data));
};

function isQuestionSolved(topic, questionId) {
  const userData = window.getUserData();
  const solvedList = Array.isArray(userData?.solved?.[topic]) ? userData.solved[topic] : [];
  return solvedList.includes(questionId);
}

function markQuestionSolved(topic, questionId) {
  const userData = window.getUserData();

  if (!Array.isArray(userData.solved[topic])) {
    userData.solved[topic] = [];
  }

  if (!userData.solved[topic].includes(questionId)) {
    userData.solved[topic].push(questionId);
    window.setUserData(userData);
  }
}

window.setUserData(window.getUserData());

document.addEventListener("DOMContentLoaded", () => {

  // ================= PARAMS =================
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  const id = parseInt(params.get("id"));
  const isResumePage = Boolean(document.getElementById("firstName"));

  // ================= DATA =================
  const questionData = {

    dsa: [
      {
        id:1,
        type:"code",
        title:"Two Sum",
        difficulty: "Easy",
        tags: ["Array", "HashMap"],
        hint: "Use a hash map to store visited numbers.",
        desc:"Find indices of two numbers that add to target.",
        example:"[2,7,11,15], target=9 → [0,1]",
        constraints:["2 ≤ n ≤ 10⁴"],
        starterCode:"return [];",
        testCases:[
          {nums:[2,7,11,15],target:9,expected:"[0,1]"}
        ]
      },
{
  id:2,
  type:"code",
  title:"Valid Parentheses",
  difficulty:"Easy",
  tags:["Stack"],
  hint:"Use a stack",
  desc:"Check if parentheses are valid.",
  example:"()[]{} → true",
  constraints:[],
  starterCode:"return true;",
  testCases:[
    {input:"()", expected:"true"},
    {input:"(]", expected:"false"}
  ]
},
{
  id:3,
  type:"code",
  title:"Longest Substring Without Repeating Characters",
  difficulty:"Medium",
  tags:["Sliding Window"],
  hint:"Use sliding window",
  desc:"Find longest substring without repeating chars",
  example:"abcabcbb → 3",
  constraints:[],
  starterCode:"return 0;",
  testCases:[
    {input:"abcabcbb", expected:"3"}
  ]
}
    ],

    hr: [
      {
        id:1,
        type:"text",
        title:"Tell me about yourself",
        desc:"Explain your background briefly.",
        example:"Talk about education, skills, goals",
        constraints:[]
      },
      {
        id:2,
        type:"text",
        title:"Why should we hire you?",
        desc:"Explain why you are a good fit.",
        example:"Mention strengths, skills",
        constraints:[]
      }
    ],

    aptitude: [
      {
        id:1,
        type:"mcq",
        title:"Simple Math",
        desc:"What is 2 + 2?",
        options:["2","3","4","5"],
        answer:"4",
        explanation:"2 + 2 = 4",
        constraints:[]
      },
{
    id:2,
  type:"mcq",
  title:"Percentage",
  desc:"What is 20% of 150?",
  options:["25","30","35","40"],
  answer:"30",
  explanation:"20% of 150 = 30"
}
    ]
  };

  // ================= LIST PAGE =================
  if (document.getElementById("question-list")) {
    if (!questionData[topic]) return;

    document.getElementById("topic-title").innerText = topic.toUpperCase();
    const container = document.getElementById("question-list");

questionData[topic].forEach(q => {

  const solved = isQuestionSolved(topic, q.id);
  const star = solved ? " ⭐" : "";

  const card = document.createElement("a");
  card.className = "question-card";
  card.href = `question.html?topic=${topic}&id=${q.id}`;

  if (solved) {
    card.classList.add("solved");
  }

  card.innerHTML = `
    <div class="question-title">${q.title}${star}</div>
    <div class="question-meta">
      ${q.difficulty || ""} 
      ${q.tags ? "• " + q.tags.join(", ") : ""}
    </div>
  `;

  container.appendChild(card);
});
  }

  // ================= QUESTION PAGE =================
  if (document.getElementById("right-panel")) {

    if (!questionData[topic]) {
      document.body.innerHTML = "<h2>Invalid topic</h2>";
      return;
    }

    const question = questionData[topic].find(q => q.id === id);

    if (!question) {
      document.body.innerHTML = "<h2>Question not found</h2>";
      return;
    }

    const output = document.getElementById("output");

    // TITLE
    document.getElementById("q-title").innerText =
      `${question.title} (${question.difficulty || ""})`;

    // DESC + TAGS
document.getElementById("q-desc").innerText = question.desc;

if (question.tags) {
  const tagDiv = document.createElement("p");
  tagDiv.innerHTML = `<strong>Tags:</strong> ${question.tags.join(", ")}`;
  document.getElementById("q-desc").appendChild(tagDiv);
}

    // EXAMPLE
    if (question.example) {
      document.getElementById("q-example").innerText = question.example;
    } else {
      document.getElementById("q-example").parentElement.style.display = "none";
    }

    // CONSTRAINTS
    const ul = document.getElementById("q-constraints");
    if (question.constraints?.length) {
      question.constraints.forEach(c => {
        const li = document.createElement("li");
        li.innerText = c;
        ul.appendChild(li);
      });
    } else {
      ul.parentElement.style.display = "none";
    }

    // TEST CASES
if (question.type === "code") {
  const testDiv = document.createElement("div");

  testDiv.innerHTML = `
    <h4>Test Cases</h4>
    ${question.testCases.map((tc, i) => `
      <p><strong>Case ${i+1}:</strong>
        ${tc.nums !== undefined 
          ? `nums=${JSON.stringify(tc.nums)}, target=${tc.target}` 
          : `input=${tc.input}`
        }
      </p>
    `).join("")}
  `;

  document.querySelector(".left").appendChild(testDiv);
}

    // RIGHT PANEL
    const right = document.getElementById("right-panel");

    if (question.type === "code") {
      right.innerHTML = `
        <textarea id="code">${question.starterCode}</textarea>
        <button onclick="submitCode()">Submit</button>
        <button onclick="showHint()">Hint</button>
      `;
    }

    else if (question.type === "text") {
      right.innerHTML = `
        <textarea id="hrAnswer"></textarea>
        <button onclick="submitHR()">Submit</button>
      `;
    }

else if (question.type === "mcq") {
  right.innerHTML = `
    <p style="margin-bottom:10px;"><strong>${question.desc}</strong></p>

    ${question.options.map(opt =>
      `<label>
        <input type="radio" name="mcq" value="${opt}"> ${opt}
      </label><br>`
    ).join("")}

    <button onclick="submitMCQ()">Submit</button>
  `;
}

    // ================= FUNCTIONS =================

    function updateProgress() {
      const total = questionData[topic].length;
      const userData = window.getUserData();
      const solvedList = Array.isArray(userData?.solved?.[topic]) ? userData.solved[topic] : [];
      const solved = questionData[topic].filter(q => solvedList.includes(q.id)).length;

      const percent = Math.round((solved / total) * 100);

      document.getElementById("progress-fill").style.width = percent + "%";
      document.getElementById("progress-text").innerText =
        `${solved}/${total} Completed (${percent}%)`;
    }

    updateProgress();

window.submitCode = function () {
  const code = document.getElementById("code").value;
  if (!code.trim()) {
    output.innerText = "Write some code first ❌";
    return;
  }
  try {
    let passed = 0;
    let resultText = "";

    question.testCases.forEach((tc, i) => {
      let res;

      try {
        // 🔥 SIMPLE handling
        if (tc.nums !== undefined) {
          const func = new Function("nums","target",code);
          res = JSON.stringify(func(tc.nums, tc.target));
        } else {
          const func = new Function("input",code);
          res = JSON.stringify(func(tc.input));
        }

      } catch (err) {
        resultText += `Test Case ${i+1}: Error ❌ (${err.message})\n`;
        return;
      }

      if (res === tc.expected) {
        passed++;
        resultText += `Test Case ${i+1}: Passed ✅\n`;
      } else {
        resultText += `Test Case ${i+1}: Failed ❌ (Expected ${tc.expected}, Got ${res})\n`;
      }
    });

    if (passed === question.testCases.length) {
      resultText += "\n🎉 Great job! All test cases passed.";
      markQuestionSolved(topic, id);
    } else {
      resultText += "\n⚠️ Some test cases failed.";
    }

    output.innerText = resultText;
    updateProgress();

  } catch (e) {
    output.innerText = e.message;
  }
}

window.submitHR = function () {
  const ans = document.getElementById("hrAnswer").value.trim();

  if (!ans) {
    output.innerText = "Please write your answer first ❌";
    return;
  }

  if (ans.length < 20) {
    output.innerText = "Answer too short ⚠️ (Try to elaborate)";
    return;
  }

  output.innerText = "Answer submitted ✅";
  markQuestionSolved(topic, id);
  updateProgress();
}

    window.submitMCQ = function () {
      const selected = document.querySelector("input[name='mcq']:checked");

      if (!selected) {
        output.innerText = "Select an option";
        return;
      }

      if (selected.value === question.answer) {
        output.innerText = `
Correct ✅

Explanation:
${question.explanation || "No explanation available"}
`;
  markQuestionSolved(topic, id);
      } else {
        output.innerText = `
Wrong ❌

Correct Answer: ${question.answer}
`;
      }

      updateProgress();
    }

    window.showHint = function () {
      output.innerText = question.hint || "No hint available";
    }

    window.nextQuestion = function () {
      const nextId = id + 1;

      if (questionData[topic].some(q => q.id === nextId)) {
        window.location.href = `question.html?topic=${topic}&id=${nextId}`;
      } else {
        alert("No more questions 🎉");
      }
    }
  }


let currentStep = 1;

let formData = {
  basic: {},
  education: {},
  skills: [],
  experience: [],
  projects: []
};

window.showStep = function(step) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById(`step-${step}`)?.classList.add("active");
  document.getElementById("result")?.classList.remove("active");
}

window.nextStep = function() {
  window.saveData();
  currentStep++;
  showStep(currentStep);
}

window.prevStep = function() {
  currentStep--;
  showStep(currentStep);
}

window.saveData = function() {
  if (currentStep === 1) {
formData.basic = {
  firstName: document.getElementById("firstName").value,
  lastName: document.getElementById("lastName").value,
  email: document.getElementById("email").value,
  phone: document.getElementById("phone").value,
  dob: document.getElementById("dob").value,
  gender: document.getElementById("gender").value,
  location: document.getElementById("location").value,
  linkedin: document.getElementById("linkedin").value
};
  }

  if (currentStep === 2) {
    formData.education = {
      degreeType: document.getElementById("degreeType")?.value || "",
      degree: document.getElementById("degreeName").value,
      college: document.getElementById("college").value,
      startYear: document.getElementById("startYear")?.value || "",
      endYear: document.getElementById("endYear")?.value || "",
      cgpa: document.getElementById("cgpa").value,
      school12: document.getElementById("school12")?.value || "",
      percent12: document.getElementById("percent12")?.value || "",
      year12: document.getElementById("year12")?.value || "",
      school10: document.getElementById("school10")?.value || "",
      percent10: document.getElementById("percent10")?.value || "",
      year10: document.getElementById("year10")?.value || ""
    };
  }

  if (currentStep === 3) {
    formData.skills = selectedSkills;
  }

  if (currentStep === 4) {
  formData.experience = experiences;
  formData.projects = projects;
}

  const userData = window.getUserData();
  userData.resume = {
    basic: formData.basic || {},
    education: formData.education || {},
    skills: [...(formData.skills || [])],
    experience: [...(formData.experience || [])],
    projects: [...(formData.projects || [])]
  };
  window.setUserData(userData);
}

window.submitForm = function() {
  saveData();

  const skills = formData.skills.map(s => s.toLowerCase());

  const roleMap = {
    frontend: ["javascript", "react", "html", "css"],
    backend: ["node.js", "java", "sql"],
    data: ["python", "machine learning", "sql"]
  };

  let roleScores = {
    frontend: 0,
    backend: 0,
    data: 0
  };

  // 🔷 Skill-based scoring
  for (let role in roleMap) {
    roleMap[role].forEach(skill => {
      if (skills.includes(skill)) {
        roleScores[role]++;
      }
    });
  }

  // 🔥 NEW: Experience-based boost
  formData.experience.forEach(exp => {
    const text = (exp.jobTitle + " " + exp.workDesc).toLowerCase();

    if (text.includes("react") || text.includes("frontend")) {
      roleScores.frontend += 2;
    }

    if (text.includes("backend") || text.includes("api")) {
      roleScores.backend += 2;
    }

    if (text.includes("data") || text.includes("analysis")) {
      roleScores.data += 2;
    }
  });

  // Convert to percentage
  let rolePercent = {};
  for (let role in roleMap) {
    rolePercent[role] = Math.min(
      100,
      Math.round((roleScores[role] / roleMap[role].length) * 100)
    );
  }

  // Best role
  let bestRole = Object.keys(rolePercent).reduce((a, b) =>
    rolePercent[a] > rolePercent[b] ? a : b
  );

  // Strengths
  let strengths = [];
  if (formData.projects.length > 0) strengths.push("Strong project experience");
  if (formData.experience.length > 0) strengths.push("Professional experience present");
  if (skills.length >= 3) strengths.push("Good skill diversity");

  // Weaknesses
  let weaknesses = [];
  if (formData.projects.length === 0) weaknesses.push("No projects added");
  if (formData.experience.length === 0) weaknesses.push("No work experience");
  if (skills.length < 2) weaknesses.push("Limited technical skills");

  // Recommendations
  let recommendations = [];
  if (bestRole === "frontend") {
    if (!skills.includes("react")) recommendations.push("Learn React");
    if (!skills.includes("css")) recommendations.push("Improve CSS");
  }
  if (bestRole === "backend") {
    if (!skills.includes("node.js")) recommendations.push("Learn Node.js");
  }
  if (bestRole === "data") {
    if (!skills.includes("machine learning")) recommendations.push("Explore ML basics");
  }

  // 🔥 Improved scoring
  let score = 0;
  score += skills.length * 10;

  if (formData.projects.length >= 2) {
    score += 25;
  } else {
    score += formData.projects.length * 10;
  }

  score += formData.experience.length * 15;

  if (formData.education.cgpa > 8) score += 20;
  if (score > 100) score = 100;

  // 🔥 Readiness status
  let readiness =
    score > 80 ? "Job Ready 🚀" :
    score > 50 ? "Almost There ⚡" :
    "Needs Improvement 📈";

  // 🔥 Explanation text
  let explanation = `
    Based on your skills (${skills.join(", ")}) and experience,
    you are best suited for ${bestRole.toUpperCase()} roles.
  `;

  // Render UI
  const reportHtml = `
    <div class="report">

      <h2>👤 ${formData.basic.firstName} ${formData.basic.lastName}</h2>

      <p>${explanation}</p>
      <p><strong>Status:</strong> ${readiness}</p>

      <div class="score-box">
        <h3>${score}/100</h3>
        <p>Overall Resume Score</p>
      </div>

      <h3>🎯 Role Fit Analysis</h3>

      ${renderBar("Frontend", rolePercent.frontend)}
      ${renderBar("Backend", rolePercent.backend)}
      ${renderBar("Data", rolePercent.data)}

      <p class="best-role">Best Fit: <strong>${bestRole.toUpperCase()}</strong></p>

      <hr>

      <h3>✅ Strengths</h3>
      <ul>${strengths.map(s => `<li>${s}</li>`).join("")}</ul>

      <h3>⚠️ Areas to Improve</h3>
      <ul>${weaknesses.map(w => `<li>${w}</li>`).join("")}</ul>

      <h3>📌 Recommendations</h3>
      <ul>${recommendations.map(r => `<li>${r}</li>`).join("")}</ul>

    </div>
  `;

  document.getElementById("output").innerHTML = reportHtml;

  const userData = window.getUserData();
  userData.analysis = {
    score,
    readiness,
    bestRole,
    rolePercent,
    strengths,
    weaknesses,
    recommendations,
    explanation: explanation.trim(),
    reportHtml,
    updatedAt: new Date().toISOString()
  };
  window.setUserData(userData);

  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("result").classList.add("active");
}

window.renderBar = function(label, value) {
  return `
    <div class="bar-container">
      <span>${label}</span>
      <div class="bar">
        <div class="fill" style="width:${value}%"></div>
      </div>
      <span>${value}%</span>
    </div>
  `;
}

const predefinedSkills = [
  "JavaScript","Python","Java","C++","React","Node.js",
  "SQL","Machine Learning","HTML","CSS","MongoDB"
];

let selectedSkills = [];

function loadResumeData() {
  if (!isResumePage) return;

  const userData = window.getUserData();
  const resume = userData.resume || {};
  const basic = resume.basic || {};
  const education = resume.education || {};

  formData = {
    basic,
    education,
    skills: Array.isArray(resume.skills) ? [...resume.skills] : [],
    experience: Array.isArray(resume.experience) ? [...resume.experience] : [],
    projects: Array.isArray(resume.projects) ? [...resume.projects] : []
  };

  selectedSkills = [...formData.skills];
  experiences = [...formData.experience];
  projects = [...formData.projects];

  const setValue = (idName, value) => {
    const el = document.getElementById(idName);
    if (el) el.value = value || "";
  };

  setValue("firstName", basic.firstName);
  setValue("lastName", basic.lastName);
  setValue("email", basic.email);
  setValue("phone", basic.phone);
  setValue("dob", basic.dob);
  setValue("gender", basic.gender);
  setValue("location", basic.location);
  setValue("linkedin", basic.linkedin);

  setValue("degreeType", education.degreeType);
  setValue("degreeName", education.degree);
  setValue("college", education.college);
  setValue("startYear", education.startYear);
  setValue("endYear", education.endYear);
  setValue("cgpa", education.cgpa);
  setValue("school12", education.school12);
  setValue("percent12", education.percent12);
  setValue("year12", education.year12);
  setValue("school10", education.school10);
  setValue("percent10", education.percent10);
  setValue("year10", education.year10);

  renderSkills();
  renderExperience();
  renderProjects();

  const output = document.getElementById("output");
  if (output && userData.analysis?.reportHtml) {
    output.innerHTML = userData.analysis.reportHtml;
  }
}

window.showSuggestions = function() {
  const input = document.getElementById("skillInput").value.toLowerCase();
  const suggestionsDiv = document.getElementById("suggestions");

  suggestionsDiv.innerHTML = "";

  if (!input) return;

  const filtered = predefinedSkills.filter(skill =>
    skill.toLowerCase().includes(input) &&
    !selectedSkills.includes(skill)
  );

  filtered.forEach(skill => {
    const div = document.createElement("div");
    div.innerText = skill;
    div.onclick = () => addSkill(skill);
    suggestionsDiv.appendChild(div);
  });
}

window.addSkill = function(skill) {
  if (selectedSkills.length >= 5) return;

  selectedSkills.push(skill);
  document.getElementById("skillInput").value = "";
  document.getElementById("suggestions").innerHTML = "";

  renderSkills();
}

window.renderSkills = function() {
  const container = document.getElementById("selectedSkills");
  container.innerHTML = "";

  selectedSkills.forEach(skill => {
    const tag = document.createElement("div");
    tag.className = "skill-tag";
    tag.innerHTML = `${skill} <span onclick="removeSkill('${skill}')">✖</span>`;
    container.appendChild(tag);
  });
}

window.removeSkill = function(skill) {
  selectedSkills = selectedSkills.filter(s => s !== skill);
  renderSkills();
}

let experiences = [];
let projects = [];

// EXPERIENCE
window.addExperience = function() {
  const jobTitle = document.getElementById("jobTitle").value;
  const company = document.getElementById("company").value;
  const duration = document.getElementById("duration").value;
  const workDesc = document.getElementById("workDesc").value;

  if (!jobTitle || !company) return;

  const exp = { jobTitle, company, duration, workDesc };
  experiences.push(exp);

  renderExperience();

  // clear inputs
  document.getElementById("jobTitle").value = "";
  document.getElementById("company").value = "";
  document.getElementById("duration").value = "";
  document.getElementById("workDesc").value = "";
}

window.renderExperience = function() {
  const container = document.getElementById("experienceList");
  container.innerHTML = "";

  experiences.forEach((exp, index) => {
    const div = document.createElement("div");
    div.className = "card-item";

    div.innerHTML = `
      <strong>${exp.jobTitle}</strong> @ ${exp.company}<br>
      ${exp.duration}<br>
      ${exp.workDesc}
      <span onclick="removeExperience(${index})">✖</span>
    `;

    container.appendChild(div);
  });
}

window.removeExperience = function(index) {
  experiences.splice(index, 1);
  renderExperience();
}


// PROJECTS
window.addProject = function() {
  const title = document.getElementById("projectTitle").value;
  const desc = document.getElementById("projectDesc").value;

  if (!title) return;

  const proj = { title, desc };
  projects.push(proj);

  renderProjects();

  document.getElementById("projectTitle").value = "";
  document.getElementById("projectDesc").value = "";
}

window.renderProjects = function() {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  projects.forEach((proj, index) => {
    const div = document.createElement("div");
    div.className = "card-item";

    div.innerHTML = `
      <strong>${proj.title}</strong><br>
      ${proj.desc}
      <span onclick="removeProject(${index})">✖</span>
    `;

    container.appendChild(div);
  });
}

window.removeProject = function(index) {
  projects.splice(index, 1);
  renderProjects();
}

loadResumeData();

});

// ================= PROFILE PAGE =================
document.addEventListener("DOMContentLoaded", () => {

  // Only run on profile page
  if (!document.getElementById("user-name")) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userData = window.getUserData();

  console.log("Profile Load:", user, userData);

  // 🔒 Safety checks
  if (!user) {
    document.body.innerHTML = "<h2>Please login first</h2>";
    return;
  }

  // 👤 USER INFO
  document.getElementById("user-name").innerText =
    user.name || "User";

  document.getElementById("user-email").innerText =
    user.email || "";

  // 📊 RESUME ANALYSIS
  document.getElementById("score").innerText =
    userData.analysis?.score ?? "N/A";

  document.getElementById("role").innerText =
    userData.analysis?.bestRole ?? "N/A";

  // 📈 STRENGTHS
  const strengthsList = document.getElementById("strengths");
  strengthsList.innerHTML = "";

  if (userData.analysis?.strengths?.length) {
    userData.analysis.strengths.forEach(s => {
      const li = document.createElement("li");
      li.innerText = s;
      strengthsList.appendChild(li);
    });
  } else {
    strengthsList.innerHTML = "<li>No data yet</li>";
  }

  // ⚠️ WEAKNESSES
  const weakList = document.getElementById("weaknesses");
  weakList.innerHTML = "";

  if (userData.analysis?.weaknesses?.length) {
    userData.analysis.weaknesses.forEach(w => {
      const li = document.createElement("li");
      li.innerText = w;
      weakList.appendChild(li);
    });
  } else {
    weakList.innerHTML = "<li>No data yet</li>";
  }

  // ✅ PROGRESS COUNTS
  const dsaCount = userData.solved?.dsa?.length ?? 0;
  const hrCount = userData.solved?.hr?.length ?? 0;
  const aptCount = userData.solved?.aptitude?.length ?? 0;

  document.getElementById("dsa-count").innerText = dsaCount;
  document.getElementById("hr-count").innerText = hrCount;
  document.getElementById("apt-count").innerText = aptCount;

  // 📊 TOTAL PROGRESS (optional but nice)
  const totalSolved = dsaCount + hrCount + aptCount;
  const totalEl = document.getElementById("total-solved");

  if (totalEl) {
    totalEl.innerText = totalSolved;
  }

  // 🎯 BONUS: show last analysis report (if exists)
  const reportContainer = document.getElementById("analysis-report");

  if (reportContainer && userData.analysis?.reportHtml) {
    reportContainer.innerHTML = userData.analysis.reportHtml;
  }

});
const data = {
  dsa: [
    { id: 1, title: "Two Sum", desc: "Find two numbers...", solution: "Use hashmap" },
    { id: 2, title: "Kadane", desc: "Max subarray", solution: "DP approach" }
  ],
  hr: [
    { id: 1, title: "Tell me about yourself", desc: "Intro question", solution: "Structured answer" }
  ]
};

const params = new URLSearchParams(window.location.search);
const topic = params.get("topic");
const id = params.get("id");

if (document.getElementById("topic-title")) {
  document.getElementById("topic-title").innerText = topic.toUpperCase();
  const list = document.getElementById("question-list");

  data[topic].forEach(q => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="question.html?topic=${topic}&id=${q.id}">${q.title}</a>`;
    list.appendChild(li);
  });
}

if (document.getElementById("q-title")) {
  const q = data[topic].find(q => q.id == id);
  document.getElementById("q-title").innerText = q.title;
  document.getElementById("q-desc").innerText = q.desc;
  document.getElementById("solution").innerText = q.solution;
}

function toggleSolution() {
  const sol = document.getElementById("solution");
  sol.style.display = sol.style.display === "none" ? "block" : "none";
}

function markSolved() {
  localStorage.setItem(`solved-${topic}-${id}`, true);
  alert("Marked as solved!");
}

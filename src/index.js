// Expert Path - Self-contained Cloudflare Worker
// Serves full UI + API

const experts = [
  {
    id: "kelsey-hightower",
    name: "Kelsey Hightower",
    topics: ["Kubernetes", "Cloud Native", "DevOps"],
    bio: "Former Distinguished Engineer at Google Cloud. Kubernetes pioneer and community leader.",
    linkedin: "https://www.linkedin.com/in/kelseyhightower/",
    x: "https://x.com/kelseyhightower",
    github: "https://github.com/kelseyhightower",
    why_follow: "Practical, no-nonsense Kubernetes and cloud-native advice from one of the original advocates."
  },
  {
    id: "corey-quinn",
    name: "Corey Quinn",
    topics: ["AWS", "FinOps", "Cloud Economics"],
    bio: "Cloud economist, host of Screaming in the Cloud podcast. Sharp takes on AWS costs and practices.",
    linkedin: "https://www.linkedin.com/in/coreyquinn/",
    x: "https://x.com/QuinnyPig",
    blog: "https://www.lastweekinaws.com/",
    why_follow: "Best source for honest AWS cost optimization and cloud vendor criticism."
  },
  {
    id: "charity-majors",
    name: "Charity Majors",
    topics: ["Observability", "SRE", "Platform Engineering"],
    bio: "Co-founder and CTO of Honeycomb. Leading voice on observability and engineering leadership.",
    linkedin: "https://www.linkedin.com/in/charitymajors/",
    x: "https://x.com/mipsytipsy",
    blog: "https://charity.wtf/",
    why_follow: "Deep insights on observability, incident response, and building reliable systems."
  },
  {
    id: "brendan-burns",
    name: "Brendan Burns",
    topics: ["Kubernetes", "Containers", "Azure"],
    bio: "Co-founder of Kubernetes, Corporate VP at Microsoft Azure.",
    linkedin: "https://www.linkedin.com/in/brendanburns/",
    x: "https://x.com/brendandburns",
    github: "https://github.com/brendandburns",
    why_follow: "Original Kubernetes architect with strong views on container platforms."
  },
  {
    id: "liz-rice",
    name: "Liz Rice",
    topics: ["Kubernetes", "eBPF", "Security", "Platform Engineering"],
    bio: "Chief Open Source Officer at Isovalent (Cilium). Expert in container security and eBPF.",
    linkedin: "https://www.linkedin.com/in/lizrice/",
    x: "https://x.com/lizrice",
    github: "https://github.com/lizrice",
    why_follow: "Clear explanations of Kubernetes security, eBPF, and cloud-native networking."
  },
  {
    id: "adrian-cockcroft",
    name: "Adrian Cockcroft",
    topics: ["Cloud Architecture", "AWS", "Observability"],
    bio: "Former VP of AWS and Netflix cloud architect. Advisor on cloud architecture.",
    linkedin: "https://www.linkedin.com/in/adriancockcroft/",
    x: "https://x.com/adrianco",
    why_follow: "Long-term perspective on cloud architecture from Netflix scale to AWS."
  },
  {
    id: "emily-freeman",
    name: "Emily Freeman",
    topics: ["DevOps", "Cloud", "Engineering Leadership"],
    bio: "Author of DevOps for Dummies. Former AWS and Microsoft community lead.",
    linkedin: "https://www.linkedin.com/in/emilyfreeman/",
    why_follow: "Practical DevOps culture and cloud adoption guidance."
  },
  {
    id: "viktor-farcic",
    name: "Viktor Farcic",
    topics: ["Kubernetes", "DevOps", "CI/CD", "GitOps"],
    bio: "Developer Advocate and author. Known for DevOps Toolkit YouTube channel.",
    youtube: "https://www.youtube.com/@DevOpsToolkit",
    linkedin: "https://www.linkedin.com/in/vfarcic/",
    why_follow: "High-quality hands-on tutorials on Kubernetes, GitOps, and modern DevOps tools."
  }
];

function getTopics() {
  const set = new Set();
  experts.forEach(e => e.topics.forEach(t => set.add(t)));
  return Array.from(set).sort();
}

function filterExperts(query = "", topic = "") {
  const q = query.toLowerCase();
  const t = topic.toLowerCase();
  return experts.filter(e => {
    const matchQuery = !q || 
      e.name.toLowerCase().includes(q) ||
      e.bio.toLowerCase().includes(q) ||
      (e.why_follow && e.why_follow.toLowerCase().includes(q));
    const matchTopic = !t || e.topics.some(tp => tp.toLowerCase().includes(t));
    return matchQuery && matchTopic;
  });
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Expert Path</title>
<style>
:root { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
body { margin: 0; background: #f8f9fa; color: #1a1a1a; }
.container { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
header { text-align: center; margin-bottom: 2rem; }
header h1 { margin: 0 0 0.5rem; font-size: 2.2rem; }
header p { color: #555; margin: 0; }
.controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
input, select { padding: 0.6rem 0.8rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
input { flex: 1; min-width: 200px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
.card { background: white; border: 1px solid #e5e5e5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.card h3 { margin: 0 0 0.4rem; }
.topics { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.6rem 0; }
.topic { background: #e8f0fe; color: #1a56db; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
.bio { color: #444; font-size: 0.95rem; margin: 0.5rem 0; }
.why { background: #f0f9ff; border-left: 3px solid #3b82f6; padding: 0.6rem 0.8rem; font-size: 0.9rem; margin: 0.75rem 0; }
.links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }
.links a { color: #2563eb; text-decoration: none; font-size: 0.85rem; padding: 0.25rem 0.5rem; border: 1px solid #dbeafe; border-radius: 4px; }
.links a:hover { background: #eff6ff; }
.empty { text-align: center; color: #666; padding: 2rem; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>Expert Path</h1>
    <p>Discover practitioners worth following on Kubernetes, AWS, SRE, Observability, and more.</p>
  </header>
  <div class="controls">
    <input type="text" id="search" placeholder="Search by name, bio, or topic...">
    <select id="topic">
      <option value="">All topics</option>
    </select>
  </div>
  <div id="results" class="grid"></div>
</div>
<script>
const experts = ${JSON.stringify(experts)};
const topics = ${JSON.stringify(getTopics())};

const searchEl = document.getElementById('search');
const topicEl = document.getElementById('topic');
const resultsEl = document.getElementById('results');

topics.forEach(t => {
  const opt = document.createElement('option');
  opt.value = t;
  opt.textContent = t;
  topicEl.appendChild(opt);
});

function render() {
  const q = searchEl.value.toLowerCase();
  const t = topicEl.value.toLowerCase();
  const filtered = experts.filter(e => {
    const matchQuery = !q || e.name.toLowerCase().includes(q) || e.bio.toLowerCase().includes(q) || (e.why_follow && e.why_follow.toLowerCase().includes(q));
    const matchTopic = !t || e.topics.some(tp => tp.toLowerCase().includes(t));
    return matchQuery && matchTopic;
  });

  if (filtered.length === 0) {
    resultsEl.innerHTML = '<div class="empty">No experts found. Try a different search.</div>';
    return;
  }

  resultsEl.innerHTML = filtered.map(e => \`
    <div class="card">
      <h3>\${e.name}</h3>
      <div class="topics">\${e.topics.map(tp => \`<span class="topic">\${tp}</span>\`).join('')}</div>
      <p class="bio">\${e.bio}</p>
      <div class="why"><strong>Why follow:</strong> \${e.why_follow || ''}</div>
      <div class="links">
        \${e.linkedin ? \`<a href="\${e.linkedin}" target="_blank" rel="noopener">LinkedIn</a>\` : ''}
        \${e.youtube ? \`<a href="\${e.youtube}" target="_blank" rel="noopener">YouTube</a>\` : ''}
        \${e.x ? \`<a href="\${e.x}" target="_blank" rel="noopener">X</a>\` : ''}
        \${e.github ? \`<a href="\${e.github}" target="_blank" rel="noopener">GitHub</a>\` : ''}
        \${e.blog ? \`<a href="\${e.blog}" target="_blank" rel="noopener">Blog</a>\` : ''}
      </div>
    </div>
  \`).join('');
}

searchEl.addEventListener('input', render);
topicEl.addEventListener('change', render);
render();
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/experts") {
      const query = url.searchParams.get("q") || "";
      const topic = url.searchParams.get("topic") || "";
      const result = filterExperts(query, topic);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (url.pathname === "/api/topics") {
      return new Response(JSON.stringify(getTopics()), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
};

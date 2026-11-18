// Expert Path Worker - simple version without nested templates
const experts = [
  {id:"kelsey-hightower",name:"Kelsey Hightower",topics:["Kubernetes","Cloud Native","DevOps"],bio:"Former Distinguished Engineer at Google Cloud. Kubernetes pioneer and community leader.",linkedin:"https://www.linkedin.com/in/kelseyhightower/",x:"https://x.com/kelseyhightower",github:"https://github.com/kelseyhightower",why_follow:"Practical, no-nonsense Kubernetes and cloud-native advice from one of the original advocates."},
  {id:"corey-quinn",name:"Corey Quinn",topics:["AWS","FinOps","Cloud Economics"],bio:"Cloud economist, host of Screaming in the Cloud podcast. Sharp takes on AWS costs and practices.",linkedin:"https://www.linkedin.com/in/coreyquinn/",x:"https://x.com/QuinnyPig",blog:"https://www.lastweekinaws.com/",why_follow:"Best source for honest AWS cost optimization and cloud vendor criticism."},
  {id:"charity-majors",name:"Charity Majors",topics:["Observability","SRE","Platform Engineering"],bio:"Co-founder and CTO of Honeycomb. Leading voice on observability and engineering leadership.",linkedin:"https://www.linkedin.com/in/charitymajors/",x:"https://x.com/mipsytipsy",blog:"https://charity.wtf/",why_follow:"Deep insights on observability, incident response, and building reliable systems."},
  {id:"brendan-burns",name:"Brendan Burns",topics:["Kubernetes","Containers","Azure"],bio:"Co-founder of Kubernetes, Corporate VP at Microsoft Azure.",linkedin:"https://www.linkedin.com/in/brendanburns/",x:"https://x.com/brendandburns",github:"https://github.com/brendandburns",why_follow:"Original Kubernetes architect with strong views on container platforms."},
  {id:"liz-rice",name:"Liz Rice",topics:["Kubernetes","eBPF","Security","Platform Engineering"],bio:"Chief Open Source Officer at Isovalent (Cilium). Expert in container security and eBPF.",linkedin:"https://www.linkedin.com/in/lizrice/",x:"https://x.com/lizrice",github:"https://github.com/lizrice",why_follow:"Clear explanations of Kubernetes security, eBPF, and cloud-native networking."},
  {id:"adrian-cockcroft",name:"Adrian Cockcroft",topics:["Cloud Architecture","AWS","Observability"],bio:"Former VP of AWS and Netflix cloud architect. Advisor on cloud architecture.",linkedin:"https://www.linkedin.com/in/adriancockcroft/",x:"https://x.com/adrianco",why_follow:"Long-term perspective on cloud architecture from Netflix scale to AWS."},
  {id:"emily-freeman",name:"Emily Freeman",topics:["DevOps","Cloud","Engineering Leadership"],bio:"Author of DevOps for Dummies. Former AWS and Microsoft community lead.",linkedin:"https://www.linkedin.com/in/emilyfreeman/",why_follow:"Practical DevOps culture and cloud adoption guidance."},
  {id:"viktor-farcic",name:"Viktor Farcic",topics:["Kubernetes","DevOps","CI/CD","GitOps"],bio:"Developer Advocate and author. Known for DevOps Toolkit YouTube channel.",youtube:"https://www.youtube.com/@DevOpsToolkit",linkedin:"https://www.linkedin.com/in/vfarcic/",why_follow:"High-quality hands-on tutorials on Kubernetes, GitOps, and modern DevOps tools."}
];

function getTopics() {
  const s = new Set();
  experts.forEach(e => e.topics.forEach(t => s.add(t)));
  return Array.from(s).sort();
}

function filterExperts(q = "", t = "") {
  q = q.toLowerCase();
  t = t.toLowerCase();
  return experts.filter(e => {
    const mq = !q || e.name.toLowerCase().includes(q) || e.bio.toLowerCase().includes(q) || (e.why_follow && e.why_follow.toLowerCase().includes(q));
    const mt = !t || e.topics.some(tp => tp.toLowerCase().includes(t));
    return mq && mt;
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/api/experts") {
      const result = filterExperts(url.searchParams.get("q") || "", url.searchParams.get("topic") || "");
      return Response.json(result, { headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (url.pathname === "/api/topics") {
      return Response.json(getTopics(), { headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Expert Path</title>
<style>
body{margin:0;font-family:system-ui,sans-serif;background:#f8f9fa;color:#1a1a1a}
.container{max-width:1100px;margin:0 auto;padding:2rem 1rem}
header{text-align:center;margin-bottom:2rem}
h1{margin:0 0 .5rem;font-size:2.2rem}
p.sub{color:#555;margin:0}
.controls{display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap}
input,select{padding:.6rem .8rem;border:1px solid #ddd;border-radius:6px;font-size:1rem}
input{flex:1;min-width:200px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem}
.card{background:#fff;border:1px solid #e5e5e5;border-radius:10px;padding:1.25rem}
.card h3{margin:0 0 .4rem}
.topics{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0}
.topic{background:#e8f0fe;color:#1a56db;padding:.2rem .6rem;border-radius:12px;font-size:.8rem;font-weight:500}
.bio{color:#444;font-size:.95rem;margin:.5rem 0}
.why{background:#f0f9ff;border-left:3px solid #3b82f6;padding:.6rem .8rem;font-size:.9rem;margin:.75rem 0}
.links{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem}
.links a{color:#2563eb;text-decoration:none;font-size:.85rem;padding:.25rem .5rem;border:1px solid #dbeafe;border-radius:4px}
.empty{text-align:center;color:#666;padding:2rem}
</style></head><body>
<div class="container">
<header><h1>Expert Path</h1><p class="sub">Discover practitioners worth following on Kubernetes, AWS, SRE, Observability, and more.</p></header>
<div class="controls">
<input type="text" id="search" placeholder="Search by name, bio, or topic...">
<select id="topic"><option value="">All topics</option></select>
</div>
<div id="results" class="grid"></div>
</div>
<script>
const experts=${JSON.stringify(experts)};
const topics=${JSON.stringify(getTopics())};
const searchEl=document.getElementById('search');
const topicEl=document.getElementById('topic');
const resultsEl=document.getElementById('results');
topics.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;topicEl.appendChild(o)});
function render(){
  const q=searchEl.value.toLowerCase();
  const t=topicEl.value.toLowerCase();
  const filtered=experts.filter(e=>{
    const mq=!q||e.name.toLowerCase().includes(q)||e.bio.toLowerCase().includes(q)||(e.why_follow&&e.why_follow.toLowerCase().includes(q));
    const mt=!t||e.topics.some(tp=>tp.toLowerCase().includes(t));
    return mq&&mt;
  });
  if(!filtered.length){resultsEl.innerHTML='<div class="empty">No experts found.</div>';return;}
  resultsEl.innerHTML=filtered.map(e=>'<div class="card"><h3>'+e.name+'</h3><div class="topics">'+e.topics.map(tp=>'<span class="topic">'+tp+'</span>').join('')+'</div><p class="bio">'+e.bio+'</p><div class="why"><strong>Why follow:</strong> '+(e.why_follow||'')+'</div><div class="links">'+(e.linkedin?'<a href="'+e.linkedin+'" target="_blank">LinkedIn</a>':'')+(e.youtube?'<a href="'+e.youtube+'" target="_blank">YouTube</a>':'')+(e.x?'<a href="'+e.x+'" target="_blank">X</a>':'')+(e.github?'<a href="'+e.github+'" target="_blank">GitHub</a>':'')+(e.blog?'<a href="'+e.blog+'" target="_blank">Blog</a>':'')+'</div></div>').join('');
}
searchEl.oninput=render;topicEl.onchange=render;render();
</script></body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
  }
};

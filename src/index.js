// Expert Path - Cloudflare Worker
// Serves API + static frontend assets

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
      e.why_follow.toLowerCase().includes(q);
    const matchTopic = !t || e.topics.some(tp => tp.toLowerCase().includes(t));
    return matchQuery && matchTopic;
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API routes
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

    // Serve static frontend assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Expert Path API is running. Build the frontend to serve the UI.", { status: 200 });
  }
};

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type Expert struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Topics      []string `json:"topics"`
	Bio         string   `json:"bio"`
	LinkedIn    string   `json:"linkedin,omitempty"`
	YouTube     string   `json:"youtube,omitempty"`
	X           string   `json:"x,omitempty"`
	GitHub      string   `json:"github,omitempty"`
	Blog        string   `json:"blog,omitempty"`
	WhyFollow   string   `json:"why_follow"`
}

var experts = []Expert{
	{
		ID:        "kelsey-hightower",
		Name:      "Kelsey Hightower",
		Topics:    []string{"Kubernetes", "Cloud Native", "DevOps"},
		Bio:       "Former Distinguished Engineer at Google Cloud. Kubernetes pioneer and community leader.",
		LinkedIn:  "https://www.linkedin.com/in/kelseyhightower/",
		X:         "https://x.com/kelseyhightower",
		GitHub:    "https://github.com/kelseyhightower",
		WhyFollow: "Practical, no-nonsense Kubernetes and cloud-native advice from one of the original advocates.",
	},
	{
		ID:        "corey-quinn",
		Name:      "Corey Quinn",
		Topics:    []string{"AWS", "FinOps", "Cloud Economics"},
		Bio:       "Cloud economist, host of Screaming in the Cloud podcast. Sharp takes on AWS costs and practices.",
		LinkedIn:  "https://www.linkedin.com/in/coreyquinn/",
		X:         "https://x.com/QuinnyPig",
		Blog:      "https://www.lastweekinaws.com/",
		WhyFollow: "Best source for honest AWS cost optimization and cloud vendor criticism.",
	},
	{
		ID:        "charity-majors",
		Name:      "Charity Majors",
		Topics:    []string{"Observability", "SRE", "Platform Engineering"},
		Bio:       "Co-founder and CTO of Honeycomb. Leading voice on observability and engineering leadership.",
		LinkedIn:  "https://www.linkedin.com/in/charitymajors/",
		X:         "https://x.com/mipsytipsy",
		Blog:      "https://charity.wtf/",
		WhyFollow: "Deep insights on observability, incident response, and building reliable systems.",
	},
	{
		ID:        "brendan-burns",
		Name:      "Brendan Burns",
		Topics:    []string{"Kubernetes", "Containers", "Azure"},
		Bio:       "Co-founder of Kubernetes, Corporate VP at Microsoft Azure.",
		LinkedIn:  "https://www.linkedin.com/in/brendanburns/",
		X:         "https://x.com/brendandburns",
		GitHub:    "https://github.com/brendandburns",
		WhyFollow: "Original Kubernetes architect with strong views on container platforms.",
	},
	{
		ID:        "liz-rice",
		Name:      "Liz Rice",
		Topics:    []string{"Kubernetes", "eBPF", "Security", "Platform Engineering"},
		Bio:       "Chief Open Source Officer at Isovalent (Cilium). Expert in container security and eBPF.",
		LinkedIn:  "https://www.linkedin.com/in/lizrice/",
		X:         "https://x.com/lizrice",
		GitHub:    "https://github.com/lizrice",
		WhyFollow: "Clear explanations of Kubernetes security, eBPF, and cloud-native networking.",
	},
	{
		ID:        "adrian-cockcroft",
		Name:      "Adrian Cockcroft",
		Topics:    []string{"Cloud Architecture", "AWS", "Observability"},
		Bio:       "Former VP of AWS and Netflix cloud architect. Advisor on cloud architecture.",
		LinkedIn:  "https://www.linkedin.com/in/adriancockcroft/",
		X:         "https://x.com/adrianco",
		WhyFollow: "Long-term perspective on cloud architecture from Netflix scale to AWS.",
	},
	{
		ID:        "emily-freeman",
		Name:      "Emily Freeman",
		Topics:    []string{"DevOps", "Cloud", "Engineering Leadership"},
		Bio:       "Author of DevOps for Dummies. Former AWS and Microsoft community lead.",
		LinkedIn:  "https://www.linkedin.com/in/emilyfreeman/",
		WhyFollow: "Practical DevOps culture and cloud adoption guidance.",
	},
	{
		ID:        "viktor-farcic",
		Name:      "Viktor Farcic",
		Topics:    []string{"Kubernetes", "DevOps", "CI/CD", "GitOps"},
		Bio:       "Developer Advocate and author. Known for DevOps Toolkit YouTube channel.",
		YouTube:   "https://www.youtube.com/@DevOpsToolkit",
		LinkedIn:  "https://www.linkedin.com/in/vfarcic/",
		WhyFollow: "High-quality hands-on tutorials on Kubernetes, GitOps, and modern DevOps tools.",
	},
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func listExperts(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	query := strings.ToLower(r.URL.Query().Get("q"))
	topic := strings.ToLower(r.URL.Query().Get("topic"))

	var result []Expert
	for _, e := range experts {
		matchQuery := query == "" || strings.Contains(strings.ToLower(e.Name), query) || strings.Contains(strings.ToLower(e.Bio), query) || strings.Contains(strings.ToLower(e.WhyFollow), query)
		matchTopic := topic == "" || containsTopic(e.Topics, topic)
		if matchQuery && matchTopic {
			result = append(result, e)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func containsTopic(topics []string, topic string) bool {
	for _, t := range topics {
		if strings.Contains(strings.ToLower(t), topic) {
			return true
		}
	}
	return false
}

func topicsHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	topicSet := map[string]bool{}
	for _, e := range experts {
		for _, t := range e.Topics {
			topicSet[t] = true
		}
	}
	var topics []string
	for t := range topicSet {
		topics = append(topics, t)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topics)
}

func main() {
	http.HandleFunc("/api/experts", listExperts)
	http.HandleFunc("/api/topics", topicsHandler)

	log.Println("Backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

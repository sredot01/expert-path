import { useState, useEffect } from 'react'

function App() {
  const [experts, setExperts] = useState([])
  const [topics, setTopics] = useState([])
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => setTopics(data.sort()))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (selectedTopic) params.set('topic', selectedTopic)

    fetch(`/api/experts?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setExperts(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [search, selectedTopic])

  return (
    <div className="container">
      <header>
        <h1>Tech Experts Discovery</h1>
        <p>Find practitioners worth following on Kubernetes, AWS, SRE, Observability, and more.</p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, bio, or topic..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
          <option value="">All topics</option>
          {topics.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="empty">Loading...</div>
      ) : experts.length === 0 ? (
        <div className="empty">No experts found. Try a different search.</div>
      ) : (
        <div className="grid">
          {experts.map(expert => (
            <div key={expert.id} className="card">
              <h3>{expert.name}</h3>
              <div className="topics">
                {expert.topics.map(t => (
                  <span key={t} className="topic">{t}</span>
                ))}
              </div>
              <p className="bio">{expert.bio}</p>
              <div className="why">
                <strong>Why follow:</strong> {expert.why_follow}
              </div>
              <div className="links">
                {expert.linkedin && <a href={expert.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                {expert.youtube && <a href={expert.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>}
                {expert.x && <a href={expert.x} target="_blank" rel="noopener noreferrer">X</a>}
                {expert.github && <a href={expert.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                {expert.blog && <a href={expert.blog} target="_blank" rel="noopener noreferrer">Blog</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App

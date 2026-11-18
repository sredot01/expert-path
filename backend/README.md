# Tech Experts MVP - Backend

Simple Go API for the expert discovery MVP.

## Run

```bash
cd backend
go run main.go
```

Listens on http://localhost:8080

### Endpoints

- `GET /api/experts?q=search&topic=Kubernetes` - list experts (filters optional)
- `GET /api/topics` - unique topics

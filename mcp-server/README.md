# Apollo AI MCP Server

Redis-based Model Context Protocol (MCP) server for the Apollo AI medical diagnostic platform. Provides enterprise-grade session management and medical data caching capabilities.

## Features

### 🏥 Medical Session Management
- **Patient Session Storage**: Secure server-side storage of patient analysis data
- **Multi-device Access**: Sessions persist across devices and browsers
- **Automatic Expiration**: Configurable session TTL (default 24 hours)
- **Session Tracking**: Track creation time, last access, and expiration

### 🚀 Medical Data Caching
- **API Response Caching**: Cache PubMed, ClinicalTrials.gov, and treatment recommendation responses
- **Source-based Organization**: Organize cached data by source (pubmed, clinicaltrials, etc.)
- **Intelligent TTL**: Configurable cache expiration based on data type
- **Fast Retrieval**: Sub-second data access for cached medical information

### 🔧 Enterprise Features
- **Redis Integration**: Production-ready Redis backend with automatic fallback
- **Memory Fallback**: Graceful degradation to in-memory storage when Redis unavailable
- **Session Monitoring**: List and monitor active patient sessions
- **Error Handling**: Comprehensive error handling and logging

## Installation

1. **Install dependencies:**
```bash
cd mcp-server
npm install
```

2. **Set up Redis (optional):**
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally (macOS)
brew install redis
brew services start redis
```

3. **Configure environment variables:**
```bash
# Optional - defaults to localhost:6379
export REDIS_HOST=localhost
export REDIS_PORT=6379
export REDIS_PASSWORD=your_password
```

## Usage

### Running the MCP Server

```bash
# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

### Available Tools

#### 1. `save_patient_session`
Store patient analysis data with session management.

```json
{
  "sessionId": "optional-custom-id",
  "patientData": {
    "structuredData": { /* medical analysis JSON */ },
    "originalText": "patient clinical notes...",
    "imageData": { /* brain tumor classification results */ }
  },
  "expirationHours": 24
}
```

#### 2. `get_patient_session`
Retrieve patient session data by session ID.

```json
{
  "sessionId": "session-uuid-here"
}
```

#### 3. `delete_patient_session`
Delete patient session data.

```json
{
  "sessionId": "session-uuid-here"
}
```

#### 4. `cache_medical_data`
Cache medical API responses for faster retrieval.

```json
{
  "cacheKey": "brain_tumor_pubmed_query_hash",
  "data": { /* PubMed API response */ },
  "source": "pubmed",
  "ttlMinutes": 60
}
```

#### 5. `get_cached_data`
Retrieve cached medical data.

```json
{
  "cacheKey": "brain_tumor_pubmed_query_hash",
  "source": "pubmed"
}
```

#### 6. `list_active_sessions`
List all active patient sessions.

```json
{
  "limit": 50
}
```

## Integration with Apollo AI

### Backend Integration

The MCP server can be integrated with your existing Apollo AI backend by calling the tools programmatically:

```javascript
// Example: Save patient session after analysis
const sessionResult = await mcpClient.callTool('save_patient_session', {
  patientData: {
    structuredData: analysisResult.structuredData,
    originalText: patientText,
    imageData: brainScanResult
  }
});

// Example: Cache PubMed results
await mcpClient.callTool('cache_medical_data', {
  cacheKey: queryHash,
  data: pubmedResults,
  source: 'pubmed',
  ttlMinutes: 120
});
```

### Frontend Integration

Update your React components to use session-based storage:

```javascript
// Instead of localStorage
const sessionId = await getSessionId();
const sessionData = await mcpClient.callTool('get_patient_session', { sessionId });
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Apollo AI     │    │   MCP Server    │    │     Redis       │
│   Frontend      │◄──►│                 │◄──►│    Database     │
└─────────────────┘    │  Session Mgmt   │    └─────────────────┘
                       │  Medical Cache  │
┌─────────────────┐    │                 │    ┌─────────────────┐
│   Apollo AI     │◄──►│                 │◄──►│   Memory Store  │
│   Backend       │    └─────────────────┘    │   (Fallback)    │
└─────────────────┘                           └─────────────────┘
```

## Data Structure

### Patient Session Data
```json
{
  "sessionId": "uuid-v4",
  "structuredData": {
    "visit motivation": "...",
    "patient information": { /* ... */ },
    "symptoms": [ /* ... */ ],
    "diagnosis tests": [ /* ... */ ],
    "treatments": [ /* ... */ ]
  },
  "originalText": "Raw clinical notes...",
  "imageData": {
    "predicted_class": "brain_glioma",
    "confidence": 0.94,
    "filename": "mri_scan.jpg"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "lastAccessed": "2024-01-15T11:15:00Z",
  "expiresAt": "2024-01-16T10:30:00Z"
}
```

### Cached Medical Data
```json
{
  "data": { /* API response data */ },
  "source": "pubmed|clinicaltrials|treatment_recommendations",
  "cachedAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-15T11:30:00Z"
}
```

## Security & Compliance

- **Data Encryption**: All Redis connections support TLS encryption
- **Session Expiration**: Automatic cleanup of expired patient data
- **Memory Fallback**: No persistent storage of sensitive data in fallback mode
- **Access Logging**: Track session access for audit purposes

## Monitoring

The MCP server provides session monitoring capabilities:

- Active session count and details
- Cache hit/miss ratios
- Storage backend status (Redis vs Memory)
- Session expiration tracking

## Production Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

```bash
# Production Redis Configuration
REDIS_HOST=redis.your-domain.com
REDIS_PORT=6379
REDIS_PASSWORD=secure_password
REDIS_TLS=true

# Session Configuration
DEFAULT_SESSION_TTL_HOURS=24
MAX_SESSIONS_PER_USER=10
```

## Development

### Running Tests

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This MCP server is part of the Apollo AI medical platform and is intended for educational and research purposes. Medical decisions should always be made in consultation with qualified healthcare professionals.

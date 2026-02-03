# K6 API Load Test

Load testing for API endpoints using k6.

## Features

- Docker-based execution (no local k6 installation needed)
- Environment-driven configuration
- Automated authentication and multi-endpoint testing
- Real-time web dashboard and HTML reports

## Prerequisites

- Docker

## Quick Start

1. Create `k6.env` file based on `k6.env.example`

2. Edit `k6.env` and specify your parameters:

```bash
BASE_URL=https://your-api.example.com
USERNAME=your-username
PASSWORD=your-password
LOGIN_PATH=/api/your-app/v1/authentication/login
API_PATHS=/api/endpoint1,/api/endpoint2,/api/endpoint3
LOGO_ID=your-logo-id

# Optional: adjust load test parameters
PEAK_VUS=100
DURATION_PEAK=5m
DURATION_RAMP=1m
```

3. Run the test:

```bash
# Linux/macOS:
./run-k6.sh

# Windows (PowerShell):
.\run-k6.ps1
```

## Configuration

### Required Parameters

| Parameter | Description |
|----------|------|
| `BASE_URL` | API base URL to test |
| `USERNAME` | Login username |
| `PASSWORD` | Password |
| `LOGIN_PATH` | API endpoint path for login |
| `API_PATHS` | Comma-separated list of endpoints to test (no spaces!) |
| `LOGO_ID` | Custom header required by the API |

### Optional Parameters

| Parameter | Description | Default |
|----------|------|------------------|
| `PEAK_VUS` | Maximum number of VUs | 100 |
| `DURATION_PEAK` | Peak load duration | 5m |
| `DURATION_RAMP` | Ramp-up/ramp-down time | 1m |

## Viewing Results

- **Web Dashboard**: http://localhost:5665 (during test execution)
- **HTML Report**: `k6_report.html` (after completion)

## Test Structure

The test runs in three phases:
1. **Ramp Up** - gradual increase from 0 to `PEAK_VUS` users
2. **Peak** - maintain maximum load
3. **Ramp Down** - gradual decrease to 0

Each virtual user:
1. Sends a POST request to the login endpoint with credentials
2. If login is successful (status 200), tests all endpoints from `API_PATHS`
3. If login fails, skips endpoint testing and logs the error
4. Waits 2 seconds before the next iteration

## Skills Demonstrated

**Performance Testing:**
- Load testing with k6
- Performance test design (ramping patterns)
- Metrics interpretation

**DevOps & Automation:**
- Docker containerization
- Shell scripting (Bash/PowerShell)
- Environment-based configuration

**API Testing:**
- Authentication flow handling
- RESTful API testing
- Response validation
- Error handling
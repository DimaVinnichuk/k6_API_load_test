import http from "k6/http";
import { check, sleep } from "k6";

// =====================================================================================
// 1. CONFIGURATION: Environment Variables
// These variables are read from k6.env or passed via Docker/CLI.
// =====================================================================================
const BASE_URL = __ENV.BASE_URL;
const USERNAME = __ENV.USERNAME;
const PASSWORD = __ENV.PASSWORD;
const LOGIN_PATH = __ENV.LOGIN_PATH;
const API_PATHS = __ENV.API_PATHS;
const LOGO_ID = __ENV.LOGO_ID;

// Validate required environment variables
if (!BASE_URL) {
  throw new Error('BASE_URL is not defined. Please set it in k6.env file.');
}
if (!USERNAME) {
  throw new Error('USERNAME is not defined. Please set it in k6.env file.');
}
if (!PASSWORD) {
  throw new Error('PASSWORD is not defined. Please set it in k6.env file.');
}
if (!LOGIN_PATH) {
  throw new Error('LOGIN_PATH is not defined. Please set it in k6.env file.');
}
if (!API_PATHS) {
  throw new Error('API_PATHS is not defined. Please set it in k6.env file.');
}
if (!LOGO_ID) {
  throw new Error('LOGO_ID is not defined. Please set it in k6.env file.');
}

// Parse paths from environment variable (comma-separated string)
const PATHS = API_PATHS.split(',').map(path => path.trim());

// K6 performance parameters
const PEAK_VUS = parseInt(__ENV.PEAK_VUS || '100');
const DURATION_PEAK = __ENV.DURATION_PEAK || '5m';
const DURATION_RAMP = __ENV.DURATION_RAMP || '1m';

// =====================================================================================
// 2. K6 OPTIONS: Scenario Setup
// Defines how the load test should be executed (load pattern).
// =====================================================================================
export const options = {
  scenarios: {
    default: {
      executor: "ramping-vus",
      stages: [
        { duration: DURATION_RAMP, target: PEAK_VUS },
        { duration: DURATION_PEAK, target: PEAK_VUS },
        { duration: DURATION_RAMP, target: 0 }
      ],
      gracefulStop: "15s"
    }
  }
};

// =====================================================================================
// 3. MAIN FUNCTION: Test Logic
// This function is executed repeatedly by each Virtual User (VU).
// =====================================================================================
export default function() {
  // 1. Prepare the login request body (payload)
  const payloads = JSON.stringify({
    Username: USERNAME,
    Password: PASSWORD,
  });

  // 2. Define request parameters (headers)
  const parameters = {
    headers: {
      'Content-Type': 'application/json',
      'logo-id': LOGO_ID,
    },
  };

  // 3. Send the login POST request
  let res = http.post(BASE_URL + LOGIN_PATH, payloads, parameters);
  
  // Log non-200 status codes for login
  if(res.status !== 200) {
    console.log(`[LOGIN ERROR] Status: ${res.status}, Body: ${res.body}`);
    return; // Stop execution if login failed
  }

  // 4. Test all API endpoints with GET requests (only if login successful)
  for (let i = 0; i < PATHS.length; i++){
    let result = http.get(BASE_URL + PATHS[i], parameters);
    
    // Log non-200 status codes for each endpoint
    if(result.status !== 200) console.log(`[GET ERROR] Path: ${PATHS[i]}, Status: ${result.status}`);
  }

  // 5. Think time (simulate user pause between actions)
  sleep(2);
}
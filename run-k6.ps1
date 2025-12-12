# Read and set environment variables from k6.env for the current session.
if (Test-Path "k6.env") {
    Get-Content "k6.env" | ForEach-Object {
        # Skip comments and empty lines
        if ($_ -match "^\s*#") { return }         
        if ($_ -match "^\s*$") { return }         

        # Split and set environment variable
        $parts = $_ -split "=", 2
        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        Set-Item -Path "env:$name" -Value $value
    }
}

# Run k6 test using Docker. 
# All necessary variables are explicitly passed to the Docker container from the current environment.
docker run --rm -v "${PWD}:/scripts" -w /scripts -p 5665:5665 `
    -e K6_WEB_DASHBOARD="true" `
    -e K6_WEB_DASHBOARD_EXPORT="k6_report.html" `
    -e BASE_URL="$env:BASE_URL" `
    -e USERNAME="$env:USERNAME" `
    -e PASSWORD="$env:PASSWORD" `
    -e LOGIN_PATH="$env:LOGIN_PATH" `
    -e API_PATHS="$env:API_PATHS" `
    -e LOGO_ID="$env:LOGO_ID" `
    -e PEAK_VUS="$env:PEAK_VUS" `
    -e DURATION_PEAK="$env:DURATION_PEAK" `
    -e DURATION_RAMP="$env:DURATION_RAMP" `
    grafana/k6 run login_API_load_test.js
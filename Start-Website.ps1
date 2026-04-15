$ErrorActionPreference = "Stop"

function Get-LocalIPv4 {
  $ips = @()
  try {
    $configs = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
      Where-Object { $_.IPAddress -and $_.IPAddress -ne "127.0.0.1" -and $_.PrefixOrigin -ne "WellKnown" }
    foreach ($c in $configs) { $ips += $c.IPAddress }
  } catch {
    # Fallback for older Windows / restricted environments
    $raw = ipconfig | Out-String
    foreach ($m in [regex]::Matches($raw, "IPv4 Address[^\d]*(\d+\.\d+\.\d+\.\d+)")) {
      $ip = $m.Groups[1].Value
      if ($ip -and $ip -ne "127.0.0.1") { $ips += $ip }
    }
  }
  $ips | Select-Object -Unique
}

if (-not (Test-Path -LiteralPath ".\server.js")) {
  Write-Host "ERROR: server.js not found in this folder." -ForegroundColor Red
  Write-Host "Open this folder and run this script from the website folder."
  Read-Host "Press Enter to close"
  exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "ERROR: Node.js is not installed (node command not found)." -ForegroundColor Red
  Write-Host "Install Node.js, then run Start-Website again."
  Read-Host "Press Enter to close"
  exit 1
}

$port = 8000
$env:PORT = "$port"

Write-Host ""
Write-Host "Starting website..." -ForegroundColor Cyan
Write-Host ""
Write-Host ("Desktop: http://localhost:{0}" -f $port) -ForegroundColor Green

$ips = Get-LocalIPv4
foreach ($ip in $ips) {
  Write-Host ("Mobile (same Wi-Fi): http://{0}:{1}" -f $ip, $port) -ForegroundColor Green
}

Write-Host ""
Write-Host "Opening the website in your browser..." -ForegroundColor Cyan
Start-Process ("http://localhost:{0}" -f $port) | Out-Null

Write-Host ""
Write-Host "Keep this window open. To stop the website, press CTRL + C." -ForegroundColor Yellow
Write-Host ""

node .\server.js


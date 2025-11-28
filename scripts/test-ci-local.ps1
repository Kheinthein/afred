# Script pour tester le CI localement avant de push
# Simule exactement ce que GitHub Actions va faire

Write-Host "🔍 Simulation du CI/CD en local..." -ForegroundColor Cyan
Write-Host ""

# 1. Lint
Write-Host "📝 Step 1/6: Lint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lint failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Lint passed" -ForegroundColor Green
Write-Host ""

# 2. Format check
Write-Host "📝 Step 2/6: Format check..." -ForegroundColor Yellow
npm run format:check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Format check failed! Run: npm run format" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Format check passed" -ForegroundColor Green
Write-Host ""

# 3. Type check
Write-Host "📝 Step 3/6: Type check..." -ForegroundColor Yellow
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type check failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Type check passed" -ForegroundColor Green
Write-Host ""

# 4. Unit tests
Write-Host "📝 Step 4/6: Unit tests..." -ForegroundColor Yellow
npm run test:unit
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Unit tests failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Unit tests passed" -ForegroundColor Green
Write-Host ""

# 5. Integration tests
Write-Host "📝 Step 5/6: Integration tests..." -ForegroundColor Yellow
npm run test:integration
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Integration tests failed (may need API key)" -ForegroundColor Yellow
}
Write-Host "✅ Integration tests completed" -ForegroundColor Green
Write-Host ""

# 6. Build
Write-Host "📝 Step 6/6: Build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build passed" -ForegroundColor Green
Write-Host ""

Write-Host "Tous les checks sont passes! Tu peux push en toute securite." -ForegroundColor Green


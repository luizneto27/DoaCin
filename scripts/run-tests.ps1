# Script para configurar e executar testes de integração

Write-Host "Configurando ambiente de testes DoaCin..." -ForegroundColor Cyan
Write-Host ""

# 1. Verifica se Docker está rodando
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "Docker não está rodando. Por favor, inicie o Docker Desktop." -ForegroundColor Red
    Write-Host "   Aguarde o Docker iniciar e execute este script novamente." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 2. Inicia container de teste
Write-Host "2. Iniciando banco de dados PostgreSQL para testes..." -ForegroundColor Yellow
docker-compose up -d postgres-test

if ($LASTEXITCODE -eq 0) {
    Write-Host "Container iniciado com sucesso" -ForegroundColor Green
} else {
    Write-Host "Erro ao iniciar container" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 3. Aguarda banco estar pronto
Write-Host "3. Aguardando banco de dados ficar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$retries = 0
$maxRetries = 30
$connected = $false

while ($retries -lt $maxRetries -and -not $connected) {
    try {
        $result = docker exec doacin-db-test pg_isready -U test_user 2>&1
        if ($result -match "accepting connections") {
            $connected = $true
            Write-Host "Banco de dados está pronto" -ForegroundColor Green
        } else {
            Write-Host "   Tentativa $($retries + 1)/$maxRetries..." -ForegroundColor Gray
            Start-Sleep -Seconds 1
            $retries++
        }
    } catch {
        Write-Host "   Tentativa $($retries + 1)/$maxRetries..." -ForegroundColor Gray
        Start-Sleep -Seconds 1
        $retries++
    }
}

if (-not $connected) {
    Write-Host "Timeout: banco de dados não ficou pronto" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 4. Executa migrations
Write-Host "4. Executando migrations no banco de teste..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://test_user:test_pass@localhost:5433/doacin_test"

try {
    npx prisma migrate deploy 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migrations executadas com sucesso" -ForegroundColor Green
    } else {
        Write-Host "Erro nas migrations (verifique se já foram executadas)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erro nas migrations" -ForegroundColor Yellow
}

Write-Host ""

# 5. Executa testes
Write-Host "5. Executando testes de integração..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

npm test

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($LASTEXITCODE -eq 0) {
    Write-Host "Todos os testes passaram!" -ForegroundColor Green
} else {
    Write-Host "Alguns testes falharam" -ForegroundColor Red
}

Write-Host ""
Write-Host "Dicas:" -ForegroundColor Cyan
Write-Host "   • Para parar o banco de teste: docker-compose stop postgres-test" -ForegroundColor Gray
Write-Host "   • Para ver logs do banco: docker logs doacin-db-test" -ForegroundColor Gray
Write-Host "   • Para executar testes em modo watch: npm run test:watch" -ForegroundColor Gray
Write-Host "   • Para ver interface UI: npm run test:ui" -ForegroundColor Gray

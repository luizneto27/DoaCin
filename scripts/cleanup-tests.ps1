# Script para limpar ambiente de testes

Write-Host "Limpando ambiente de testes..." -ForegroundColor Cyan
Write-Host ""

# Para e remove o container de teste
Write-Host "Parando container de teste..." -ForegroundColor Yellow
docker-compose stop postgres-test

Write-Host "Removendo container de teste..." -ForegroundColor Yellow
docker-compose rm -f postgres-test

# Opcional: Remover volume (dados serão perdidos)
$removeVolume = Read-Host "Deseja remover o volume de dados do banco de teste? (s/N)"
if ($removeVolume -eq "s" -or $removeVolume -eq "S") {
    Write-Host "Removendo volume..." -ForegroundColor Yellow
    docker volume rm doacin_postgres_test_data 2>$null
    Write-Host "Volume removido" -ForegroundColor Green
}

Write-Host ""
Write-Host "Ambiente de testes limpo!" -ForegroundColor Green

#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-azure.sh — Build e push da imagem Sice para Azure Container Registry
# Uso: ./deploy-azure.sh [versão]
# Exemplo: ./deploy-azure.sh 1.0.0
# ─────────────────────────────────────────────────────────────────────────────

set -e  # Para se qualquer comando falhar

# ── Configurações ─────────────────────────────────────────────────────────────
ACR_NAME="siceregistry"            # Nome do seu Azure Container Registry
IMAGE_NAME="sice"
VERSION="${1:-latest}"             # Versão: ./deploy.sh 1.2.3 ou "latest"
FULL_IMAGE="${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${VERSION}"

echo "────────────────────────────────────────────"
echo "🐳 Build & Deploy — Sice v${VERSION}"
echo "🏭 Registry: ${ACR_NAME}.azurecr.io"
echo "────────────────────────────────────────────"

# ── 1. Login no Azure e no ACR ─────────────────────────────────────────────────
echo ""
echo "🔑 Fazendo login no Azure Container Registry..."
az acr login --name "$ACR_NAME"

# ── 2. Build da imagem ────────────────────────────────────────────────────────
echo ""
echo "🔨 Fazendo build da imagem..."
docker build \
  --platform linux/amd64 \
  --tag "$FULL_IMAGE" \
  --tag "${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest" \
  .

# ── 3. Push para o ACR ────────────────────────────────────────────────────────
echo ""
echo "📤 Fazendo push para o Azure Container Registry..."
docker push "$FULL_IMAGE"
docker push "${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest"

# ── 4. (Opcional) Atualiza o Azure App Service ────────────────────────────────
# Descomente e preencha se usar Azure App Service:
#
# RESOURCE_GROUP="sice-rg"
# APP_NAME="sice-app"
# echo ""
# echo "🚀 Atualizando Azure App Service..."
# az webapp config container set \
#   --resource-group "$RESOURCE_GROUP" \
#   --name "$APP_NAME" \
#   --docker-custom-image-name "$FULL_IMAGE" \
#   --docker-registry-server-url "https://${ACR_NAME}.azurecr.io"
# az webapp restart --resource-group "$RESOURCE_GROUP" --name "$APP_NAME"

echo ""
echo "✅ Deploy concluído!"
echo "🖼️  Imagem: ${FULL_IMAGE}"

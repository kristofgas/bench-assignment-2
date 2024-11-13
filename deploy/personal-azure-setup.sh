#!/bin/bash

# Your configuration
REPONAME="bench-assignment-2"
LOCATION="northeurope"
APP_NAME="${REPONAME//_/-}"

# Resource names
RESOURCE_GROUP="$APP_NAME-rg"
SQL_SERVER="$APP_NAME-sql"
SQL_DB="$APP_NAME-db"
SQL_ADMIN="sqladmin"
APP_SERVICE_PLAN="$APP_NAME-plan"
BACKEND_APP="$APP_NAME-api"
FRONTEND_APP="$APP_NAME-web"
ACR_NAME="benchassignment2acr"

# Generate secure password
SQL_PASSWORD=$(openssl rand -base64 32)

# Create Resource Group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create SQL Server and Database
az sql server create \
    --name $SQL_SERVER \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --admin-user $SQL_ADMIN \
    --admin-password $SQL_PASSWORD

az sql db create \
    --resource-group $RESOURCE_GROUP \
    --server $SQL_SERVER \
    --name $SQL_DB \
    --service-objective Basic

# Create App Service Plan (P1V2 for container support)
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku P1V2 \
    --is-linux

# Create Web Apps for Containers
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $BACKEND_APP \
    --runtime "DOTNETCORE:7.0"

az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $FRONTEND_APP \
    --runtime "NODE:18-lts"

az webapp config set --resource-group $RESOURCE_GROUP --name $BACKEND_APP --linux-fx-version "DOCKER|mcr.microsoft.com/dotnet/aspnet:7.0"
az webapp config set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP --linux-fx-version "DOCKER|node:18-alpine"

# Create ACR
az acr create \
    --name $ACR_NAME \
    --resource-group $RESOURCE_GROUP \
    --sku Basic \
    --admin-enabled true

# Create Service Principal with proper permissions
echo "Creating service principal for GitHub Actions..."
ACR_ID=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query id -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

SP_OUTPUT=$(MSYS_NO_PATHCONV=1 az ad sp create-for-rbac \
    --name "$APP_NAME-sp" \
    --sdk-auth \
    --role "Contributor" \
    --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" 
    )

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Output GitHub Secrets
echo "Add these secrets to GitHub:"
echo "AZURE_CREDENTIALS:"
echo "$SP_OUTPUT"
echo "-------------------"
echo "REGISTRY_USERNAME: $ACR_USERNAME"
echo "REGISTRY_PASSWORD: $ACR_PASSWORD"

echo "Setup complete!"
echo "Backend URL: https://$BACKEND_APP.azurewebsites.net"
echo "Frontend URL: https://$FRONTEND_APP.azurewebsites.net"
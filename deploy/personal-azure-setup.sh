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
KEY_VAULT="$APP_NAME-kv"

# Generate secure password
SQL_PASSWORD=$(openssl rand -base64 32)

# Login to Azure (without tenant specification)
az login

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

# Create App Service Plan (Free tier)
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku F1 \
    --is-linux

# Create Backend App Service
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $BACKEND_APP \
    --runtime "DOTNETCORE:7.0"

# Create Frontend App Service
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $FRONTEND_APP \
    --runtime "NODE:18-lts"

# Configure Backend Settings
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP \
    --settings \
    "ConnectionStrings__DefaultConnection=Server=tcp:$SQL_SERVER.database.windows.net;Database=$SQL_DB;User ID=$SQL_ADMIN;Password=$SQL_PASSWORD;Encrypt=true;" \
    "AllowedOrigins__0=https://$FRONTEND_APP.azurewebsites.net"
# Configure Frontend Settings
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $FRONTEND_APP \
    --settings \
    "NEXT_PUBLIC_API_URL=https://$BACKEND_APP.azurewebsites.net"

echo "Setup complete!"
echo "Backend URL: https://$BACKEND_APP.azurewebsites.net"
echo "Frontend URL: https://$FRONTEND_APP.azurewebsites.net"
#!/bin/sh
#CPH CONSTANTS DONT CHANGE
AZURETENANTID='9c5bd6eb-62ce-4a2d-97c6-0acc1ccfec55'
AZURESUBSCRIPTIONID="4ea17de3-cb5d-4e10-bc30-12b88a4957bd"
AKSNAME='cphdeliveryinternalk8sAKS'
AKSURL='https://kubernetes.default.svc'
AKSRESOURCEGROUP='cph-delivery-internal-k8s'
RESOURCEGROUPLOCATION='westeurope'

#CHANGE THIS
REPONAME='REPONAMEHERE'
KVNAME="KEYVAULTNAMEHERE" #MAX 24 CHARACTERS

#SETUP VARIABLES
APPNAME="`echo "$REPONAME" | tr _ -`"
RESOURCEGROUPNAME="$APPNAME-rg"
DBSERVERNAME="$APPNAME-dbserver"
DBSERVERADMIN="$APPNAME-dbadmin"
DBNAME="$APPNAME-db"
SUBDOMAIN="$APPNAME"
ACRNAME="`echo "$APPNAME" | tr -d _- | tr '[:upper:]' '[:lower:]'`acr"
SPNAME="$APPNAME-sp"
APPLICATIONINSIHGTSNAME="$APPNAME-insights"
DBSERVERPASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)


#Log into azure
echo Logging into azure tenant $AZURETENANTID
az login --tenant $AZURETENANTID
echo Logged into azure tenant

az account set -s $AZURESUBSCRIPTIONID

#Check if resource group is already created
if [ $(az group exists --name $RESOURCEGROUPNAME) = true ]; then
    echo Resouce group with name $RESOURCEGROUPNAME already exists, aborting;
    sleep 10s
    exit 1
fi

#Create resource group
echo Creating resouce group $RESOURCEGROUPNAME in $RESOURCEGROUPLOCATION
az group create -l $RESOURCEGROUPLOCATION -n $RESOURCEGROUPNAME
echo Resource group created

#Deploy SQL SERVER
echo Deploying SQL Server
az deployment group create --resource-group $RESOURCEGROUPNAME --subscription $AZURESUBSCRIPTIONID --template-file bicep/db-server.bicep --parameters serverName=$DBSERVERNAME administratorLogin=$DBSERVERADMIN administratorLoginPassword=$DBSERVERPASSWORD
echo SQL Server deployed, deploying database
az deployment group create --resource-group $RESOURCEGROUPNAME --subscription $AZURESUBSCRIPTIONID --template-file bicep/db.bicep --parameters dbName=$DBNAME dbServerName=$DBSERVERNAME
echo Database deployed

#Create container registry
echo Creating container registry $ACRNAME
az acr create --name $ACRNAME --resource-group $RESOURCEGROUPNAME --sku Basic --admin-enabled true
echo Container registry created

#Attach ACR to AKS
echo Attach ACR to AKS
ACRID=$(az acr show --name $ACRNAME --resource-group $RESOURCEGROUPNAME --query "id" --output tsv)
echo az aks update -n $AKSNAME -g $AKSRESOURCEGROUP --attach-acr $ACRID
MSYS_NO_PATHCONV=1 az aks update -n $AKSNAME -g $AKSRESOURCEGROUP --attach-acr $ACRID
echo ACR attached

#Create service-principal for github to deploy to acr
echo Creating service-principal $SPNAME for github to deploy to ACR
SPRESPONSE=$(az ad sp create-for-rbac --name $SPNAME --query "{appId:appId, password:password}" --output tsv)
IFS=$'\t' read -r SPID SPPASSWORD <<< $SPRESPONSE

#Create role assignment for service-principal to deploy to acr and handle databases
echo Create role assignment for cluster to be able to pull from container registry
ACRID=$(az acr show --name $ACRNAME --resource-group $RESOURCEGROUPNAME --query "id" --output tsv)
echo ACRID: $ACRID >> initial-deploy-secrets.txt
echo az role assignment create --assignee $SPID --role Contributor --scope $ACRID
MSYS_NO_PATHCONV=1 az role assignment create --assignee $SPID --role Contributor --scope $ACRID
DBSERVERID=$(az sql server show --name $DBSERVERNAME --resource-group $RESOURCEGROUPNAME --query "id" --output tsv)
echo az role assignment create --assignee $SPID --role Contributor --scope $DBSERVERID
MSYS_NO_PATHCONV=1 az role assignment create --assignee $SPID --role "SQL Server Contributor" --scope $DBSERVERID
echo Role assignment created

AZURESUBSCRIPTIONID=$(az account show --query id -o tsv)

#Create file to easily set up secrets for github
echo gh secret set Azure_Service_Principal -b $SPID -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh secret set Azure_Service_Principal_Password -b $SPPASSWORD -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh secret set Azure_Tenant -b $AZURETENANTID -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh secret set Azure_Subscription -b $AZURESUBSCRIPTIONID -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh secret set Azure_Database_Name -b $DBNAME -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh secret set Azure_Database_Server -b $DBSERVERNAME -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh secret set Azure_Database_Resource_Group -b $RESOURCEGROUPNAME -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh secret set Azure_ACR_Registry -b $ACRNAME -a actions -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo gh variable set Argo_Application -b $APPNAME -R it-minds/$REPONAME >> github-deploy-secrets.sh
echo Service-principal created

#create azure keyvault
echo create Azure keyvault
az keyvault create -n $KVNAME -g $RESOURCEGROUPNAME -l $RESOURCEGROUPLOCATION
echo Azure keyvault created

KVIDENTITYCLIENTID=$(az aks show -g $AKSRESOURCEGROUP -n $AKSNAME --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv)
echo $KVIDENTITYCLIENTID

az keyvault secret set --vault-name $KVNAME --name "Database--Username" --value $DBSERVERADMIN
az keyvault secret set --vault-name $KVNAME --name "Database--Password" --value $DBSERVERPASSWORD

echo Set policy to access keys in your key vault
# Set policy to access keys in your key vault
MSYS_NO_PATHCONV=1 az keyvault set-policy -n $KVNAME --key-permissions get --spn $KVIDENTITYCLIENTID
echo Set policy to access secrets in your key vault
# Set policy to access secrets in your key vault
MSYS_NO_PATHCONV=1 az keyvault set-policy -n $KVNAME --secret-permissions get --spn $KVIDENTITYCLIENTID
echo Set policy to access certs in your key vault
# Set policy to access certs in your key vault
MSYS_NO_PATHCONV=1 az keyvault set-policy -n $KVNAME --certificate-permissions get --spn $KVIDENTITYCLIENTID
echo All policies set

echo Creating application insights
az monitor app-insights component create --app $APPLICATIONINSIHGTSNAME --location $RESOURCEGROUPLOCATION --kind web -g $RESOURCEGROUPNAME --application-type web --retention-time 30
INSTRUMENTATIONKEY=$(az resource show -g $RESOURCEGROUPNAME -n $APPLICATIONINSIHGTSNAME --resource-type "microsoft.insights/components" --query properties.InstrumentationKey -o tsv)
az keyvault secret set --vault-name $KVNAME --name "ApplicationInsights--InstrumentationKey" --value $INSTRUMENTATIONKEY
echo Application insights created

echo Creating variables.libsonnet

cp templates/variables.libsonnet ../K8S/variables.libsonnet
sed -i 's/<client-id>/'$KVIDENTITYCLIENTID'/g' ../K8S/variables.libsonnet
sed -i 's/<key-vault-name>/'$KVNAME'/g' ../K8S/variables.libsonnet
sed -i 's/<tenant-id>/'$AZURETENANTID'/g' ../K8S/variables.libsonnet
sed -i 's/<acr-name>/'$ACRNAME'/g' ../K8S/variables.libsonnet
sed -i 's/<sub-domain>/'$SUBDOMAIN'/g' ../K8S/variables.libsonnet
sed -i 's/<database-server>/'$DBSERVERNAME'/g' ../K8S/variables.libsonnet
sed -i 's/<database-name>/'$DBNAME'/g' ../K8S/variables.libsonnet
echo variables.libsonnet created

echo Creating gitops folder
mkdir $APPNAME
cp templates/gitops/test.jsonnet $APPNAME/test.jsonnet
cp templates/gitops/prs.jsonnet $APPNAME/prs.jsonnet
cp templates/gitops/config.yaml $APPNAME/config.yaml

sed -i 's/<app-name>/'$APPNAME'/g' $APPNAME/test.jsonnet
sed -i 's/<aks-name>/'$AKSNAME'/g' $APPNAME/test.jsonnet
sed -i 's/<repo-name>/'$REPONAME'/g' $APPNAME/test.jsonnet

sed -i 's/<app-name>/'$APPNAME'/g' $APPNAME/prs.jsonnet
sed -i 's/<aks-name>/'$AKSNAME'/g' $APPNAME/prs.jsonnet
sed -i 's/<repo-name>/'$REPONAME'/g' $APPNAME/prs.jsonnet
sed -i 's#<aks-url>#'$AKSURL'#g' $APPNAME/prs.jsonnet

echo Gitops folder done, please commit the folder $APPNAME to our gitops repo

echo Everything done, please follow the final two steps and everything should be running.
echo 1. Please run github-deploy-secrets.sh to set the secrets and variables required in your repo
echo 2. Commit the folder $APPNAME to it-minds/itm_cph_internal_gitops

read
read
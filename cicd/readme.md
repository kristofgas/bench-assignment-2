## Initial deployment

To deploy and run the project on our internal kubernetes cluster we need to setup the nessecary Azure resouces to support this.

### prerequisites

1. Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
2. Install [GitHub CLI](https://cli.github.com/)

### Azure setup 
> This set will setup an Azure resource group with the following content:
> - Azure SQL Server
> - Azure SQL Database
> - Azure Key Vault
> - Azure Container Registry
> - Azure Application Insights
> 
> Furthermore it will create and setup:
>  - An App Registration in Microsoft Entra to allow GitHub to push images to the Azure Container Registry and clone database for PR's.
>  -  Attaching the Azure Container Registry to our Azure Kubernetes Services to allow the cluster to pull images from the Azure Container Registry
>  - A GitHub CLI script containing all secrets and variables needed for the GitHub workflows to run.
>  - GitOps folder containing everything needed for ArgoCD to handle deployments of the application.
1. Ensure you have granted yourself **Subscription / project admin** through [PIM](https://aka.ms/pim)
2. Edit **azure-project-setup.sh**
Update **REPONAME** with the name of the GitHub repository without our organization name.
Update   **KVNAME** with a globally unique name of the Key Vault to be created with a maximum length of 24 characters.
3. Run **azure-project-setup.sh** and wait for it to finish.
4. Check the console output and ensure everything has succeed.

> If anything failed
> 1. Delete the Resource Group, the App Registration and purge the deleted Key Vault after the Resource Group is deleted.
> 2. Delete **github-deploy-secrets.sh**
> 2. Fix the error if it's not just Azure acting up.
> 3. Rerun **azure-project-setup.sh**

5.  The script **github-deploy-secrets.sh** is created by **azure-project-setup.sh** in the same folder, run it to set up the secrets and variables needed for the GitHub workflows.
	> If this fails you can open the file to read the secrets and manually set them up.
6. A new folder named after your repository where **_** is replaced by **-** is created by **azure-project-setup.sh**, commit and push the folder into to the **argocd** folder on the GitOps repo [itm_cph_internal_gitops](https://github.com/it-minds/itm_cph_internal_gitops/tree/main)
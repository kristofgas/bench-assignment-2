{
    domain: 'it-minds.reviews',
    subdomain:'<sub-domain>',
    acr: '<acr-name>.azurecr.io',
    backend: {
        naming: 'api',
        imagename: 'be' 
    },
    frontend: {
        naming: 'app',
        imagename: 'fe',
    },
    keyvault: {
        clientid:'<client-id>',
        name:'<key-vault-name>',
        tenantid:'<tenant-id>',
    },
    database: {
        server:'<database-server>',
        name:'<database-name>',
    }
}
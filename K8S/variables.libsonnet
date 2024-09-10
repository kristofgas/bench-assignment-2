{
    domain: 'it-minds.reviews',
    subdomain:'cph-template-test',
    acr: 'cphtemplatetestacr.azurecr.io',
    backend: {
        naming: 'api',
        imagename: 'be' 
    },
    frontend: {
        naming: 'app',
        imagename: 'fe',
    },
    keyvault: {
        clientid:'efdc57fb-2847-4b58-8ba5-f76ce7a16d3b',
        name:'cph-template-test-kv',
        tenantid:'9c5bd6eb-62ce-4a2d-97c6-0acc1ccfec55',
    },
    database: {
        server:'cph-template-test-dbserver',
        name:'cph-template-test-db',
    }
}
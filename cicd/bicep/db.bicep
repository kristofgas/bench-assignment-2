param dbName string
param dbServerName string
param location string = resourceGroup().location


resource dbServer 'Microsoft.Sql/servers@2022-11-01-preview'  existing = {
  name: dbServerName
}


resource db 'Microsoft.Sql/servers/databases@2022-11-01-preview' = {
  name: dbName
  location: location
  parent: dbServer
  sku: {
    capacity: 10
    name: 'Standard'
    tier: 'Standard'
  }
}

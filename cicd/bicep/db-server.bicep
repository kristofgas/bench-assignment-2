param serverName string
param administratorLogin string
@secure()
param administratorLoginPassword string
param location string = resourceGroup().location

resource dbServer 'Microsoft.Sql/servers@2022-11-01-preview'  = {
  name: serverName
  location: location
  properties: {
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
  }
}

resource SQLAllowAllWindowsAzureIps 'Microsoft.Sql/servers/firewallRules@2022-11-01-preview' = {
  name: 'AllowAllWindowsAzureIps'
  parent: dbServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}


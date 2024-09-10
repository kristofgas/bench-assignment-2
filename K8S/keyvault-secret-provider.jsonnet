local variables = import "./variables.libsonnet";
local secrets = import "./secrets.libsonnet";


local objectsString = 'array:\n  - |' + std.join('  - |', std.map(function(secret) '\n    objectName: '+secret.objectName+'\n    objectType: '+secret.objectType+'              \n    objectVersion: ""              \n',secrets));

[
  {
    apiVersion: 'secrets-store.csi.x-k8s.io/v1',
    kind: 'SecretProviderClass',
    metadata: {
      name: std.extVar('releaseName') + '-keyvault-secret-provider',
    },
    spec: {
      provider: 'azure',
      parameters: {
        usePodIdentity: 'false',
        useVMManagedIdentity: 'true',
        userAssignedIdentityID: variables.keyvault.clientid,
        keyvaultName: variables.keyvault.name,
        cloudName: '',
        objects: objectsString,
        tenantId: variables.keyvault.tenantid,
      },
      secretObjects: std.map(function(secret){        
          secretName: secret.objectName,
          type: 'Opaque',
          data: [
            {
              objectName: secret.objectName,
              key: secret.objectName + 'key',
            },
          ],
      }, secrets)
    },
  },
]
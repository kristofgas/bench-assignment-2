#Everything must be lowercase in this file (Keyvault is case insensitive)
#Everything will be converted to uppercase and '-' will be replaced with '_' as backend env vars

[
    {
        objectName: 'database--username',
        objectType: 'secret',            # object types: secret, key, or cert
        objectVersion: '',              # [OPTIONAL] object versions, default to latest if empty
    },
    {
        objectName: 'database--password',
        objectType: 'secret',            # object types: secret, key, or cert
        objectVersion: '',              # [OPTIONAL] object versions, default to latest if empty
    },
    {
        objectName: 'applicationinsights--instrumentationkey',
        objectType: 'secret',            # object types: secret, key, or cert
        objectVersion: '',              # [OPTIONAL] object versions, default to latest if empty
    },
    // {
    //     objectName: 'key1',
    //     objectType: 'key',
    //     objectVersion: '',
    // },
]
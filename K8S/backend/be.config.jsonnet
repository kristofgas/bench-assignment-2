local variables = import "../variables.libsonnet";

{
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: std.extVar("releaseName") + "-" + variables.backend.naming + "-config",
  },
  data: {
    'Database.Name': if std.extVar("releaseName") == 'test' then variables.database.name else std.extVar("releaseName") + '-' + variables.database.name,
    'Database.Server': 'tcp:'+variables.database.server + '.database.windows.net,1433',
    'AllowedOrigins0': 'https://' + std.extVar('releaseName') + '-' + variables.frontend.naming + '.' + variables.subdomain + '.' + variables.domain,
  },
}


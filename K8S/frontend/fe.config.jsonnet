local variables = import "../variables.libsonnet";

{
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: std.extVar("releaseName") + "-" + variables.frontend.naming + "-config",
  },
  data: {
    'BackendUrl': 'https://' + std.extVar('releaseName') + '-' + variables.backend.naming + '.' + variables.subdomain + '.' + variables.domain,
    'ReactAppEnvironment': 'PROD',
    'Port': '80',
  },
}


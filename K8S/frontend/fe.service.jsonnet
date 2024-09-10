local variables = import "../variables.libsonnet";

{
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: std.extVar('releaseName') + '-'+ variables.frontend.naming + '-service',
  },
  spec: {
    type: 'ClusterIP',
    selector: {
      app: std.extVar('releaseName') + '-' + variables.frontend.naming,
    },
    ports: [
      {
        protocol: 'TCP',
        port: 80,
        targetPort: 80,
      },
    ],
  },
}
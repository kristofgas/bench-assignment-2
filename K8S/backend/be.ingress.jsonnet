local variables = import "../variables.libsonnet";

{
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: std.extVar('releaseName') + '-' + variables.backend.naming + '-ingress',
      annotations: {
        'nginx.ingress.kubernetes.io/rewrite-target': '/',
        'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
      },
    },
    spec: {
      ingressClassName: 'nginx',
      tls: [
        {
          hosts: [
            std.extVar('releaseName') + '-' + variables.backend.naming + '.' + variables.subdomain + '.' + variables.domain,
          ],
          secretName: std.extVar('releaseName') + '-' + variables.backend.naming + '-' + variables.subdomain + '-' + variables.domain + '-tls',
        },
      ],
      rules: [
        {
          host: std.extVar('releaseName') + '-' + variables.backend.naming + '.' + variables.subdomain + '.' + variables.domain,
          http: {
            paths: [
              {
                path: '/',
                pathType: 'Prefix',
                backend: {
                  service: {
                    name: std.extVar('releaseName') + '-' + variables.backend.naming + '-service',
                    port: {
                      number: 80,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  }
[
  {
    apiVersion: 'argoproj.io/v1alpha1',
    kind: 'Application',
    metadata: {
      finalizers: [
        'resources-finalizer.argocd.argoproj.io',
      ],
      name: '<app-name>',
      namespace: 'argocd',
      annotations: {
        'notifications.argoproj.io/subscribe.on-deployed.slack': 'client_<app-name>',
      },
    },
    spec: {
      destination: {
        name: '<aks-name>',
        namespace: '<app-name>',
      },
      project: 'default',
      source: {
        directory: {
          recurse: true,
          include: '*.jsonnet',
          jsonnet: {
            extVars: [
              {
                name: 'tags',
                value: std.get(std.parseYaml(importstr './config.yaml'), 'test'),
              },
              {
                name: 'releaseName',
                value: "test"
              },
            ],
          },
        },
        repoURL: 'git@github.com:it-minds/<repo-name>.git',
        path: 'K8S/',
        targetRevision: 'HEAD',
      },
      syncPolicy: {
        syncOptions: [
          'CreateNamespace=true'
        ],
        retry: {
        },
        automated: {
        },
      },
    },
  },
]
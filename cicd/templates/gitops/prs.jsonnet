[
  {
    apiVersion: 'argoproj.io/v1alpha1',
    kind: 'ApplicationSet',
    metadata: {
      name: '<app-name>-prs',
      namespace: 'argocd'
    },
    spec:{      
      goTemplate: true,
      generators: [
          {
            matrix: {
              generators: [
                {                  
                  list: {
                    elements: [
                      {
                        cluster: '<aks-name>',
                        url: '<aks-url>',
                      },
                    ],
                  },           
                },
                {
                  pullRequest: {
                    github: {
                      owner: 'it-minds',
                      repo: '<repo-name>',
                      tokenRef: {
                        secretName: 'github-token',
                        key: 'token'
                      }
                    },
                    requeueAfterSeconds: 60,
                  },
                },
              ]
            }
          }
        ],
      template: {
        metadata: {
          name: '<app-name>-pr-{{.number}}',
          labels:{
            pr: '{{.number}}',
          },
          annotations: {
            'notifications.argoproj.io/subscribe.on-pr-deployed.slack': 'client_<app-name>',
          },
        },
        spec: {
          destination: {
            name: '<aks-name>',
            namespace: '<app-name>-prs',
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
                    value: '{{.head_sha}}',
                  },
                  {
                    name: 'releaseName',
                    value: 'pr-{{.number}}',
                  },
                ],
              },
            },
            repoURL: 'git@github.com:it-minds/<repo-name>.git',
            path: 'K8S/',
            targetRevision: '{{.head_sha}}',
          },
          syncPolicy: {
            automated: {
              prune: true,
            },
            syncOptions: [
              'CreateNamespace=true',
            ],
          },
        }
      }
    }
  },
]
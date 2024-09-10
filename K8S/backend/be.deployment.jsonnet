local variables = import "../variables.libsonnet";
local secrets = import "./secrets.libsonnet";

local secretsEnv = std.map(function(secret){        
          name: std.asciiUpper(std.strReplace(secret.objectName, '-', '_')),
          valueFrom: {
            secretKeyRef: {
              name: secret.objectName,
              key: secret.objectName + 'key',
            }
          },
      }, secrets);

{
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: std.extVar('releaseName') + '-' + variables.backend.naming + '-deployment',
      labels: {
        app: std.extVar('releaseName') + '-' + variables.backend.naming,
      },
    },
    spec: {
      replicas: 2,
      revisionHistoryLimit: 3,
      selector: {
        matchLabels: {
          app: std.extVar('releaseName') + '-' + variables.backend.naming,
        },
      },
      template: {
        metadata: {
          labels: {
            app: std.extVar('releaseName') + '-' + variables.backend.naming,
          },
        },
        spec: {
          tolerations: [
            {
              effect: 'NoSchedule',
              key: 'kubernetes.azure.com/scalesetpriority',
              operator: 'Equal',
              value: 'spot',
            },
          ],
          affinity: {
            nodeAffinity: {
              preferredDuringSchedulingIgnoredDuringExecution: [
                {
                  weight: 1,
                  preference: {
                    matchExpressions: [
                      {
                        key: 'kubernetes.azure.com/scalesetpriority',
                        operator: 'In',
                        values: [
                          'spot',
                        ],
                      },
                    ],
                  },
                }
              ],
            },
          },
          containers: [
            {
              name: std.extVar('releaseName') + '-' + variables.backend.naming,
              image: variables.acr + '/'+ std.extVar('releaseName') +'/'+ variables.backend.imagename + ':' + std.extVar('tags'),
              imagePullPolicy: 'IfNotPresent',
              resources: {
                requests: {
                    memory: '300Mi',
                    cpu: '100m',
                },
                limits: {
                    memory: '800Mi',
                    cpu: '500m',
                },
              },
              readinessProbe: {
                httpGet: {
                  path: '/health',
                  port: 80,
                },
                initialDelaySeconds: 30,
                periodSeconds: 30,
                failureThreshold: 3,
                successThreshold: 1
              },
              ports: [
                {
                  containerPort: 80,
                },
              ],
              volumeMounts: [
                {
                  name: std.extVar('releaseName') + '-secrets-store-inline',
                  mountPath: '/mnt/secrets-store',
                  readOnly: true,
                },
              ],
              env: std.setUnion([
                {
                  name: 'DATABASE__NAME',
                  valueFrom: {
                    configMapKeyRef: {
                      name: std.extVar('releaseName') + '-' + variables.backend.naming + '-config',
                      key: 'Database.Name',
                    },
                  },
                },
                {
                  name: 'DATABASE__SERVER',
                  valueFrom: {
                    configMapKeyRef: {
                      name: std.extVar('releaseName') + '-' + variables.backend.naming + '-config',
                      key: 'Database.Server',
                    },
                  },
                },
                {
                  name: 'ALLOWEDORIGINS__0',
                  valueFrom: {
                    configMapKeyRef: {
                      name: std.extVar('releaseName') + '-' + variables.backend.naming + '-config',
                      key: 'AllowedOrigins0',
                    },
                  },
                },
              ], secretsEnv,keyF=function(x) x.name),
            },
          ],
          volumes: [
            {
              name: std.extVar('releaseName') + '-secrets-store-inline',
              csi: {
                driver: 'secrets-store.csi.k8s.io',
                readOnly: true,
                volumeAttributes: {
                  secretProviderClass: std.extVar('releaseName') + '-keyvault-secret-provider',
                },
              },
            },
          ],
        },
      },
    },
  }
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
        name: std.extVar('releaseName') + '-' + variables.frontend.naming  + '-deployment',
        labels: {
            app: std.extVar('releaseName') + '-' + variables.frontend.naming,
        },
    },
    spec: {
    replicas: 2,
    revisionHistoryLimit: 3,
    selector: {
        matchLabels: {
            app: std.extVar('releaseName') + '-' + variables.frontend.naming,
        },
    },
    template: {
      metadata: {
          labels: {
              app: std.extVar('releaseName') + '-' + variables.frontend.naming,
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
          name: std.extVar('releaseName') + '-' + variables.frontend.naming,
          image: variables.acr + '/'+ std.extVar('releaseName') + '/' + variables.frontend.imagename + ':' + std.extVar('tags'),
          imagePullPolicy: 'IfNotPresent',
          resources: {
              requests: {
                  memory: '200Mi',
                  cpu: '100m',
              },
              limits: {
                  memory: '600Mi',
                  cpu: '500m',
              },
          },
          readinessProbe: {
              httpGet: {
                  path: '/manifest.json',
                  port: 80,
              },
              periodSeconds: 30,
              initialDelaySeconds: 30,
              failureThreshold: 3,
              successThreshold: 1
          },
          ports: [
              {
                containerPort: 80
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
                  name: 'REACT_APP_ENVIRONMENT',
                  valueFrom: {
                      configMapKeyRef: {
                          name: std.extVar('releaseName') + '-' + variables.frontend.naming + '-config',
                          key: 'ReactAppEnvironment',
                      },
                  },
              },
              {
                  name: 'backendurl',
                  valueFrom: {
                      configMapKeyRef: {
                          name: std.extVar('releaseName') + '-' + variables.frontend.naming + '-config',
                          key: 'BackendUrl',
                      },
                  },
              },
              {
                  name: 'PORT',
                  valueFrom: {
                      configMapKeyRef: {
                          name: std.extVar('releaseName') + '-' + variables.frontend.naming + '-config',
                          key: 'Port',
                      },
                  },
              },
            ], secretsEnv,keyF=function(x) x.name)
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
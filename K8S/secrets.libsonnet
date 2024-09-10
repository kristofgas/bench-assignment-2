local frontendSecrets = import "./frontend/secrets.libsonnet";
local backendSecrets = import "./backend/secrets.libsonnet";

local secrets = std.setUnion(frontendSecrets, backendSecrets);

secrets
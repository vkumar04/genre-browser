import { defineRailway, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "genre-browser";
export default defineRailway(() => {
  const genreBrowser = service("genre-browser", {
    build: { buildCommand: "npm run build", buildEnvironment: "V3", builder: "RAILPACK" },
    start: "npm start",
    healthcheck: "/",
    replicas: { "us-east4-eqdc4a": 1 },
  });

  return project("genre-browser", {
    variables: { managed: true },
    resources: [genreBrowser],
  });
});

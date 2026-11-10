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
    env: {
      // Absolute site URL for canonical, og:image and sitemap (see seo/vite-plugin-seo.ts).
      // Railway reference variable: resolves to this service's public domain.
      SITE_URL: "https://${{RAILWAY_PUBLIC_DOMAIN}}",
    },
    replicas: { "us-east4-eqdc4a": 1 },
  });

  return project("genre-browser", {
    variables: { managed: true },
    resources: [genreBrowser],
  });
});

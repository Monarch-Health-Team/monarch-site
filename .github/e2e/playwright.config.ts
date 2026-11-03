// Base QA browser checks (the part fix rounds cannot change). Run by `qa.sh e2e`, which copies this
// folder from the trusted .github (main's copy in Claude-loop runs) to $RUNNER_TEMP, installs
// @playwright/test there and points QA_REPO_ROOT at the checked-out app.
import path from "node:path";
import { defineConfig } from "@playwright/test";
import { OUT, REPO_ROOT } from "./lib";

const port = Number(process.env.QA_E2E_PORT || 3300);
const external = process.env.QA_E2E_BASE_URL; // test an already-running server instead
const baseURL = external || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: __dirname,
  testMatch: /.*\.spec\.ts$/,
  testIgnore: ["**/issues/**"], // per-issue specs run separately (playwright.issues.config.ts)
  globalSetup: path.join(__dirname, "global-setup.ts"),
  timeout: 180_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: Number(process.env.QA_E2E_WORKERS || 2),
  retries: 0,
  reporter: [["list"], ["json", { outputFile: path.join(OUT, "results.json") }]],
  outputDir: path.join(OUT, "test-results"),
  use: {
    baseURL,
    browserName: "chromium",
    channel: process.env.QA_E2E_CHANNEL || undefined, // e.g. "chrome" to use the runner's Chrome
    trace: "off",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
    // Stable text rendering, so Argos diffs show real changes, not anti-aliasing noise.
    launchOptions: { args: ["--disable-lcd-text", "--font-render-hinting=none"] },
  },
  webServer: external
    ? undefined
    : {
        command: process.env.QA_E2E_SERVER_CMD || `npx --no-install next start -H 127.0.0.1 -p ${port}`,
        cwd: REPO_ROOT,
        url: baseURL,
        timeout: 90_000,
        reuseExistingServer: false,
        stdout: "ignore",
        stderr: "pipe",
      },
});

// Per-issue acceptance tests that Claude writes during a build (.qa/issues/issue-<N>.spec.ts in the
// repo). qa.sh copies them into ./issues next to this file and runs them in a SEPARATE Playwright
// process AFTER the base checks have been scored, so nothing in an issue spec can change the base
// result. Every spec runs twice: desktop (1280x900) and mobile (375x812, touch).
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { OUT, REPO_ROOT } from "./lib";

const port = Number(process.env.QA_E2E_PORT || 3300);
const external = process.env.QA_E2E_BASE_URL;
const baseURL = external || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: path.join(__dirname, "issues"),
  testMatch: /.*\.spec\.ts$/,
  timeout: 60_000,
  expect: { timeout: 7_000 },
  workers: Number(process.env.QA_E2E_WORKERS || 2),
  retries: 1, // one retry so a single flaky step doesn't cost a Claude fix round
  reporter: [["list"], ["json", { outputFile: path.join(OUT, "results.json") }]],
  outputDir: path.join(OUT, "test-results"),
  use: {
    baseURL,
    channel: process.env.QA_E2E_CHANNEL || undefined,
    screenshot: "on", // end-of-test screenshot per test; qa.sh copies them to issue-screenshots/
    trace: "off",
    serviceWorkers: "block",
    launchOptions: { args: ["--disable-lcd-text", "--font-render-hinting=none"] },
  },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium", viewport: { width: 375, height: 812 } } },
  ],
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

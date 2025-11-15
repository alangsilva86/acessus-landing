import { spawnSync } from "node:child_process";

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const isVercel = process.env.VERCEL === "1";

if (isVercel) {
  console.log("[build] Detected Vercel environment, skipping server bundle.");
  run("pnpm", ["run", "build:client"]);
} else {
  console.log("[build] Running full build (client + server).");
  run("pnpm", ["run", "build:client"]);
  run("pnpm", ["run", "build:server"]);
}

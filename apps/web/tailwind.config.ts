import type { Config } from "tailwindcss";
// @ts-expect-error - internal package lacks declaration mapping
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./app/**/*.tsx",
    "./components/**/*.tsx",
    "../../packages/ui/src/**/*.tsx",
  ],
  presets: [sharedConfig],
};

export default config;

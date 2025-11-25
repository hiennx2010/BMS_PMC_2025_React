import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

export default ({ mode }) => {
  // Lấy file .env theo mode
  const envFile = path.resolve(
    process.cwd(),
    "config",
    mode ? `.env.${mode}` : ".env"
  );
  const parsed = dotenv.config({ path: envFile }).parsed || {};

  // Chuyển biến môi trường thành define cho Vite
  const defineEnv = Object.fromEntries(
    Object.entries(parsed).map(([k, v]) => {
      const key = k.startsWith("VITE_")
        ? `import.meta.env.${k}`
        : `import.meta.env.VITE_${k}`;
      return [key, JSON.stringify(v)];
    })
  );

  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
    ],
    define: {
      ...defineEnv,
    },
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"), // alias @ -> src
        components: path.resolve(process.cwd(), "src/components"),
        sections: path.resolve(process.cwd(), "src/sections"),
        themes: path.resolve(process.cwd(), "src/themes"),
        routes: path.resolve(process.cwd(), "src/routes"),
        hooks: path.resolve(process.cwd(), "src/hooks"),
        layout: path.resolve(process.cwd(), "src/layout"),
        pages: path.resolve(process.cwd(), "src/pages"),
        utils: path.resolve(process.cwd(), "src/utils"),
        data: path.resolve(process.cwd(), "src/data"),
        contexts: path.resolve(process.cwd(), "src/contexts"),
        api: path.resolve(process.cwd(), "src/api"),
        config: path.resolve(process.cwd(), "src/config"),
        "menu-items": path.resolve(process.cwd(), "src/menu-items"),
        assets: path.resolve(process.cwd(), "src/assets"),
      },
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  });
};

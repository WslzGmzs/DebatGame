// Deno Deploy静态文件服务器
// 用于部署React构建后的静态文件

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";

const PORT = parseInt(Deno.env.get("PORT") || "8000");

console.log(`🚀 辩论游戏静态服务器启动在端口 ${PORT}`);

serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // 处理根路径
  if (pathname === "/") {
    return serveDir(req, {
      fsRoot: "./dist",
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });
  }

  // 处理静态文件
  if (pathname.startsWith("/assets/") || 
      pathname.startsWith("/config/") ||
      pathname.endsWith(".js") ||
      pathname.endsWith(".css") ||
      pathname.endsWith(".json") ||
      pathname.endsWith(".ico") ||
      pathname.endsWith(".png") ||
      pathname.endsWith(".svg")) {
    return serveDir(req, {
      fsRoot: "./dist",
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });
  }

  // SPA路由处理 - 所有其他路径都返回index.html
  try {
    const indexFile = await Deno.readFile("./dist/index.html");
    return new Response(indexFile, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error serving index.html:", error);
    return new Response("File not found", { status: 404 });
  }
}, { port: PORT });

// Deno Deploy 静态文件服务器
// 用于部署 React 构建后的静态文件

const PORT = parseInt(Deno.env.get("PORT") || "8000");

console.log(`🚀 AI辩论游戏服务器启动在端口 ${PORT}`);

// 简化的文件服务函数
async function serveStaticFile(filePath: string): Promise<Response> {
  try {
    const file = await Deno.readFile(filePath);
    const ext = filePath.split('.').pop()?.toLowerCase();

    let contentType = "text/plain";
    switch (ext) {
      case "html":
        contentType = "text/html; charset=utf-8";
        break;
      case "js":
        contentType = "application/javascript";
        break;
      case "css":
        contentType = "text/css";
        break;
      case "json":
        contentType = "application/json";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "svg":
        contentType = "image/svg+xml";
        break;
      case "ico":
        contentType = "image/x-icon";
        break;
    }

    return new Response(file, {
      headers: {
        "content-type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error(`Error serving file ${filePath}:`, error);
    return new Response("File not found", { status: 404 });
  }
}

// 主服务器处理函数
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let pathname = url.pathname;

  console.log(`📥 请求: ${req.method} ${pathname}`);

  // 处理 OPTIONS 请求（CORS 预检）
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // 处理根路径
  if (pathname === "/") {
    pathname = "/index.html";
  }

  // 构建文件路径
  let filePath = `./dist${pathname}`;

  // 检查文件是否存在
  try {
    const stat = await Deno.stat(filePath);
    if (stat.isFile) {
      console.log(`✅ 找到文件: ${filePath}`);
      return await serveStaticFile(filePath);
    }
  } catch (error) {
    console.log(`❌ 文件不存在: ${filePath}, 错误: ${error.message}`);

    // 对于 API 请求，返回 JSON 错误
    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "API endpoint not found" }), {
        status: 404,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 对于其他请求，返回 index.html（SPA 路由处理）
    console.log(`🔄 返回 index.html 用于 SPA 路由`);
    return await serveStaticFile("./dist/index.html");
  }

  // 默认返回 index.html（SPA 路由处理）
  return await serveStaticFile("./dist/index.html");
}

// 启动服务器
Deno.serve({ port: PORT }, handler);

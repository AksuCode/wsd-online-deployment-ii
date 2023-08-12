import { serve } from "https://deno.land/std@0.171.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.0.0/mod.ts";
import * as messageService from "./services/messageService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`-`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

let id = 0;

const addMessage = async (request) => {
  const formDat = await request.formData();
  await messageService.create(id, formDat.get("sender"), formDat.get("message"));
  id++;
}

const handleRequest = async (request) => {
  
  const method = request.method;
  const url = new URL(request.url);
  const path = url.pathname;

  if (method === "GET" && path === "/") {

    const data = {
      messages: await messageService.lastFive(),
    }

    return new Response(await renderFile("index.eta", data), responseDetails);
  }

  else if (method === "POST" && path === "/") {
    await addMessage(request);

    return redirectTo("/");
  }

  else {
    return redirectTo("/");
  }

};

serve(handleRequest, { port: 7777 });
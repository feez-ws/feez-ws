import http from "node:http";
import path from "node:path";
import ds from "@stormkit/serverless/datastore";
import { readBody, send } from "~/helpers/api/http";
import { WAITING_LIST } from "~/helpers/api/collections";

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const { email } = await readBody<{ email?: string }>(req);
    const records = await ds.store(WAITING_LIST, { email });
    send(res, { records });
  } catch (response: unknown) {
    if (
      response instanceof http.IncomingMessage &&
      response.statusCode === 409
    ) {
      res.statusCode = 409;
      send(res, { error: "duplicate" });
    } else {
      console.error(response);
      res.statusCode = 500;
      send(res, { error: "unknown" });
    }
  }
};

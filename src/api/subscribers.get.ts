import type http from "node:http";
import ds from "@stormkit/serverless/datastore";
import { send } from "~/helpers/api/http";
import { WAITING_LIST } from "~/helpers/api/collections";

export default async (_: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const count = await ds.fetchCount(WAITING_LIST);
    send(res, { count });
  } catch (response: unknown) {
    console.error(response);
    res.statusCode = 500;
    send(res, { error: "unknown" });
  }
};

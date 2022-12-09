import http from "node:http";
import ds from "@stormkit/serverless/datastore";
import { readBody, send } from "~/helpers/api/http";
import { WAITING_LIST } from "~/helpers/api/collections";

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const { email } = await readBody<{ email?: string }>(req);

  try {
    const records = await ds.store(WAITING_LIST, { email });
    send(res, { records });
  } catch ({ response }) {
    // @ts-ignore
    if (response.status === 409) {
      res.statusCode = 409;
      send(res, { error: "duplicate" });
    } else {
      console.log(response);
      send(res, { error: "unknown" });
    }
  }
};

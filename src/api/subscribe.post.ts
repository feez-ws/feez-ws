import http from "node:http";
import ds from "@stormkit/serverless/datastore";
import { readBody, send } from "~/helpers/api/http";
import { WAITING_LIST } from "~/helpers/api/collections";

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log("parsing request");

  const { email } = (await readBody<{ email?: string }>(req)) || {};

  console.log("request parsed:", email);

  try {
    console.log("storing data");
    const records = await ds.store(WAITING_LIST, { email });
    console.log("data store complete");
    send(res, { records });
  } catch (response: unknown) {
    if (
      response instanceof http.IncomingMessage &&
      response.statusCode === 409
    ) {
      res.statusCode = 409;
      send(res, { error: "duplicate" });
    } else {
      console.log(response);
      send(res, { error: "unknown" });
    }
  }
};

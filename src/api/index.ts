import type { IncomingMessage, ServerResponse } from "node:http";
import { send } from "~/helpers/api/http";

export default (_: IncomingMessage, res: ServerResponse) => {
  send(res, { status: "running" });
};

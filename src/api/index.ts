import type { Request, Response } from "~/helpers/api/http";
import http from "~/helpers/api/http";

export default http((_: Request, res: Response) => {
  res.send({ status: "running" });
});

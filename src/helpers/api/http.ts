import * as http from "node:http";

type ServerlessFn = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => void;

export interface Response extends http.ServerResponse {
  send(data: Object | string | number): void;
}

export interface Request extends http.IncomingMessage {}

// TODO (SK): This could be a helper
export default (fn: (req: Request, res: Response) => void): ServerlessFn => {
  return (req, res) => {
    const extendedRes = res as Response;
    extendedRes.send = (data: Object | string | number) => {
      let content: string;

      if (typeof data === "object") {
        content = JSON.stringify(data);
        res.setHeader("Content-Type", "application/json");
      } else {
        content = data.toString();
        res.setHeader("Content-Type", "text/html");
      }

      res.write(content);
      res.end();
    };

    fn(req, extendedRes);
  };
};

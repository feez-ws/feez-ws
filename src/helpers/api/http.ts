import * as http from "node:http";

export const readBody = <T>(req: http.IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    const data: Buffer[] = [];

    if (req.method?.toUpperCase() === "GET" || !req.method) {
      return resolve({} as T);
    }

    req
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (chunk) => {
        data.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.isBuffer(data) ? Buffer.concat(data) : data;
        const isUrlEncoded =
          req.headers["content-type"] === "application/x-www-form-urlencoded";

        if (isUrlEncoded) {
          return resolve(
            Object.fromEntries(new URLSearchParams(body.toString("utf-8"))) as T
          );
        }

        return resolve(JSON.parse(body.toString("utf-8")));
      });
  });
};

// TODO (SK): This could be a helper
export const send = (
  res: http.ServerResponse,
  data: Object | string | number
) => {
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

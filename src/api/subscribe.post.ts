import http from "~/helpers/api/http";

export default http((_, res) => {
  res.send({ Hello: "World" });
});

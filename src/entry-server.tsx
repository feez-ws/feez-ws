interface RenderReturn {
  status: number;
  content: string;
  head: string;
}

export const render = async (url: string): Promise<RenderReturn> => {
  return {
    status: 200,
    content: "<div>Hello world</div>",
    head: "<title>Hello world</title>",
  };
};

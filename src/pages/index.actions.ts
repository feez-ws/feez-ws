interface SubscribeUserProps {
  email: string;
}

export const subscribeUser = ({ email }: SubscribeUserProps) => {
  return fetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

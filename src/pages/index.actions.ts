import { useEffect, useState } from "react";

interface SubscribeUserProps {
  email: string;
}

export const subscribeUser = ({ email }: SubscribeUserProps) => {
  return fetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

interface NumberOfSubscribersReturnValue {
  count: number;
  loading: boolean;
  error?: string;
}

export const useFetchNumberOfSubscribers =
  (): NumberOfSubscribersReturnValue => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [count, setCount] = useState(0);

    useEffect(() => {
      fetch("/api/subscribers", {
        method: "GET",
      })
        .then(async (res) => {
          const data: { count: number; collectioName: string } =
            await res.json();

          setCount(data.count);
        })
        .catch(() => {
          setError(
            "Something went wrong while fetching number of subscribers."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }, []);

    return { loading, error, count };
  };

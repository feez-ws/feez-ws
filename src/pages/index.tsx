import { FormEvent, useState } from "react";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Header, Footer } from "~/components/Layout";
import { useAutoFocus } from "~/helpers/effects/input";
import { subscribeUser } from "./index.actions";

const Home: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useAutoFocus("#subscription-field");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    subscribeUser({ email })
      .then(async (res) => {
        const data = await res.json();

        if (data.error === "duplicate") {
          setError("Looks like you're already on the waiting list.");
        } else {
          setSuccess("Perfect! You'll be notified when Feez is ready.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="flex flex-col w-full">
      <Header />
      <section className="flex-grow p-4">
        <div className="max-w-screen-lg m-auto flex flex-col items-center justify-center h-full">
          <h1 className="mb-2">Track your progress in public</h1>
          <h2 className="mb-12 text-xl">
            Create goals, measure your progress and share the steps to success
            with your audience.
          </h2>
          <form onSubmit={handleSubmit} className="w-full max-w-lg text-center">
            <TextField
              label="Be notified when the app is ready"
              type="email"
              variant="filled"
              placeholder="your@email.com"
              fullWidth
              id="subscription-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="my-4">
              <LoadingButton variant="contained" loading={loading}>
                Subscribe
              </LoadingButton>
            </div>
          </form>
          {success && <div>{success}</div>}
          {error && <div>{error}</div>}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;

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
      <section className="flex-grow px-4">
        <div className="max-w-screen-lg m-auto flex flex-col h-full items-center justify-center">
          <h1 className="flex flex-grow items-center my-8 md:my-4 text-center text-2xl md:text-5xl font-bold">
            Track your progress in public
          </h1>
          <div className="flex flex-col flex-grow items-center justify-center bg-indigo-900 bg-opacity-60 p-4 md:p-8 w-full rounded-lg">
            <h2 className="mb-8 text-lg md:text-xl text-center">
              Create goals, measure your progress
              <br /> and share the steps to success with your audience.
            </h2>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg text-center"
            >
              <TextField
                label="Be notified when the app is ready"
                type="email"
                variant="filled"
                placeholder="your@email.com"
                fullWidth
                id="subscription-field"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mt-4">
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Subscribe
                </LoadingButton>
              </div>
            </form>
            {success && <div>{success}</div>}
            {error && <div>{error}</div>}
          </div>
          <div className="flex-grow mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:mr-4 mb-8 md:mb-0">
                <div>
                  <h3 className="font-bold mb-2 md:mb-4 mr-8">1. Set goals</h3>
                  <p>
                    Define daily, weekly, monthly, quarterly or yearly goals.
                  </p>
                </div>
              </div>
              <div className="md:mr-4 mb-8 md:mb-0">
                <h3 className="font-bold mb-2 md:mb-4 mr-8">
                  2. Provide updates
                </h3>
                <p>
                  Update metrics either through our API or manually from the UI.
                </p>
              </div>
              <div className="mb-8 md:mb-0">
                <h3 className="font-bold mb-2 md:mb-4">
                  3. Share with your audience
                </h3>
                <p>
                  Describe the steps to success and grow your audience even
                  more!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;

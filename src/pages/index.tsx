import { FormEvent, useState } from "react";
import cn from "classnames";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Header, Footer } from "~/components/Layout";
import { useAutoFocus } from "~/helpers/effects/input";
import howToStep1 from "~/assets/how-to-step-1.svg";
import howToStep2 from "~/assets/how-to-step-2.svg";
import howToStep3 from "~/assets/how-to-step-3.svg";
import { subscribeUser, useFetchNumberOfSubscribers } from "./index.actions";

interface StepDescriptionProps {
  title: string;
  src: string;
  children: React.ReactNode;
  inverted?: boolean;
}

const StepDescription: React.FC<StepDescriptionProps> = ({
  title,
  children,
  inverted,
  src,
}) => {
  return (
    <div
      className={cn("flex flex-col-reverse mb-12 md:mb-24", {
        "md:flex-row": !inverted,
        "md:flex-row-reverse": inverted,
      })}
    >
      <div className="flex flex-1 border-indigo-900 border rounded-sm p-4 shadow-lg">
        <img src={src} alt={title} />
      </div>
      <div
        className={cn("flex-1 mb-12 md:mb-0 text-lg", {
          "md:ml-24": !inverted,
          "md:mr-24": inverted,
        })}
      >
        <h3 className="font-bold mb-2 md:mb-4 text-4xl">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const subscribers = useFetchNumberOfSubscribers();

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
          <h1 className="flex flex-grow items-center my-8 md:my-24 text-center text-2xl md:text-5xl font-bold">
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
              <div className="text-xs mt-4" data-nosnippet>
                {subscribers.count > 0 ? (
                  <span>
                    PS: progress on my target to build Feez: {subscribers.count}{" "}
                    / 1000 subscribers
                  </span>
                ) : (
                  "Loading..."
                )}
              </div>
            </form>
            {success && <div>{success}</div>}
            {error && <div>{error}</div>}
          </div>
          <div className="flex-grow mt-12 md:mt-24 w-full">
            <StepDescription title="Set goals" src={howToStep1}>
              <p>
                Define daily, weekly, monthly, quarterly or yearly goals. Use
                the <b>#trackinpublic</b> hashtag to be part of the community.
              </p>
            </StepDescription>
            <div className="text-center mb-12 md:mb-24">
              <i className="fa-solid fa-arrow-down text-5xl opacity-70" />
            </div>
            <StepDescription title="Provide updates" src={howToStep2} inverted>
              <p>
                Update metrics either through our API or manually from the UI.
                Leave it to us to present the data.
              </p>
            </StepDescription>
            <div className="text-center mb-12 md:mb-24">
              <i className="fa-solid fa-arrow-down text-5xl opacity-70" />
            </div>
            <StepDescription src={howToStep3} title="Share with your audience">
              <p>
                Share what you have done to achieve your goals. This will help
                other users to learn from you and grow your audience.
              </p>
            </StepDescription>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;

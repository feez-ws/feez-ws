import sklogo from "~/assets/stormkit-logo.svg";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center">
      <div className="max-w-screen-lg m-auto flex items-center justify-center">
        Powered by{" "}
        <a
          href="https://www.stormkit.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={sklogo} alt="Stormkit" className="w-24 ml-1" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

import logo from "~/assets/logo-text.svg";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-indigo-900 bg-opacity-30">
      <div className="max-w-screen-lg m-auto leading-none">
        <Link to="/" className="inline-flex">
          <img src={logo} alt="Feez.ws" className="w-20" />
        </Link>
      </div>
    </header>
  );
};

export default Header;

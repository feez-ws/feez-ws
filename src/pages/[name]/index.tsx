import { Link } from "react-router-dom";

const UserHome: React.FC = () => {
  return (
    <div>
      <p>Server side rendered user home page.</p>
      <Link to="/">Home</Link>
    </div>
  );
};

export default UserHome;

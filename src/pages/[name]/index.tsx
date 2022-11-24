import { Link, useParams } from "react-router-dom";

const UserHome: React.FC = () => {
  const params = useParams<{ name: string }>();

  return (
    <div>
      <p>Server side rendered user home page.</p>
      <p>Your name is {params.name}</p>
      <Link to="/">Home</Link>
    </div>
  );
};

export default UserHome;

import { useEffect } from "react";
import Center from "../components/utils/Center";
import Log from "./Log";
import NavBar from "../components/NavBar";
import Logout from "../components/auth/Logout";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const navigate = useNavigate();
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={"auto"}>
      <NavBar navigate={navigate} />
      <Log />
      <Logout />
    </Center>
  );
};

export default Home;

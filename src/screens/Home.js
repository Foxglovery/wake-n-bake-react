import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import Log from "./Log";
import NavBar from "../components/NavBar";
import NavBarSimple from "../components/NavBarSimple";

const Home = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={"auto"}>
      <NavBar />
      <Log />
      <Logout />
    </Center>
  );
};

export default Home;

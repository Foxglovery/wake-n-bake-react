import { useEffect } from "react";
import Center from "../components/utils/Center";
import Log from "./Log";
import NavBar from "../components/NavBar";

const Home = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={"auto"}>
      <NavBar />
      <Log />
    </Center>
  );
};

export default Home;

import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import Log from "./Log";
import SignIn from "./Log";
import BatchCard from "../components/BatchCard";

const Home = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center>
      <Log />
      <Logout />
    </Center>
  );
};

export default Home;

import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/User/UserProfile";

const Profile = (props) => {
  const navigate = useNavigate();
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={"auto"}>
      <NavBar navigate={navigate} />
      <UserProfile />
    </Center>
  );
};

export default Profile;

import React, { useState } from "react";
import {
  UserProfileContainer,
  UserDataSection,
  UserHighlightSection,
  UserInfoContainer,
  EditAndSettingsDiv,
  AllPostImages,
} from "./styledComponents/UserProfile.style";
import Navbar from "./Navbar";
import { Avatar } from "@material-ui/core";
import subh from "../assets/images/shubham.jpg";
import WhiteRing from "../assets/images/UserHighlightRing.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import StatusStories from "./StatusStories";
import { useNavigate } from "react-router-dom";
import { PostDetailModal } from "./PostDetailModal";
function UserProfile() {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState(false);
  let rows = [];
  for (let i = 0; i <= 10; i++) {
    rows.push(
      <StatusStories
        ringImage={WhiteRing}
        key={Math.random()}
        Ringwidth="85"
        Ringheight="85"
        width="80"
        height="80"
      />
    );
  }
  let randomPosts = [];
  for (let i = 0; i <= 10; i++) {
    randomPosts.push(
      <li key={Math.random()} onClick={handlePostClick}>
        <img key={Math.random()} src={subh} height="280px" width="300px" />
      </li>
    );
  }

  function handlePostClick(event:React.SyntheticEvent) {
    console.log(event.target);
    setModalState((prev) => {
      return !prev;
    });
  }
  return (
    <div>
      <Navbar />
      <UserProfileContainer>
        <UserDataSection>
          <div>
            <Avatar id="userProfileAvatar" src={subh} />
          </div>
          <UserInfoContainer>
            <EditAndSettingsDiv>
              <p>shubham_petwal_</p>

              <button onClick={() => navigate("/editProfile")}>
                Edit Profile
              </button>

              <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
            </EditAndSettingsDiv>
            <EditAndSettingsDiv>
              <div>
                <span>6 </span>
                posts
              </div>
              <div>
                <span>268</span>
                followers
              </div>
              <div>
                <span>244 </span>
                following
              </div>
            </EditAndSettingsDiv>
            <EditAndSettingsDiv>
              <span>Shubham Petwal</span>
            </EditAndSettingsDiv>
          </UserInfoContainer>
        </UserDataSection>

        <UserHighlightSection>
          <div id="userProfileHighlight">
            <ul>{rows.map((item) => item)}</ul>
          </div>
        </UserHighlightSection>
        <AllPostImages>
          <ul>
            {randomPosts.map((item)=>{return item})}
          </ul>
        </AllPostImages>
      </UserProfileContainer>
      <PostDetailModal
        modalState={modalState}
        setModal={(prev: boolean) => {
          setModalState(!prev);
        }}
      />
    </div>
  );
}

export default UserProfile;

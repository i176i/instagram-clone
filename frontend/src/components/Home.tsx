import React, { useContext, useEffect, useRef, useState } from "react";
import { auth } from "../firebaseSetup";
import Navbar from "./Navbar";
import Posts from "./Posts";
import StatusBar from "./StatusBar";
import {
  HomePageContainer,
  SuggestionContainer,
  SuggestionUserDetailsdiv,
} from "./styledComponents/Home.style";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import BlueButton from "../assets/images/blueButton.png";

import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadModal from "./UploadModal";
import { Timestamp } from "firebase/firestore";
import ShowStory from "./ShowStory";

interface DataInterface {
  image: string;
  caption: string;
  postId: string;
  createdAt: any;
  docId: string;
  children: React.ReactNode;
}
interface StoryInterface {
  image: string;
  createdAt: any;
  userName: string;
  profileImage: string;
  children: React.ReactNode;
}

function Home() {
  const user = useContext(AuthContext);
  const [imageArray, setImageArray] = useState<Array<DataInterface>>([]);

  const [userRetrievedData, setRetrievedData] = useState<any>();
  // const [lastDoc, setLastDoc] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isStoryUploaded, setIsStoryUploaded] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSetStory = (bool: boolean) => {
    return setIsStoryUploaded(bool);
  };

  const getNextData = async () => {
    try {
      const lastDoc = imageArray[imageArray.length - 1].createdAt;
      const lastDocInMillis = new Timestamp(
        lastDoc.seconds,
        lastDoc.nanoseconds
      ).toMillis();
      const res = await axios.get(
        `http://localhost:90/getPosts?page=3&lastDocId=${lastDocInMillis}`
      );
      //have to use query params
      setImageArray((prev) => {
        return [...prev, ...res.data.data];
      });
      if (res.data.data.length == 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const allPosts = await axios.get(`http://localhost:90/getPosts?page=3`);
        const details = allPosts.data;
        if (details) {
          setImageArray(details.data);
        } else {
          console.log("Post Details not found");
        }
        const userData = await axios.get(
          `http://localhost:90/users/${user?.uid}`
        );
        setRetrievedData(userData.data.data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getData();
  }, []);
  return (
    <>
      <Navbar profileImage={userRetrievedData?.profileImage} />
      <HomePageContainer>
        <ToastContainer position="top-center" />
        <div id="all_posts">
          <StatusBar setStoryState={handleSetStory} />
          <InfiniteScroll
            dataLength={imageArray ? imageArray.length : 0} //This is important field to render the next data
            next={getNextData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {imageArray ? (
              imageArray.length > 0 ? (
                imageArray.map((item: any) => (
                  //  <li key={Math.random()}><img src={item.image} height="280px" width="300px" /></li>
                  <Posts
                    key={Math.random()}
                    postImage={item.image}
                    caption={item.caption}
                    postId={item.postId}
                    userId={item.userId}
                    userName={item.userName}
                    profileImage={item.profileImage}
                  />
                ))
              ) : (
                <p>No content</p>
              )
            ) : (
              <p>No content</p>
            )}
          </InfiniteScroll>
        </div>
        <SuggestionContainer>
          <SuggestionUserDetailsdiv>
            <div id="details">
              {isStoryUploaded ? (
                <div
                  onClick={() => {
                    toast("Story Already Uploaded");
                  }}
                >
                  <Avatar
                    id="homeProfileImage"
                    src={userRetrievedData?.profileImage}
                  />
                  <img
                    src={BlueButton}
                    id="bluBtn"
                    width="20px"
                    height="20px"
                  />
                </div>
              ) : (
                <div onClick={() => setModalIsOpen(true)}>
                  <Avatar
                    id="homeProfileImage"
                    src={userRetrievedData?.profileImage}
                  />
                  <img
                    src={BlueButton}
                    id="bluBtn"
                    width="20px"
                    height="20px"
                  />
                </div>
              )}
              {/* <button onClick={getNextData}>Call</button> */}
              <div>
                <span id="username">{userRetrievedData?.userName}</span>
                <br />
                <span id="fullName">{userRetrievedData?.fullName}</span>
              </div>
            </div>
            <div></div>
          </SuggestionUserDetailsdiv>
        </SuggestionContainer>
      </HomePageContainer>
      <UploadModal
        method={"addStory"}
        isModalOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        header={"Add new story"}
      />
    </>
  );
}

export default Home;

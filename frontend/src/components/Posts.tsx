import { Avatar } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  AddCommentsDiv,
  CommentsDiv,
  DescriptionDiv,
  LikeCommentShareDiv,
  LikesDiv,
  PostContainer,
  PostHeader,
  PostImageDiv,
  ThreeIconsDiv,
  UserDetailsContainer,
} from "./styledComponents/Posts.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  faComment,
  faHeart,
  faSave,
  faShareSquare,
  faBookmark,
  faSmile,
} from "@fortawesome/free-regular-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { Value } from "sass";
import { PostDetailModal } from "./PostDetailModal";
import { db } from "../db";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import redHeart from "../assets/images/red-heart-icon.svg";
import { sendNotification } from "../utilities/sendNotification";

interface PostInterFace {
  postImage: string;
  caption: string;
  postId: string;
  userId: string;
  profileImage:string;
  currentUserName:string;
  currentUserProfileImage:string;
  userName:string;
  currentUserFcmToken:string
}
function isImage(url : any) {
  const regex = /.png|.jpg|.jpeg|.webp/;
  return regex.test(url);
}

function Posts({ postImage, caption, postId, userId ,userName,profileImage,currentUserName,currentUserProfileImage,currentUserFcmToken}: PostInterFace) {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userRetrievedData, setRetrievedData] = useState<any>();
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesArrayDetails, setLikesArrayDetails] = useState<any>();
  const [modalState, setModalState] = useState(false);
  const user = useContext(AuthContext);


  const data = {
    userId: user?.uid,
    commentData: comment,
    postId: postId,
  };
  const handleAddComments = async () => {
    try {
      setLoading(true);
      const result = await axios.post("http://localhost:90/addComment", data);
      setLoading(false);
      setComment("");
      const token = userRetrievedData?.fcm_token;
      if(token!=currentUserFcmToken){
        sendNotification(token,"Comment Notification",`${currentUserName} has commented on your post`,userId,currentUserProfileImage,postImage)
        console.log("Notification sent")
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const userData = await axios.get(
        `http://localhost:90/users/${userId}`
      );
      setRetrievedData(userData.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getData =  () => {
    const collectionRef = query(
      collection(db, `post_interaction/${postId}/likes`)
    );
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const likesDetails: any = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.data())
        likesDetails.push(doc.data());
      });
      setLikesArrayDetails(likesDetails);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const dataUnsbscription = getData();
    if (user?.uid) {
      const postUnsubscription = onSnapshot(
        doc(db, `post_interaction/${postId}/likes/${user?.uid}`),
        (doc) => {
          // console.log("Current data: ", doc.data());
          if (doc.data()) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        }
      );
    }
    const postCountUnsubscription = onSnapshot(
      doc(db, "post_interaction", postId),
      (doc) => {
        setTotalComments(doc.data()?.comments_count);
        setTotalLikes(doc.data()?.likes_count);
      }
    );

    getUserData()
    return ()=>{
      dataUnsbscription();
      postCountUnsubscription();
    }
  },[]);
  function handlePostClick(event: React.MouseEvent<HTMLElement>) {
    setModalState((prev) => {
      return !prev;
    });
  }
  const handleLikePost = async () => {
    // this will instantly show liked post to the user
    setLiked(!liked);
    try{
      const result = await axios.post("http://localhost:90/like", {
        likedBy_userId: user?.uid,
        postId: postId,
      });
      if(!liked){
        const token = userRetrievedData?.fcm_token;

        if(token!=currentUserFcmToken){
        sendNotification(token,"Like Notification",`${currentUserName} has liked your post`,userId,currentUserProfileImage,postImage)
        console.log("Notification sent")
        }
      }
    }catch(err){
      setLiked(!liked);
    }
  };
  return (
    <PostContainer>
      <PostHeader>
        <UserDetailsContainer>
          <Avatar src={userRetrievedData?.profileImage} />
          <div>
            <span style={{cursor:"pointer"}} onClick={()=>{navigate(`/userProfile/${userName}`)}}>{userName}</span>
          </div>
        </UserDetailsContainer>
        <div>
  
        </div>
      </PostHeader>
      {isImage(postImage) ? 
        <PostImageDiv>
          <img src={postImage} alt="imageI" onDoubleClick={handleLikePost} />
        </PostImageDiv>
      :
        <PostImageDiv>
          <div style={{height : "400px", margin:"auto"}}>
            <ReactPlayer
              url={postImage}
              controls
              width="100%"
              height="90%"
              playing={false}
            />
          </div>
        </PostImageDiv>
      }
      
      <LikeCommentShareDiv>
        <ThreeIconsDiv>
          {liked ? (
            <img style={{cursor:"pointer"}} onClick={handleLikePost} src={redHeart} />
          ) : (
            <FontAwesomeIcon onClick={handleLikePost} icon={faHeart} />
          )}

          <span onClick={handlePostClick}>
            <FontAwesomeIcon icon={faComment} />
          </span>
          {/* <FontAwesomeIcon icon={faShareSquare} /> */}
        </ThreeIconsDiv>
        <div>
          {/* <FontAwesomeIcon icon={faBookmark} /> */}
        </div>
      </LikeCommentShareDiv>
      <LikesDiv>
        <span>{totalLikes ? totalLikes : 0} likes</span>
      </LikesDiv>
      <DescriptionDiv>
        <span id="userName" style={{cursor:"pointer"}} onClick={()=>{navigate(`/userProfile/${userName}`)}}>{userName}</span>
        <span>{caption}</span>
      </DescriptionDiv>
      <CommentsDiv>
        <span onClick={handlePostClick}>
          View all {totalComments ? totalComments : 0} Comments
        </span>
      </CommentsDiv>
      <AddCommentsDiv>
        <FontAwesomeIcon icon={faSmile} />
        <input
          type="text"
          placeholder="Add a comment..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
                            {isLoading?
                    <button>
                      <Spinner animation="border" role="status" size="sm"/>
                    </button>:
                    <button onClick={handleAddComments}>Post</button>
                  }
        
      </AddCommentsDiv>
      <PostDetailModal
        key={Math.random()}
        modalState={modalState}
        setModal={(prev: boolean) => {
          setModalState(!prev);
        }}
        postId={postId}
        postImage={postImage}
        profileImage={userRetrievedData?.profileImage}
        caption={caption}
        userName={userName}
        liked = {liked}
        userId = {userId}
        fcm_token = {userRetrievedData?.fcm_token}
        currentUserName={currentUserName}
        currentUserProfileImage={currentUserProfileImage}
        currentUserFcmToken={currentUserFcmToken}
        setLiked = {setLiked}
      />
    </PostContainer>
  );
}

export default Posts;

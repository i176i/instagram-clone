import { useState, useEffect, useContext, useRef } from "react";
import {
  ModalBackdrop,
  ModalWrapperDiv,
  ImageWrapperDiv,
  DetailsWrapperDiv,
  ModalCloseButton,
  AuthorProfileDiv,
  CommentsWrapperDiv,
  ActionIconsDiv,
  CommentInput,
  CommentDiv,
} from "./styledComponents/Modal.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faXmarkCircle,
  faHeart,
  faFaceSmile,
  faComment,
  faBookmark,
  faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Avatar } from "@material-ui/core";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../db";
import redHeart from "../assets/images/red-heart-icon.svg";

export function PostDetailModal(props: any) {
  const navigate = useNavigate();
  const postData = {
    useName: "Yt_ 09090",
    caption: "Dream Super Bike 🔥🔥",
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxISbGKaOWbeQjagbw4mTs7ldZW2jbA7njbw&usqp=CAU",
    location: "Lucknow",
    likes: 455,
    time: "4 week",
  };
  const user = useContext(AuthContext);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [commentsArray, setcommentsArray] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const data = {
    userId: user?.uid,
    commentData: comment,
    postId: props.postId,
  };

  const handleAddComments = async () => {
    try {
      const result = await axios.post("http://localhost:90/addComment", data);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = async () => {
    const result = await axios.post("http://localhost:90/like", {
      likedBy_userId: user?.uid,
      postId: props.postId,
    });
    console.log("Liked");
  };

  const getData = async () => {
    const collectionRef = query(
      collection(db, `post_interaction/${props.postId}/comments`)
    );
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const commentsDetails: any = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.data())
        commentsDetails.push(doc.data());
      });
      setcommentsArray(commentsDetails);
    });
  };

  useEffect(() => {
    getData();
    const unsubscribe = onSnapshot(
      doc(db, "post_interaction", props.postId),
      (doc) => {
        setTotalComments(doc.data()?.comments_count);
        setTotalLikes(doc.data()?.likes_count);
      }
    );
    return unsubscribe;
  }, []);
  function handleClick() {
    props.setModal(props.modalState);
  }
  // useEffect(() => {
  //   if (modalState) {
  //     document.body.style.height = "100vh";
  //     document.body.style.overflowY = "hidden";
  //     // @ts-ignore
  //     // document.getElementById("root").style.overflowY ="hidden";
  //   } else {
  //     //   document.body.style.height = "100vh";
  //     document.body.style.overflowY = "scroll";
  //   }
  // }, [modalState]);
  return (
    <>
      {/* <button onClick={handleClick}>Click</button> */}
      {props.modalState && (
        <div>
          <ModalBackdrop>
            <ModalWrapperDiv>
              <ImageWrapperDiv>
                <img src={props.postImage} />
              </ImageWrapperDiv>
              <DetailsWrapperDiv>
                <AuthorProfileDiv>
                  <div className="profile-img">
                    <img src={props.profileImage} alt="profile image" />
                  </div>
                  <div className="description">
                    <p className="user-name" style={{cursor:"pointer"}} onClick={()=>{navigate(`/userProfile/${props.userName}`)}}>{props.userName}</p>
                    <p>Lucknow</p>
                  </div>
                  <div className="ellipsis">
                    <FontAwesomeIcon icon={faEllipsis} />
                  </div>
                </AuthorProfileDiv>
                <CommentsWrapperDiv>
                  <CommentDiv>
                    <div className="profile-img">
                      <img src={props.profileImage} alt="profile image" />
                    </div>
                    <div>
                      <p className="comment-data">
                        <span className="userName" style={{cursor:"pointer"}} onClick={()=>{navigate(`/userProfile/${props.userName}`)}} >{props.userName}</span>
                        {props.caption}
                      </p>
                      <p className="comment-info">
                        <span>4 Week</span>
                      </p>
                    </div>
                    <div className="like-icon">
                      <FontAwesomeIcon icon={faHeart} />
                    </div>
                  </CommentDiv>
                  {commentsArray ? (
                    commentsArray.map((commentDoc) => {
                      return (
                        <CommentDiv key={Math.random()}>
                          <div className="profile-img">
                            <Avatar
                              src={commentDoc.commentBy_profileImage}
                              alt="profile image"
                            />
                          </div>
                          <div>
                            <p className="comment-data">
                              <span style={{cursor:"pointer"}} className="userName" onClick={()=>{navigate(`/userProfile/${commentDoc.commentBy_userName}`)}}>
                                {commentDoc.commentBy_userName}
                              </span>
                              {commentDoc.commentData}
                            </p>
                            <p className="comment-info">
                              {/* <span>{commentDoc.time}</span>
                            <span>{commentDoc.likes} likes</span> */}
                            </p>
                          </div>
                          <div className="like-icon">
                            <FontAwesomeIcon icon={faHeart} />
                          </div>
                        </CommentDiv>
                      );
                    })
                  ) : (
                    <p>No Comments</p>
                  )}
                </CommentsWrapperDiv>
                <ActionIconsDiv>
                  <div className="icon-wrapper">
                    <div className="left-icon">
                      {props.liked ? (
                        <img onClick={handleLikePost} src={redHeart} />
                      ) : (
                        <FontAwesomeIcon
                          onClick={handleLikePost}
                          icon={faHeart}
                        />
                      )}
                      <FontAwesomeIcon icon={faComment} />
                      <FontAwesomeIcon icon={faShareFromSquare} />
                    </div>
                    <div className="bookmark-icon">
                      <FontAwesomeIcon icon={faBookmark} />
                    </div>
                  </div>
                  <div className="likes-wrapper">
                    <p>{totalLikes ? totalLikes : 0} likes</p>
                  </div>
                </ActionIconsDiv>
                <CommentInput>
                  <div className="emoji-icon">
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </div>
                  <div className="input-div">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    />
                  </div>
                  <div className="post-button">
                    <button onClick={handleAddComments}>Post</button>
                  </div>
                </CommentInput>
              </DetailsWrapperDiv>
            </ModalWrapperDiv>
          </ModalBackdrop>
          <ModalCloseButton>
            <FontAwesomeIcon onClick={handleClick} icon={faXmarkCircle} />
          </ModalCloseButton>
        </div>
      )}
    </>
  );
}

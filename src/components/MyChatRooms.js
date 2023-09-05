import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChatRooms.module.css";

export default function MyChatRooms() {
  const [myChatRoomList, setChatRoomList] = useState({
    chatRooms: [],
    loading: true,
  });

  let listOfChatrooms = [];

  const navigate = useNavigate();

  useEffect(() => {
    async function getMyChatRooms() {
      //here we're going to get the chatrooms associated with the user:
      try {
        let headerStuff = {
          headers: {
            Authorization: "Token " + localStorage.getItem("auth-token"),
          },
        };
        const response = await fetch(
          "http://localhost:8001/yourchatrooms/",
          headerStuff
        );
        const chatroomsList = await response.json();

        
        let i = 0;
        if (chatroomsList.yourchatrooms != null) {
          listOfChatrooms = chatroomsList.yourchatrooms.map((chatrooms) => {
            i++;
            let strReplace = chatrooms.name.replace(
              /[&\/\\#, +()$~%.'":*?<>{}]/g,
              "-"
            );

            return (
              <div
                className={styles.chatRoomsMainSingleRoom}
                key={i}
                onClick={() => {
                  return navigate(`/home/room/${strReplace}`);
                }}
              >
                <div
                  className={[
                    styles.chatRoomsMainSingleRoomCard,
                    styles.chatRoomBoxShadow,
                  ].join(" ")}
                >
                  <div className={styles.chatRoomCardContent}>
                    <h2>{chatrooms.name}</h2>
                    <span>{chatrooms.description.length > 115 ? chatrooms.description.substring(1,115) + "..." : chatrooms.description}</span>
                    <div className={styles.chatRoomCardContentCreator}>
                      <div className={styles.createrInfo}>
                        <span className={styles.createInfoSpan}>
                          <span className={styles.createInfoAuthor}>
                            {chatrooms.createdBy.username}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          });

          setChatRoomList({
            chatRooms: listOfChatrooms,
            loading: false,
          }); //now that we have the chat room list, we can go ahead and set the state to include the chat rooms.
        }
      } catch (err) {
        console.error("the error found is: ", err);
      }
    }

    

    //at inital render, we see that the myChatRoomlist is going to be empty so run the function.
    if (myChatRoomList.chatRooms.length == 0 && myChatRoomList.loading) {
      getMyChatRooms();
    }
  }, [myChatRoomList]);

  return myChatRoomList.chatRooms.length > 0 ? (
    <div className={styles.chatRoomsContainerChatRooms}>
      <main className={styles.chatRoomsMain}>{myChatRoomList.chatRooms}</main>
    </div>
  ) : myChatRoomList.loading ? (
    <div className={styles.chatRoomsContainer}>
      <h1 style={{ margin: "0px" }}>Loading Chat Rooms</h1>
    </div>
  ) : (
    <div className={styles.chatRoomsContainer}>
      <h1 style={{ margin: "0px" }}>You Haven't Created Any Chat Rooms Yet!</h1>
    </div>
  );
}

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Authenticate.module.css"; //importing the form class from authenticate to use on the create chat form
import {useTranslation} from 'react-i18next';

function CreateChatRoom() {
  const navigate = useNavigate();

  const [createRoomValidations, validateCreateRoom] = useState({
    validated: true,
    errorMessage: "",
  });

  const { t, i18n } = useTranslation();

  let chatRoomName = useRef(null);
  let chatRoomDescription = useRef(null);

  async function handleSubmiter(e) {
    e.preventDefault();


    if (chatRoomName.current.value == "" || chatRoomDescription.current.value == "") {
      validateCreateRoom({
        validated: false,
        errorMessage:
         t('createChatRooms.errorMessage1'),
      });
    } 
    else {
      //get the form data to creat the chat room:
      let form = e.target;
      let chatRoomFormData = new FormData();
      let unicode = form["chatroom"].value.split("").map((i) => {
        var temp = i.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
          return "\\u" + temp;
        }
        return i;
      });
      //convert the url to complete unicode incase there are special characters like tildes, accents, or emojis.
      let finalizedUnicode = unicode.join('').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
      chatRoomFormData.append("name", form["chatroom"].value);
      chatRoomFormData.append('nameslug', finalizedUnicode.replace(/\s/g, '-')) //replace any white space with '-'
      chatRoomFormData.append("description", form["description"].value);

      //when sending a post request there could be some issues, so that's why we're using a try catch block just in case:
      try {
        let chatroomData = {
          method: "POST",
          headers: {
            //we need to include the auth-token as this is needed to submit data to the django rest framework
            Authorization: "Token " + localStorage.getItem("auth-token"),
          },
          body: chatRoomFormData,
        };
        let createChatRoomResponse = await fetch(
          `${process.env.REACT_APP_DB}/createchatroom2/`,
          chatroomData
        );
        let chatroomResult = await createChatRoomResponse.json();

        if (chatroomResult.createdRoomFound) {
          validateCreateRoom({
            validated: false,
            errorMessage: t('createChatRooms.errorMessage2')
          })
        }
        
        else{
          //once the chatroom has been created, redirect basically to the chatrooms
          navigate("/home/chatrooms/");
        }
        
      } catch (error) {
        console.error("there has been an error ", error);
      }
    }
  }

  return (
    <main className={classes.mainWrapper}>
      <div className={classes.authenticateDiv}>
        <div className={classes.authenticateDivForm}>
          <h2 style={{ fontSize: "25px" }}>{t('createChatRooms.create')}</h2>
          <div className={[classes.formBlock, classes.wForm].join(" ")}>
            <form onSubmit={handleSubmiter}>
            {createRoomValidations.validated == false ? (
                <p className={classes.pErrors}>{createRoomValidations.errorMessage}</p>
              ) : null}
              <div>
                <div>
                  <label
                    htmlFor="chatroom"
                    id="chatroom"
                    className={classes.loginFormLabel}
                  >
                    {t('createChatRooms.chatRoomName')}
                  </label>
                  <input
                    className={[
                      classes.textAreaContentFormLabel,
                      classes.textAreaContentFormLabelWInput,
                      createRoomValidations.validated == false && chatRoomName.current.value == '' ? classes.formInputErrors : null
                    ].join(" ")}
                    name="chatroom"
                    ref={chatRoomName}
                  ></input>
                  <p className={classes.textAreaContentFormLabelWordLimit}>
                    Max. 100 {t('createChatRooms.maxRequirements')}
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  id="description"
                  className={classes.loginFormLabel}
                >
                  {t('createChatRooms.description')}
                </label>
                <input
                  className={[
                    classes.textAreaContentFormLabel,
                    classes.textAreaContentFormLabelWInput,
                    createRoomValidations.validated == false && chatRoomDescription.current.value == '' ? classes.formInputErrors : null
                  ].join(" ")}
                  name="description"
                  ref={chatRoomDescription}
                ></input>
                <p className={classes.textAreaContentFormLabelWordLimit}>
                  Max. 350 {t('createChatRooms.maxRequirements')}
                </p>
              </div>
              <button
                type="submit"
                className={[classes.button, classes.wButton].join(" ")}
              >
                {t('createChatRooms.createTheRoom')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreateChatRoom;

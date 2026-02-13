import React, { useState, useEffect, memo, useRef } from "react";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import {
  getDatabase,
  ref,
  onValue,
  onChildAdded,
  push,
  off,
  get,
  update,
} from "firebase/database";
import { auth } from "../../../FirebaseConfig/firebaseConfig";
import fallbackAvatar from "../../../assets/fallback-avatar.png";
import { renderMessageWithLinks } from "../../../Utilities/renderMessageWithLinks";

const RealtimeChat = () => {
  const [fetchedNames, setFetchedNames] = useState({});
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const messagesEndRef = useRef(null);
  const textRef = useRef("");

  const db = getDatabase();
  const currentUserID = auth?.currentUser?.uid;
  const currentUserName =
    auth?.currentUser?.displayName || auth?.currentUser?.email?.split("@")[0];
  const currentUserAvatar = auth?.currentUser?.photoURL || fallbackAvatar;

  const fetchNameFromFirestore = async (id) => {
    if (!id) return "Unknown";
    if (fetchedNames[id]) return fetchedNames[id];

    const firestoreDB = getFirestore();
    const userRef = doc(firestoreDB, "users", id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userName = userDoc.data().uniqueName;
      if (userName) {
        setFetchedNames((prev) => ({ ...prev, [id]: userName }));
        return userName;
      }
    }
    return "Unknown";
  };

  useEffect(() => {
    const startNewChat = async () => {
      const newChatOwnerID = localStorage.getItem("ownerID");
      if (newChatOwnerID && currentUserID && newChatOwnerID !== currentUserID) {
        localStorage.removeItem("ownerID");

        const sortedIds = [currentUserID, newChatOwnerID].sort();
        const threadID = sortedIds.join("_");

        const threadRef = ref(db, `threads/${currentUserID}/${threadID}`);
        const threadSnapshot = await get(threadRef);

        if (!threadSnapshot.exists()) {
          const welcomeMessage = {
            sender: "system",
            text: "Welcome to the chat! Start your conversation here.",
            timestamp: Date.now(),
          };

          const newMessageRef = push(
            ref(db, `threads/${currentUserID}/${threadID}/messages`)
          );
          const messageKey = newMessageRef.key;

          const updates = {};
          updates[`threads/${currentUserID}/${threadID}/messages/${messageKey}`] =
            welcomeMessage;
          updates[`threads/${newChatOwnerID}/${threadID}/messages/${messageKey}`] =
            welcomeMessage;

          await update(ref(db), updates);
        }

        setActiveThread(threadID);
      }
    };

    startNewChat();
  }, [currentUserID, db]);

  useEffect(() => {
    if (!currentUserID) return;

    const threadsRef = ref(db, `threads/${currentUserID}`);
    const listener = onValue(threadsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const threadPromises = Object.keys(data).map(async (threadID) => {
          const userIds = threadID.split("_");
          const otherUserId = userIds.find((id) => id !== currentUserID);
          const otherUserName = await fetchNameFromFirestore(otherUserId);

          return {
            id: threadID,
            otherUserName,
            lastMessage: data[threadID].messages
              ? Object.values(data[threadID].messages).pop()
              : null,
          };
        });
        const resolvedThreads = await Promise.all(threadPromises);
        setThreads(resolvedThreads);
      } else {
        setThreads([]);
      }
    });

    return () => off(threadsRef, "value", listener);
  }, [currentUserID, db]);

  useEffect(() => {
    if (!activeThread || !currentUserID) {
      setMessages([]);
      return;
    }

    const threadRef = ref(
      db,
      `threads/${currentUserID}/${activeThread}/messages`
    );

    setMessages([]);

    const listener = onChildAdded(threadRef, (snapshot) => {
      setMessages((prevMessages) => [...prevMessages, { id: snapshot.key, ...snapshot.val() }]);
    });

    return () => {
      off(threadRef, "child_added", listener);
    };
  }, [activeThread, currentUserID, db]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!textRef.current.value.trim() || !activeThread) return;

    const userIds = activeThread.split("_");
    const recipientID = userIds.find((id) => id !== currentUserID);

    if (!recipientID) return;

    const message = {
      sender: currentUserID,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      text: textRef.current.value.trim(),
      timestamp: Date.now(),
    };

    const newMessageRef = push(
      ref(db, `threads/${currentUserID}/${activeThread}/messages`)
    );
    const messageKey = newMessageRef.key;

    const updates = {};
    updates[`threads/${currentUserID}/${activeThread}/messages/${messageKey}`] =
      message;
    updates[`threads/${recipientID}/${activeThread}/messages/${messageKey}`] =
      message;

    update(ref(db), updates);

    textRef.current.value = "";
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="messenger-container">
      <div className="threads-list-container">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={`thread ${activeThread === thread.id ? "active" : ""}`}
            onClick={() => setActiveThread(thread.id)}
          >
            {thread.otherUserName}
          </div>
        ))}
      </div>
      {activeThread && (
        <div className="chat-container">
          <div className="messages" ref={messagesEndRef}>
            {messages.map((message) => (
              <p
                key={message.id}
                className={
                  message.sender === currentUserID ? "sender" : "recipient"
                }
              >
                {message.sender !== "system" &&
                  message.sender !== currentUserID && (
                    <img
                      src={message.senderAvatar || fallbackAvatar}
                      alt={`${message.senderName}'s avatar`}
                      className="message-avatar"
                    />
                  )}
                {message.sender === "system"
                  ? message.text
                  : message.sender !== currentUserID
                  ? `${fetchedNames[message.sender] || "User"}: ${renderMessageWithLinks(
                      message?.text
                    )}`
                  : renderMessageWithLinks(message?.text)}
              </p>
            ))}
          </div>
          <textarea
            name="chat-textarea"
            ref={textRef}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default memo(RealtimeChat);

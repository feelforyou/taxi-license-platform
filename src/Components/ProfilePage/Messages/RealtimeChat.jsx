import React, { useState, useEffect, memo, useRef } from "react";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  off,
  get,
} from "firebase/database";
import { auth } from "../../../FirebaseConfig/firebaseConfig";
import fallbackAvatar from "../../../assets/fallback-avatar.png";
import { renderMessageWithLinks } from "../../../Utilities/renderMessageWithLinks";

const RealtimeChat = () => {
  const [fetchedNames, setFetchedNames] = useState({});
  const [clearTextArea, setClearTextArea] = useState(false);
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
    // Check cache first
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

  // Effect to handle initiating a new chat from another page
  useEffect(() => {
    const newChatOwnerID = localStorage.getItem("ownerID");
    if (newChatOwnerID && currentUserID && newChatOwnerID !== currentUserID) {
      const sortedIds = [currentUserID, newChatOwnerID].sort();
      const threadID = sortedIds.join("_");

      // Immediately set the new chat as active
      setActiveThread(threadID);

      // Define the welcome message
      const welcomeMessage = {
        sender: "system",
        text: "Welcome to the chat! Start your conversation here.",
        timestamp: Date.now(),
      };

      // Ensure the thread exists for the current user
      const user1ThreadRef = ref(
        db,
        `threads/${currentUserID}/${threadID}/messages`
      );
      get(user1ThreadRef).then((snapshot) => {
        if (!snapshot.exists()) {
          push(user1ThreadRef, welcomeMessage);
        }
      });

      // Ensure the thread exists for the other user
      const user2ThreadRef = ref(
        db,
        `threads/${newChatOwnerID}/${threadID}/messages`
      );
      get(user2ThreadRef).then((snapshot) => {
        if (!snapshot.exists()) {
          push(user2ThreadRef, welcomeMessage);
        }
      });

      // Clean up local storage
      localStorage.removeItem("ownerID");
    }
  }, [currentUserID, db]);

  // Effect to fetch all of the user's chat threads
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
      }
    });

    return () => off(threadsRef, "value", listener);
  }, [currentUserID, db]);

  // Effect to fetch messages for the currently active chat thread
  useEffect(() => {
    if (!activeThread || !currentUserID) {
      setMessages([]);
      return;
    }

    const threadRef = ref(
      db,
      `threads/${currentUserID}/${activeThread}/messages`
    );
    const listener = onValue(threadRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setMessages(loadedMessages);
    });

    return () => off(threadRef, "value", listener);
  }, [activeThread, currentUserID, db]);

  // Effect to scroll to the latest message
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

    // Write message to both users' threads
    const currentUserMessageRef = ref(
      db,
      `threads/${currentUserID}/${activeThread}/messages`
    );
    push(currentUserMessageRef, message);

    const recipientUserMessageRef = ref(
      db,
      `threads/${recipientID}/${activeThread}/messages`
    );
    push(recipientUserMessageRef, message);

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

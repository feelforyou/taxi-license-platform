export const renderMessageWithLinks = (message) => {
  const urlPattern = /https?:\/\/[^\s]+/g;
  const match = message.match(urlPattern);

  if (match) {
    const startIndex = message.indexOf(match[0]);
    const beforeLink = message.substring(0, startIndex);
    const afterLink = message.substring(startIndex + match[0].length);

    return (
      <>
        {beforeLink}
        <a
          style={{ textDecoration: "underline" }}
          href={match[0]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[0]}
        </a>
        {afterLink}
      </>
    );
  }

  return message;
};

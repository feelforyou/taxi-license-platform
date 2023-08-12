import React from "react";

const YoutubeEmbed = ({ embedUrl }) => {
  // Extract video ID from YouTube URL

  const getEmbedIdFromUrl = (url) => {
    if (!url) return null; // Check if the url is provided
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : null;
  };

  const embedId = getEmbedIdFromUrl(embedUrl);

  if (!embedId) {
    return <div>Invalid or missing YouTube URL.</div>; // This will be displayed if embedId isn't found
  }

  return (
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};

// Setting default props
YoutubeEmbed.defaultProps = {
  embedUrl: "",
};

export default YoutubeEmbed;

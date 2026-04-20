import React from "react";
import VideoPlayer from "../recordings/VideoPlayer";

interface Props {
  version?: any;
}

export default function SolutionModal({ version }: Props) {
  return (
    <div>
      <VideoPlayer videoUrl={version || ""} />
    </div>
  );
}

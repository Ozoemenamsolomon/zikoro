import "@vidstack/react/player/styles/base.css"; // Base styles for media player and provider (~400B).
import "@vidstack/react/player/styles/base.css";
import {
  MediaPlayer,
  MediaProvider,
  MediaPlayerInstance,
  Poster,
  MediaLoadingStrategy,
  MediaStreamType,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import Image from "next/image";

import { useRef } from "react";

type PlayerProps = {
  src: string;
  muted?: boolean;
  title: string;
  thumbnail: string;
  autoPlay?: boolean;
  load?: MediaLoadingStrategy;
  streamType?: MediaStreamType;
};
export function Player({
  src,
  thumbnail,
  load,
  title,
  streamType,
}: PlayerProps) {
  const mediaRef = useRef<MediaPlayerInstance>(null);

  /**
   const smallAudioLayoutQuery = useCallback<MediaPlayerQuery>(({ width }) => {
    return width < 300;
  }, []);
  */

  return (
    <div className="w-full h-full">
      <MediaPlayer
        className="player w-full  bg-zinc-700 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
        title={title}
        load={load}
        streamType={streamType}
        src={src}
        viewType="video"
        crossOrigin
        playsInline
        controls
        autoPlay
        ref={mediaRef}
      >
        <MediaProvider/>
         
      
      </MediaPlayer>
    </div>
  );
}

/**
  <MediaProvider>
            <Poster alt={title} asChild>
              <Image src={thumbnail} width={1920} height={1080} alt={title} />
            </Poster>
          </MediaProvider>
  <Poster
              className="vds-poster absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
              src={thumbnail}
              alt={title}
            />
  <DefaultVideoLayout
          smallLayoutWhen={smallAudioLayoutQuery}
          icons={defaultLayoutIcons}
          thumbnails={thumbnail}
        />
 */

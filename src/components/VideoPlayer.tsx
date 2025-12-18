import { PlaybackMode } from "@/utils/playerUtils";
import { ExternalLink } from "lucide-react";

interface VideoPlayerProps {
  streamUrl: string;
  mode?: PlaybackMode;
  sandbox?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  isMovie?: boolean;
}

export default function VideoPlayer({ streamUrl, mode = 'iframe', sandbox, referrerPolicy = "origin", isMovie = false }: VideoPlayerProps) {
  return (
    <div className={`flex flex-col items-center w-full ${isMovie ? '' : ''}`}>
        <div className={`relative w-full overflow-hidden rounded-xl bg-black shadow-2xl border-2 border-[#23252b] group ${
            isMovie 
            ? 'h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]' 
            : 'pt-[56.25%]'
        }`}>
            {mode === 'proxy' || mode === 'direct' ? (
                 <video 
                    key={streamUrl}
                    src={streamUrl} 
                    controls 
                    className="absolute inset-0 h-full w-full"
                    preload="metadata"
                 >
                    Your browser does not support the video tag.
                 </video>
            ) : (
                <iframe 
                    key={streamUrl}
                    src={streamUrl} 
                    className="absolute inset-0 h-full w-full"
                    allowFullScreen
                    scrolling="no"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy={referrerPolicy}
                    {...(sandbox ? { sandbox } : {})}
                />
            )}
        </div>
    </div>
  );
}

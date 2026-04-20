"use client";
/**
 * VideoPlayer Component - YouTube Video Player with Custom Controls
 *
 * Features:
 * - Custom playback controls with keyboard shortcuts
 * - Fullscreen support with cross-browser compatibility
 * - Volume control and mute functionality
 * - Playback speed adjustment (0.25x to 2x)
 * - Progress bar with seek functionality
 * - Auto-hide controls on mouse inactivity
 * - Loading state indicator
 *
 * Keyboard Shortcuts:
 * - Space/K: Play/Pause
 * - M: Mute/Unmute
 * - F: Toggle Fullscreen
 * - Arrow Left: Rewind 5 seconds
 * - Arrow Right: Forward 5 seconds
 * - Arrow Up: Volume up 10%
 * - Arrow Down: Volume down 10%
 */
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
} from "lucide-react";

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setPlaybackRate: (rate: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getPlaybackRate: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
    ytPlayerInitCallbacks?: (() => void)[];
  }
}

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\n]+)/);
  return match ? match[1] : null;
};

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const updateIntervalRef = useRef<number | null>(null);
  const videoId = getYouTubeId(videoUrl);

  // Initialize YouTube Player
  useLayoutEffect(() => {
    if (!videoId) return;

    let player: YTPlayer | null = null;

    const initPlayer = () => {
      if (!containerRef.current || player) return;

      try {
        player = new window.YT.Player(containerRef.current, {
          height: "100%",
          width: "100%",
          videoId,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 0,
            playsinline: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: any) => {
              playerRef.current = event.target;

              // Sync initial states
              try {
                const playerDuration = event.target.getDuration();
                const playerVolume = event.target.getVolume();
                const playerMuted = event.target.isMuted();
                const playerRate = event.target.getPlaybackRate();

                setDuration(playerDuration);
                setVolume(playerMuted ? 0 : playerVolume);
                setIsMuted(playerMuted);
                setPlaybackRate(playerRate);
                setIsPlayerReady(true);
              } catch (error) {
                console.error("Error syncing player state:", error);
              }
            },
            onStateChange: (event: { data: number }) => {
              // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (event: any) => {
              console.error("YouTube Player Error:", event.data);
              setIsPlayerReady(false);
            },
          },
        });
      } catch (error) {
        console.error("Error initializing player:", error);
      }
    };

    const loadYouTubeAPI = () => {
      // If API is already loaded
      if (window.YT && window.YT.Player) {
        initPlayer();
        return;
      }

      // If script is being loaded, queue the callback
      if (!window.ytPlayerInitCallbacks) {
        window.ytPlayerInitCallbacks = [];
      }
      window.ytPlayerInitCallbacks.push(initPlayer);

      // If script already exists in DOM, don't add again
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        return;
      }

      // Load the YouTube API script
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      window.onYouTubeIframeAPIReady = () => {
        if (window.ytPlayerInitCallbacks) {
          window.ytPlayerInitCallbacks.forEach((callback) => callback());
          window.ytPlayerInitCallbacks = [];
        }
      };

      document.head.appendChild(script);
    };

    loadYouTubeAPI();

    // Cleanup
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying player:", error);
        }
        playerRef.current = null;
      }
      setIsPlayerReady(false);
    };
  }, [videoId]);

  // Update current time
  useEffect(() => {
    if (!isPlaying || !isPlayerReady) return;

    updateIntervalRef.current = window.setInterval(() => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time);
        } catch (error) {
          console.error("Error getting current time:", error);
        }
      }
    }, 500); // Update more frequently for smoother progress

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [isPlaying, isPlayerReady]);

  // Controls auto-hide with mouse movement detection
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      if (isPlaying) {
        controlsTimeoutRef.current = window.setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
    };
  }, [isPlaying]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullScreen(isFS);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlayerReady) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullScreen();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (playerRef.current) {
            const newTime = Math.max(0, currentTime - 5);
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (playerRef.current) {
            const newTime = Math.min(duration, currentTime + 5);
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (playerRef.current) {
            const newVolume = Math.min(100, volume + 10);
            setVolume(newVolume);
            playerRef.current.setVolume(newVolume);
            if (newVolume > 0 && isMuted) {
              playerRef.current.unMute();
              setIsMuted(false);
            }
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (playerRef.current) {
            const newVolume = Math.max(0, volume - 10);
            setVolume(newVolume);
            playerRef.current.setVolume(newVolume);
            if (newVolume === 0) {
              setIsMuted(true);
            }
          }
          break;
      }
    };

    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyPress);
      container.setAttribute("tabindex", "0");
    }

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyPress);
      }
    };
  }, [isPlayerReady, currentTime, duration, volume, isMuted]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !isPlayerReady) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error("Error toggling play:", error);
    }
  }, [isPlaying, isPlayerReady]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current || !isPlayerReady) return;

    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
        if (volume === 0) {
          setVolume(80);
          playerRef.current.setVolume(80);
        }
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  }, [isMuted, volume, isPlayerReady]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!playerRef.current || !isPlayerReady) return;

      const newVolume = Number(e.target.value);
      setVolume(newVolume);

      try {
        playerRef.current.setVolume(newVolume);
        if (newVolume === 0) {
          setIsMuted(true);
          playerRef.current.mute();
        } else if (isMuted) {
          setIsMuted(false);
          playerRef.current.unMute();
        }
      } catch (error) {
        console.error("Error changing volume:", error);
      }
    },
    [isMuted, isPlayerReady],
  );

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!playerRef.current || !isPlayerReady) return;

      const time = Number(e.target.value);
      setCurrentTime(time);

      try {
        playerRef.current.seekTo(time, true);
      } catch (error) {
        console.error("Error seeking:", error);
      }
    },
    [isPlayerReady],
  );

  const handlePlaybackRateChange = useCallback(
    (rate: number) => {
      if (!playerRef.current || !isPlayerReady) return;

      setPlaybackRate(rate);
      setShowSettings(false);

      try {
        playerRef.current.setPlaybackRate(rate);
      } catch (error) {
        console.error("Error changing playback rate:", error);
      }
    },
    [isPlayerReady],
  );

  const toggleFullScreen = useCallback(async () => {
    if (!videoContainerRef.current) return;

    try {
      const elem = videoContainerRef.current as any;
      const doc = document as any;

      if (
        !document.fullscreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.msFullscreenElement
      ) {
        // Enter fullscreen
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-white">
        <p className="text-center px-4">Invalid or missing YouTube URL</p>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full aspect-video bg-black group focus:outline-none"
      tabIndex={0}
      role="region"
      aria-label="Video player"
    >
      {/* YouTube Player */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading state */}
      {!isPlayerReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Overlay Controls */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Play/Pause Center Button */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full flex items-center justify-center group/play"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          disabled={!isPlayerReady}
        >
          {!isPlaying && isPlayerReady && (
            <div className="bg-black/70 hover:bg-black/90 rounded-full p-4 transition-all group-hover/play:scale-110">
              <Play className="w-12 h-12 text-white" />
            </div>
          )}
        </button>

        {/* Bottom Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-12">
          {/* Progress Bar */}
          <div className="flex items-center gap-3 text-white text-sm mb-3">
            <span className="min-w-[45px] text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative group/progress">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={!isPlayerReady}
                aria-label="Video progress"
                className="w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer relative z-10
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:shadow-lg
                  hover:[&::-webkit-slider-thumb]:scale-125
                  [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white 
                  [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
                  hover:[&::-moz-range-thumb]:scale-125"
              />
              <div className="absolute inset-0 h-1 bg-gray-600 rounded-lg pointer-events-none">
                <div
                  className="h-full bg-blue-500 rounded-lg transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <span className="min-w-[45px] tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                disabled={!isPlayerReady}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  disabled={!isPlayerReady}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-white/10 disabled:opacity-50"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    disabled={!isPlayerReady}
                    aria-label="Volume"
                    className="w-0 group-hover/volume:w-20 opacity-0 group-hover/volume:opacity-100 transition-all duration-200 h-1 bg-transparent rounded-lg appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full 
                      [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                  />
                  <div className="absolute inset-0 h-1 bg-gray-600 rounded-lg pointer-events-none -z-10">
                    <div
                      className="h-full bg-blue-500 rounded-lg transition-all"
                      style={{ width: `${isMuted ? 0 : volume}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback Speed Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  disabled={!isPlayerReady}
                  aria-label="Playback speed settings"
                  className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">{playbackRate}x</span>
                </button>

                {showSettings && isPlayerReady && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSettings(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-700 rounded-lg p-2 min-w-[140px] shadow-2xl z-50">
                      <div className="text-white text-sm space-y-1">
                        <div className="font-semibold mb-2 px-3 py-1 text-center text-gray-400">
                          Playback Speed
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {PLAYBACK_RATES.map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handlePlaybackRateChange(rate)}
                              className={`block w-full text-center px-3 py-2 rounded transition-colors ${
                                playbackRate === rate
                                  ? "bg-blue-600 text-white font-semibold"
                                  : "hover:bg-gray-700 text-gray-200"
                              }`}
                              aria-label={`Set speed to ${rate}x`}
                            >
                              {rate === 1 ? "Normal" : `${rate}x`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullScreen}
                aria-label={
                  isFullScreen ? "Exit fullscreen" : "Enter fullscreen"
                }
                className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                {isFullScreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

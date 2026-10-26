import { useState, useEffect } from "react";
import "./videoEditingPage.css";

export default function VideoEditingPage() {
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [channelKnobAngle, setChannelKnobAngle] = useState(0);
  const [volKnobAngle, setVolKnobAngle] = useState(30);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleChannelClick = () => {
    setChannelKnobAngle((prev) => (prev + 30) % 360);
  };

  const handleVolClick = () => {
    setVolKnobAngle((prev) => {
      const nextAngle = (prev + 30) % 360;

      if (nextAngle === 0) {
        setIsPoweredOn(false);
      } else if (!isPoweredOn) {
        setIsPoweredOn(true);
      }
      return nextAngle;
    });
  };

  const togglePower = () => {
    setIsPoweredOn((prev) => !prev);
  };

  return (
    <div className="retro-tv-page">
      <div className="tv-stage">
        <div className="tv-drop-shadow" />

        <div className="tv-cabinet">
          <div className="tv-wood-bevel-top" />

          <div className="tv-faceplate">
            <div className="tv-screen-section">
              <div className="tv-outer-bezel">
                <div className="tv-deep-bezel">
                  <div
                    className={`tv-glass-socket ${isPoweredOn ? "screen-on" : "screen-off"}`}
                  >
                    {isPoweredOn ? (
                      <div className="crt-screen-content">
                        <div className="crt-paint-splash-bg" />
                        <div className="crt-tube-curvature-shadow" />
                        <div className="crt-scanlines" />
                        <div className="crt-phosphor-glow" />
                        <div className="crt-glass-glare" />

                        <div className="crt-top-bar">
                          <div className="crt-clock-widget">
                            <span className="crt-clock-time">
                              {formattedTime}
                            </span>
                            <span className="crt-clock-date">
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="crt-powered-off">
                        <div className="crt-off-center-point" />
                        <div className="crt-off-msg">
                          <span>POWER OFF</span>
                          <small>Turn knob to ignite</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="tv-control-panel">
              <div className="tv-dial-cluster top-cluster">
                <div className="dial-label-ring">
                  <span className="dial-mark mark-12">12</span>
                  <span className="dial-mark mark-u">U</span>
                  <span className="dial-mark mark-1">1</span>
                  <span className="dial-mark mark-2">2</span>
                  <span className="dial-mark mark-3">3</span>
                  <span className="dial-mark mark-4">4</span>
                  <span className="dial-mark mark-5">5</span>
                  <span className="dial-mark mark-6">6</span>
                  <span className="dial-mark mark-7">7</span>
                  <span className="dial-mark mark-8">8</span>
                  <span className="dial-mark mark-9">9</span>
                  <span className="dial-mark mark-10">10</span>
                  <span className="dial-mark mark-11">11</span>
                </div>

                <button
                  type="button"
                  className="rotary-knob channel-knob"
                  onClick={handleChannelClick}
                  title="Click to turn channel knob"
                  style={{ transform: `rotate(${channelKnobAngle}deg)` }}
                >
                  <div className="knob-cap">
                    <div className="knob-pointer-wing" />
                    <div className="knob-grip-texture" />
                  </div>
                </button>
              </div>

              <div className="tv-speaker-grille">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="speaker-slot" />
                ))}
              </div>

              <div className="tv-dial-cluster bottom-cluster">
                <div className="volume-label-row">
                  <span>OFF</span>
                  <span>•</span>
                  <span>MAX</span>
                </div>

                <button
                  type="button"
                  className="rotary-knob volume-knob"
                  onClick={handleVolClick}
                  title="Click to turn volume knob"
                  style={{ transform: `rotate(${volKnobAngle}deg)` }}
                >
                  <div className="knob-cap small">
                    <div className="knob-pointer-wing small" />
                    <div className="knob-grip-texture" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="tv-wood-bevel-bottom" />
          <div className="tv-foot foot-left" />
          <div className="tv-foot foot-right" />
        </div>
      </div>
    </div>
  );
}

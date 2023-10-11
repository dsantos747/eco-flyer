"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";

export function VapourTrails() {
  useEffect(() => {
    const planeAnimation = anime.timeline({
      autoplay: true,
      delay: 200,
      loop: true,
    });
    planeAnimation.add({
      targets: "#planeBg",
      easing: "linear",
      rotate: "30deg",
      duration: 1,
    });
    planeAnimation.add({
      targets: "#plane",
      translateX: ["-10%", "10%"],
      easing: "linear",
      duration: 1000,
    });
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div id="planeBg" className="w-[200vw] h-screen z-0 items-center justify-center overflow-hidden bg-orange-600">
        <div id="plane" className="overflow-hidden bg-rose-400">
          plane
        </div>
      </div>
    </div>
  );
}

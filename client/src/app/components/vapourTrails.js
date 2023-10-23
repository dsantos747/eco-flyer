"use client";

import { useEffect, useRef, useState } from "react";
import anime, { random } from "animejs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

export function VapourTrails() {
  useEffect(() => {
    const planeAnimation = anime.timeline({
      autoplay: true,
      // delay: 200,
      loop: true,
    });
    planeAnimation.add({
      targets: ".plane",
      translateX: ["150%", "-150%"],
      easing: "linear",
      duration: 12000,
      delay: anime.stagger(1000),
      autoplay: true,
    });
  }, []);

  return (
    <div className="absolute flex items-center h-screen w-screen max-w-screen justify-center overflow-hidden">
      <div id="planeBg" className="planeBg h-full z-0 absolute items-center justify-center overflow-hidden">
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className="planePath">
          <div className="plane">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import anime from 'animejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './planes.module.css';

export function VapourTrails() {
  useEffect(() => {
    // const planeAnimation = anime.timeline({
    //   autoplay: true,
    //   // delay: 200,
    //   loop: true,
    // });
    // planeAnimation.add({
    //   targets: '.animeTarget',
    //   translateX: ['100%', '-100%'],
    //   easing: 'linear',
    //   duration: 12000,
    //   delay: anime.stagger(1000),
    //   autoplay: true,
    // });
    const planeAnimation = anime({
      autoplay: true,
      targets: '.animeTarget',
      translateX: ['100%', '-100%'],
      easing: 'linear',
      duration: 20000,
      delay: anime.stagger(1000),
      // loop: true,
      update: function (animation) {
        if (animation.progress > 68) {
          animation.restart();
        }
      },
    });
  }, []);

  return (
    <div aria-hidden="true" className="fixed top-0 left-0 flex items-center h-screen w-screen max-w-screen justify-center overflow-hidden">
      {/* <div className="absolute md:absolute top-2 right-4 md:top-auto md:right-auto md:bottom-2 md:left-4 z-50">
        <div className="gap-3 items-center flex ">
          <FontAwesomeIcon icon={faUniversalAccess} className="text-xl text-sky-500 md:text-sky-400" />
          <h1 className="text-l bold hidden md:block text-white">Accessibility options</h1>
        </div>
      </div> */}
      <div className="h-full z-0 flex items-center justify-center overflow-hidden">
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
        <div className={styles.planePath}>
          <div className={`${styles.plane} animeTarget`}>
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-2xl text-rose-200" />
            <object type="image/svg+xml" data="/vapourTrails.svg" width="555" height="15"></object>
          </div>
        </div>
      </div>
    </div>
  );
}

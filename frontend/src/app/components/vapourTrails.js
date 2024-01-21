'use client';

import { useEffect } from 'react';
import anime from 'animejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './planes.module.css';

export function VapourTrails() {
  useEffect(() => {
    anime({
      autoplay: true,
      targets: '.animeTarget',
      translateX: ['100%', '-100%'],
      easing: 'linear',
      duration: 24000,
      delay: anime.stagger(1000),
      update: function (animation) {
        if (animation.progress > 68) {
          animation.restart();
        }
      },
    });
  }, []);

  return (
    <div
      aria-hidden='true'
      className='fixed top-0 left-0 flex items-center h-screen w-screen max-w-screen justify-center overflow-hidden select-none'>
      <div className='h-full flex items-center justify-center overflow-hidden'>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`${styles.planePath}`}>
            <div className={`${styles.plane} animeTarget`}>
              <FontAwesomeIcon icon={faPlane} className='rotate-180 text-2xl text-rose-200 blur-[2px]' />
              <object
                type='image/svg+xml'
                data='/vapourTrails.svg'
                width='555'
                height='15'
                aria-label='Plane animation trail svg'
                aria-hidden></object>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

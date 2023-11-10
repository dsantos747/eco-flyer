'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { VapourTrails } from './vapourTrails';

export function AccessibilitySwitch() {
  const [motion, setMotion] = useState(true);
  // const [popupMenu, setPopupMenu] = useState(false);
  // const menuRef = useRef(null);

  // const handleClick = (event) => {
  //   if (menuRef.current && !menuRef.current.contains(event.target)) {
  //     setPopupMenu(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClick);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClick);
  //   };
  // }, []);

  return (
    <div className="relative">
      <div className={`${motion ? 'hidden' : 'relative'} top-0`}>
        <div className="w-screen min-h-screen bg-gradient-to-t from-rose-100 to-blue-400 to-70% fixed top-0 left-0 -z-10"></div>
      </div>
      <div className="relative select-none z-30">
        <div className="gap-3 items-center flex hover:cursor-pointer" onClick={() => setMotion(!motion)}>
          <FontAwesomeIcon icon={faUniversalAccess} className="text-xl text-sky-400" />
          <h1 className="text-l bold">{motion ? 'Disable' : 'Enable'} Animation</h1>
        </div>
        {/* <div className="gap-3 items-center flex hover:cursor-pointer" onClick={() => setPopupMenu((curr) => !curr)}>
          <FontAwesomeIcon icon={faUniversalAccess} className="text-xl text-sky-400" />
          <h1 className="hidden md:block text-l bold">Accessibility options</h1>
        </div>
        {popupMenu && (
          <ul ref={menuRef} className={`absolute z-30 -top-12 p-2 pb-2 md:pl-8 bg-blue-900 rounded-t-md min-w-fit w-full`}>
            <li className="whitespace-nowrap hover:cursor-pointer" onClick={() => setMotion(!motion)}>
              {motion ? 'Disable' : 'Enable'} Animation
            </li>
          </ul>
        )} */}
      </div>
    </div>
  );
}

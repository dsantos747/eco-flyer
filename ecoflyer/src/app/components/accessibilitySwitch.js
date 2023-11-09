'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { VapourTrails } from './vapourTrails';

export function AccessibilitySwitch() {
  const [motion, setMotion] = useState(true);
  const [popupMenu, setPopupMenu] = useState(false);
  const menuRef = useRef(null);

  const handleClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setPopupMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div className="absolute">
      <div className={`${motion ? 'absolute' : 'hidden'} top-0`}>
        <VapourTrails></VapourTrails>
      </div>

      <div className="relative select-none z-10">
        <div className="gap-3 items-center flex hover:cursor-pointer" onClick={() => setPopupMenu((curr) => !curr)}>
          <FontAwesomeIcon icon={faUniversalAccess} className="text-xl text-sky-400" />
          <h1 className="hidden md:block text-l bold">Accessibility options</h1>
        </div>
        {popupMenu && (
          <ul ref={menuRef} className={`absolute -top-12 p-2 pb-2 md:pl-8 bg-blue-900 rounded-t-md min-w-fit w-full`}>
            {/* ${popupMenu ? 'absolute' : 'hidden'}  */}
            <li className="whitespace-nowrap hover:cursor-pointer" onClick={() => setMotion(!motion)}>
              {motion ? 'Disable' : 'Enable'} Animation
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

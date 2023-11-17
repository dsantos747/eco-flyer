'use client';

import { Tooltip } from 'react-tooltip';

export function ToolTip({ html, place, children }) {
  return (
    <div>
      <a className="flex whitespace-normal" data-tooltip-id="id" data-tooltip-html={html}>
        {children}
      </a>
      <Tooltip id="id" place={place} />
    </div>
  );
}

import { AccessibilitySwitch } from './accessibilitySwitch';

export function Footer() {
  return (
    <div className="py-2 px-6 justify-between items-center bg-blue-900 text-white max-w-screen">
      <AccessibilitySwitch></AccessibilitySwitch>
      <div className="flex-auto bg-blue-900">
        <h1 className="text-l text-right">Created by Daniel Santos</h1>
      </div>
    </div>
  );
}

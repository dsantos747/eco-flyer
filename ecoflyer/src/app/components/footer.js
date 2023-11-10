import { AccessibilitySwitch } from './accessibilitySwitch';

export function Footer() {
  return (
    <div className="relative">
      <div className="py-2 px-6 relative flex justify-between items-center bg-blue-900 text-white max-w-screen">
        <AccessibilitySwitch></AccessibilitySwitch>
        <div className="text-l text-right width-auto">&copy; Daniel Santos</div>
      </div>
    </div>
  );
}

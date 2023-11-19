import { titan } from "../fonts";
import styles from "./clouds.module.css";
import Link from "next/link";

export function Header() {
  return (
    <div className="w-full h-2 overflow-hidden flex place-content-center">
      {/* prettier-ignore */}
      <svg className="fixed" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <clipPath id="cloud-clip-path" clipPathUnits="objectBoundingBox">
          <path d="M0.03,0.731 C0.015,0.731,0.001,0.684,-0.009,0.611 L-0.01,0.606 L-0.01,0.07 L-0.009,0.065 C-0.009,0.065,-0.009,0.065,-0.009,0.065 L-0.01,0.07 L-0.01,-0.127 L0.99,-0.127 L0.99,0.399 L0.99,0.399 L0.99,0.625 L0.989,0.63 C0.98,0.69,0.967,0.729,0.954,0.729 C0.941,0.729,0.93,0.699,0.921,0.651 C0.91,0.739,0.892,0.79,0.871,0.79 C0.853,0.79,0.838,0.749,0.826,0.686 C0.816,0.79,0.801,0.849,0.782,0.849 C0.768,0.849,0.756,0.814,0.747,0.758 C0.743,0.771,0.738,0.778,0.733,0.778 C0.725,0.778,0.717,0.758,0.711,0.724 C0.702,0.786,0.69,0.826,0.676,0.826 C0.667,0.826,0.659,0.81,0.652,0.783 C0.643,0.832,0.632,0.861,0.619,0.861 C0.607,0.861,0.596,0.832,0.586,0.783 C0.579,0.828,0.57,0.849,0.559,0.849 C0.548,0.849,0.538,0.82,0.53,0.772 C0.521,0.831,0.509,0.861,0.495,0.861 C0.486,0.861,0.478,0.845,0.47,0.817 C0.467,0.829,0.464,0.838,0.46,0.838 C0.455,0.838,0.451,0.824,0.448,0.803 C0.439,0.847,0.428,0.873,0.415,0.873 C0.404,0.873,0.394,0.852,0.386,0.816 C0.378,0.847,0.369,0.861,0.36,0.861 C0.347,0.861,0.336,0.831,0.327,0.782 C0.32,0.82,0.312,0.838,0.303,0.838 C0.295,0.838,0.289,0.824,0.282,0.8 C0.274,0.846,0.263,0.873,0.251,0.873 C0.236,0.873,0.224,0.835,0.214,0.773 C0.209,0.784,0.204,0.79,0.199,0.79 C0.187,0.79,0.177,0.765,0.169,0.725 C0.164,0.737,0.16,0.742,0.154,0.742 C0.147,0.742,0.141,0.731,0.136,0.713 C0.126,0.796,0.111,0.849,0.094,0.849 C0.077,0.849,0.061,0.79,0.051,0.699 C0.045,0.72,0.038,0.731,0.03,0.731"></path>
        </clipPath>
      </svg>
      <div className="fixed w-[110vw] h-12 md:h-20 bg-rose-50 z-20 p-0" style={{ "clipPath": "url(#cloud-clip-path)" }}></div>
      <div className="fixed w-[110vw] top-2 h-12 md:h-20 bg-rose-200 z-10 p-0" style={{ "clipPath": "url(#cloud-clip-path)" }}></div>
      <h1 className={`text-3xl md:text-5xl fixed z-30 pt-1 md:pt-2 ${titan.className}`}>eco-flyer</h1>
    </div>
  );
}

export function HeaderSmall() {
  return (
    <header>
      <div className={styles.smallTitle}>
        <div className="absolute left-2 top-3 -rotate-12 z-30 bg-white opacity-100 transition hover:opacity-0">
          <Link href="/">
            <h1 className={`text-2xl text-black bg-white ${titan.className}`}>eco-flyer</h1>
          </Link>
        </div>
        <h1 className={`text-2xl absolute left-2 top-3 -rotate-12 z-20 opacity-100 text-blue-400 ${titan.className}`}>fly home</h1>
      </div>
      {/* <div className={styles.smallMenu}>
        <p>borgir</p>
      </div> */}
    </header>
  );
}

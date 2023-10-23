import { titan } from "../fonts";
import styles from "./clouds.module.css";
import Link from "next/link";

export function Header() {
  return (
    <header className={styles.cloudHead}>
      <object type="image/svg+xml" data="/clouds.svg" title="Cloud Header" className={`${styles.clouds} ${styles.header}`}></object>
      <h1 className={`text-6xl absolute ${titan.className}`}>eco-flyer</h1>
    </header>
  );
}

export function HeaderSmall() {
  return (
    <header>
      <div className={styles.smallTitle}>
        <h1 className={`text-2xl -rotate-12 ${titan.className}`}>
          <Link href="/">eco-flyer</Link>
        </h1>
      </div>
      <div className={styles.smallMenu}>
        <p>borgir</p>
      </div>
    </header>
  );
}

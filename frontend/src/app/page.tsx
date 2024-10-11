// src/app/page.js

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>NYC Emergency Dashboard</h1>
      <p className={styles.subtitle}>Coming Soon</p>
      <p className={styles.description}>
        A streamlined dashboard for displaying NYC emergency incident data for NYC first responders.
      </p>
    </main>
  );
}

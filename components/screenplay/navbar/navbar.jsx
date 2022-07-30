import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./navbar.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";

const Navbar = () => {
  const [shouldShrink, setShouldShrink] = useState(false);

  useEffect(() => {
    const resizeNavbar = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        setShouldShrink(true);
      } else {
        setShouldShrink(false);
      }
    };

    window.addEventListener("scroll", resizeNavbar);

    return () => {
      window.removeEventListener("scroll", resizeNavbar);
    };
  }, []);

  return (
    <header className={`${styles.header} ${shouldShrink ? styles.shrink : ""}`}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/screenplay">
            <h1>iWATCH</h1>
          </Link>
        </div>

        <ul className={styles.navbar__list}>
          <li>
            <Link href="/screenplay/discovery">Discovery</Link>
          </li>
          <li>
            <Link href="screenplay/movies">Movies</Link>
          </li>
          <li>
            <Link href="screenplay/tv">TV Shows</Link>
          </li>
        </ul>

        <div className={styles.navbar__search}>
          <input type="text" placeholder="search movies..." />
          {/* <NavbarSearch /> */}
        </div>

        <div className={styles.navbar__favorite}>
          <span>
            <BsSuitHeartFill size="2rem" color="red" /> Favorites
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

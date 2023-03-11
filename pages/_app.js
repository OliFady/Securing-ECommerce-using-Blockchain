import "../styles/globals.css";
import { NavBar } from "../components/componentsindex";
import { LockProvider } from "../Context/LockContext";

const MyApp = ({ Component, pageProps }) => (
  <div>
    <LockProvider>
      <NavBar />
      <Component {...pageProps} />
    </LockProvider>
  </div>
);

export default MyApp;

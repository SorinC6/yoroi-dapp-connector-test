import "./App.css";
import { Switch, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const [connectopAPi, setConnectorApi] = useState(null);
  const [walletId, setWalletId] = useState(null);
  const [walletPubKey, setWalletPublicKey] = useState(null);
  const location = useLocation();

  // check dapp connector connection when component mounts and every time a route chnaged the name
  useEffect(() => {
    checkWalletConnection();

    // console.log("STATE", { connectopAPi, walletId, walletPubKey });
  }, [location]);

  //  this function will be called by every page/when path is changing
  function checkWalletConnection(): string {
    if (window.cardano && typeof window.cardano?.yoroi === "undefined") {
      setConnectorApi(null);
    } else {
      console.log("Cardano API detected, checking connection status ");
      verifyWalletIdentification();
    }
  }

  function verifyWalletIdentification() {
    window.cardano &&
      window.cardano.yoroi &&
      window.cardano.yoroi
        .enable({ requestIdentification: true, onlySilent: true })
        .then(
          (api) => {
            onApiConnected(api);
          },
          (err) => {
            if (String(err).includes("onlySilent:fail")) {
              console.log("no silent re-connection available");
            } else {
              console.error(
                "Silent reconnection failed for unknown reason!",
                err
              );
            }
            // eventualy add a page spinner when load or refresh
          }
        )
        .catch((e) => {
          console.log(e);
        });
  }

  function onApiConnected(api) {
    console.log("CONNECTOR API", api);

    const auth = api.auth && api.auth();
    const authEnabled = auth && auth.isEnabled();
    console.log("authEnabled", authEnabled);
    console.log("CONNECTIP API AUTH", auth);

    if (authEnabled) {
      const walletId = auth.getWalletId();
      const walletPublicKey = auth.getWalletPubkey();
      setWalletId(walletId);
      setWalletPublicKey(walletPublicKey);
      setConnectorApi(auth);
    }
  }

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <NavLink exact to="/">
          Home
        </NavLink>
        <NavLink exact to="/contact">
          Contact
        </NavLink>
        <NavLink exact to="/about">
          About
        </NavLink>
      </div>
      <Switch>
        <Route exact path="/">
          <Home connectopAPi={connectopAPi} />
        </Route>
        <Route path="/contact">
          <Contact connectopAPi={connectopAPi} />
        </Route>
        <Route path="/about">
          <AboutUs connectopAPi={connectopAPi} />
        </Route>
      </Switch>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {walletId && (
          <p style={{ marginBottom: "10px" }}>WalletID======> {walletId}</p>
        )}
        {walletPubKey && (
          <p style={{ marginBottom: "10px" }}>WalletID====> {walletPubKey}</p>
        )}
        {connectopAPi && (
          <p style={{ marginBottom: "10px" }}>{connectopAPi.getWalletId()}</p>
        )}
      </div>
    </div>
  );
}

export default App;

const Home = ({ connectopAPi }) => {
  const [homeAPI, setHomeAPi] = useState(connectopAPi);
  console.log("CONNECTOR API", homeAPI);
  return (
    <>
      <h1>Home</h1>
      <p style={{ marginBottom: "10px" }}>{homeAPI && homeAPI.getWalletId()}</p>
    </>
  );
};
const Contact = () => {
  return <h1>Contact Us</h1>;
};
const AboutUs = () => {
  return <h1>About Us</h1>;
};

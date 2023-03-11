import React, { useState, useContext } from "react";
import Image from "next/image";
import { BsSearch } from "react-icons/bs";
import { LockContext } from "../../Context/LockContext";
import Style from "./NavBar.module.css";
import { Discover, Profile } from "./index";
import { Button } from "../componentsindex";
import { useRouter } from "next/router";
import images from "../../img";

const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [profile, setProfile] = useState(false);

  const router = useRouter();
  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if (btnText == "Discover") {
      setDiscover(true);
      setProfile(false);
    } else if (btnText == "Help Center") {
      setDiscover(false);
      setProfile(false);
    } else {
      setDiscover(false);
      setProfile(false);
    }
  };

  const openProfile = () => {
    if (!profile) {
      setProfile(true);
      setDiscover(false);
    } else {
      setProfile(false);
    }
  };

  const { currentAccount, connectWallet } = useContext(LockContext);
  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <Image
              onClick={() => router.push("/")}
              src={images.logo}
              alt="NFT MARKET PLACE"
              width={100}
              height={100}
            />
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Search NFT" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>

        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            <p onClick={(e) => openMenu(e)}>Discover</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_button}>
            {currentAccount == "" ? (
              <Button btnName="Connect" handleClick={() => connectWallet()} />
            ) : (
              <Button
                btnName="Create"
                handleClick={() => router.push("/uploadNFT")}
              />
            )}
          </div>

          <div className={Style.navbar_container_right_profile_box}>
            <div className={Style.navbar_container_right_profile}>
              <Image
                src={images.user1}
                alt="Profile"
                width={40}
                height={40}
                onClick={() => openProfile()}
                className={Style.navbar_container_right_profile}
              />

              {profile && <Profile currentAccount={currentAccount} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

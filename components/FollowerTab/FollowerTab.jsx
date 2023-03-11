import React from "react";
import { useRouter } from "next/router";
import Style from "./FollowerTab.module.css";
import FollowerTabCard from "./FollowerTabCard/FollowerTabCard";

const FollowerTab = ({ TopCreator }) => {
  const router = useRouter();
  return (
    <div className={Style.followerTab}>
      <div className={Style.followerTab_title}>
        <h2> Top Creators List..</h2>
        <div className={Style.followerTab_tabs}></div>
      </div>

      {
        <div className={Style.followerTab_box}>
          {TopCreator.map((el, i) => (
            <FollowerTabCard key={i + 1} i={i} el={el} />
          ))}
        </div>
      }

      <div className={Style.followerTab_member}>
        <div className={Style.followerTab_member_box}>
          <a
            onClick={() => router.push("/author")}
            style={{ cursor: "pointer" }}
          >
            Become, author
          </a>
        </div>
      </div>
    </div>
  );
};

export default FollowerTab;

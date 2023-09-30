import React, { FC } from "react";
import styles from "./avatar.module.css";

interface AvatarProps {
  fullName: string;
  color: string;
}

const Avatar: FC<AvatarProps> = ({ fullName, color }) => {
  const [name, surname] = fullName.split(" ");
  const initials = name[0] + surname[0];

  return (
    <div className={styles.avatar} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
};
export default Avatar;

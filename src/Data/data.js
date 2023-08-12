import { GiHamburgerMenu } from "react-icons/gi";
import GoogleButton from "react-google-button";
import { VscChromeClose } from "react-icons/vsc";
import { BiNetworkChart } from "react-icons/bi";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import DefaultImage from "../../src/assets/default.png";

export const links = [
  { id: "1", title: "მთავარი", url: "/" },
  { id: "3", title: "პროექტი", url: "/about" },
  // { id: "2", title: "კაბინეტი", url: "/:userID" },

  // { id: "4", title: "შესვლა", url: "/login" },
];

export const GoogleSignIn = GoogleButton;
export const BurgerMenu = GiHamburgerMenu;
export const CloseIcon = VscChromeClose;
export const FooterIcon = BiNetworkChart;
export const FaceBookIcon = FaFacebook;
export const TwitterIcon = FaTwitter;
export const InstagramIcon = FaInstagram;
export const DefaultAvatar = DefaultImage;

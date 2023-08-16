import { GiHamburgerMenu } from "react-icons/gi";
import GoogleButton from "react-google-button";
import { VscChromeClose } from "react-icons/vsc";
import { BiNetworkChart } from "react-icons/bi";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { HiUserCircle } from "react-icons/hi";
import { BsFillTaxiFrontFill } from "react-icons/bs";

export const links = [
  { id: "1", title: "main", url: "/" },
  { id: "2", title: "project", url: "/about" },
  { id: "3", title: "about", url: "/about" },

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
export const UserAvatar = FiUserCheck;
export const ProfileAvatar = HiUserCircle;
export const NavLogo = BsFillTaxiFrontFill;

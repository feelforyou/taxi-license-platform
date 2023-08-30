import { GiHamburgerMenu } from "react-icons/gi";
import GoogleButton from "react-google-button";
import { VscChromeClose } from "react-icons/vsc";
import { BiNetworkChart, BiSquareRounded } from "react-icons/bi";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { HiUserCircle } from "react-icons/hi";
import { BsFillTaxiFrontFill } from "react-icons/bs";
import { FaFacebookMessenger } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { GoChevronDown } from "react-icons/go";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

export const links = [
  { id: "1", title: "HOME", url: "/" },

  { id: "2", title: "CARS", url: "/cars" },
];

export const GoogleSignIn = GoogleButton;
export const BurgerMenu = GiHamburgerMenu;
export const SquareRounded = BiSquareRounded;
export const ChevronDown = GoChevronDown;
export const CloseIcon = VscChromeClose;
export const FooterIcon = BiNetworkChart;
export const FaceBookIcon = FaFacebook;
export const TwitterIcon = FaTwitter;
export const InstagramIcon = FaInstagram;
export const UserAvatar = FiUserCheck;
export const ProfileAvatar = HiUserCircle;
export const NavLogo = BsFillTaxiFrontFill;
export const Messenger = FaFacebookMessenger;
export const DefaultImage = FaImage;
export const DeleteIcon = MdOutlineDeleteOutline;
export const EditIcon = AiOutlineEdit;

import {
  Binoculars,
  Home,
  Info,
  Layers,
  LockOpen,
  MessageCircle,
} from "lucide-react";

export const navLinks = [
  {
    name: "Home",
    link: "/",
    icon: Home,
  },
  {
    name: "About",
    link: "#about",
    icon: Info,
  },
  {
    name: "Features",
    link: "#features",
    icon: Layers,
  },

  {
    name: "Chat",
    link: "/chat",
    icon: Binoculars,
  },
  {
    name: "Join Community",
    link: "#joincommunity",
    icon: MessageCircle,
  },
  {
    name: "Login",
    link: "/login",
    icon: LockOpen,
  },
];

export const displayCoreFeatures = [
  "Welcome to 3lite",
  "Privacy is a right, not a luxury",
  "Blazing Fast Messaging",
];

export const testimonials = [
  {
    name: "Josh Sparks",
    title: "Seamless Transactions!",
    description:
      "The wallet feature is a life-saver! I can send payments just as easily as sending a message—no complicated wallet addresses needed. 3lite has made transactions simple and secure.",
  },
  {
    name: "Big Cee",
    title: "Totally Amazing!",
    description:
      "I’ve never felt more in control of my privacy. 3lite user-friendly design and blockchain-based security make it my go-to messaging app for all my personal and professional communications.",
  },
  {
    name: "Ugwu Chidi",
    title: "Unmatched Privacy and Speed",
    description:
      "3lite has completely changed how our team communicates. With top-notch privacy features and lightning-fast messaging, we can stay connected securely without any worries about data leaks!",
  },
];

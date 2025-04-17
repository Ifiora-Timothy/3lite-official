import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronsRightIcon } from "lucide-react";
import CustomIcon from "./ui/CustomIcon";

const Footer = () => {
  const links = [
    {
      title: "About Us",
      href: "#",
    },
    {
      title: "Our Services",
      href: "#",
    },
    {
      title: "Community",
      href: "#",
    },
    {
      title: "Testimonials",
      href: "#",
    },
    {
      title: "FAQ",
      href: "#",
    },
    {
      title: "Privacy Policy",
      href: "/privacy",
    },
  ];

  return (
    <section className="w-full relative overflow-hidden">
      <div className="lg:p-[120px] sm:p-[80px] p-[30px] lg:pb-[60px] pb-[60px] w-full">
        <div className="grid grid-cols-12 gap-y-[40px]">
          <div className="lg:col-[1/3] flex justify-center items-start col-span-6">
            <div className="w-[100px] rounded-full relative">
              <Image
                src="/general/logo.jpg"
                width={100}
                height={100}
                className="w-full rounded-full h-full"
                alt="logo"
              />
            </div>
          </div>

          <div className="justify-center col-span-6 lg:col-[3/8] font-syne items-start flex">
            <div className="flex-col justify-start items-start gap-4 inline-flex font-Poppins">
              <div className="text-white text-sm font-bold">Quick Links</div>
              <div className="flex-col justify-start items-start gap-3 flex opacity-60">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-white underline-under flex items-center gap-1 decoration-slate-400 underline-offset-2 text-sm font-normal"
                  >
                    <ChevronsRightIcon size={16} />
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-full lg:col-[8/13] justify-center items-start gap-7 inline-flex">
            <div className="flex-col gap-5 justify-between items-start flex">
              <div className="py-0.5 flex-row gap-1 lg:flex-col justify-start items-start flex">
                <div
                  style={{
                    WebkitTextFillColor: "transparent",
                  }}
                  className="bg-gradient-to-b from-[#FFFFFF] to-slate-600 bg-clip-text mx-auto text-center flex justify-center font-Syne w-full font-semibold text-2xl sm:text-3xl"
                >
                  <h1>Join the 3lite </h1>
                </div>

                <div className="self-stretch text-white text-2xl sm:text-3xl font-semibold font-['Tomato Grotesk']">
                  Community
                </div>
              </div>

              <div className="w-fit max-w-full pl-5 rounded-[99px] border border-[#77679f] justify-between items-center flex">
                <input
                  type="text"
                  placeholder="Enter Your Gmail"
                  className="grow shrink outline-none bg-transparent text-white sm:text-lg text-sm font-medium"
                />

                <div className="shrink-0 bg-gradient-to-b hover:bg-gradient-to-t hover:pb-[1px] active:p-[0.4px] rounded-full from-[#77679F] to-[rgba(119,103,159,0)] pt-[1px] px-[1px]">
                  <div className="rounded-full bg-background">
                    <button className="font-syne h-[50px] p-2 sm:p-[10px_35px] rounded-none sm:rounded-full text-white text-sm sm:text-lg font-normal bg-gradient-to-r from-[#140F2A] to-[#472F8C] hover:opacity-90 transition-opacity">
                      Join us
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <CustomIcon
                  name="instagram"
                  width={33}
                  height={33}
                  className=""
                />
                <CustomIcon
                  name="linkedin"
                  width={33}
                  height={33}
                  className=""
                />
                <CustomIcon
                  name="facebook"
                  width={33}
                  height={33}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Big App Name Section */}
      <div className="relative bg-gradient-to-b from-brand from-70% to-blue-800  h-[200px]">
        <div className="w-full pt-4 absolute -bottom-4 left-0 ">
          <h1 className="text-center font-black text-transparent  bg-clip-text bg-gradient-to-b from-[#FFFFFF] to-[#77679F] text-5xl md:text-6xl lg:text-[10rem] font-['Tomato Grotesk']">
            3lite Messenger
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Footer;

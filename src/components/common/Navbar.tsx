"use client";
import { signOutApi } from "@/services/AuthService";
import { getCurrentUser } from "@/services/postServices";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  type UserProps = {
    username?: string;
    profileImageUrl?: string;
  };

  const [user, setUser] = useState<UserProps | null>(null);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res)
        setIsAuthenticated(!!res);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await signOutApi();
      if (res.ok) {
        alert("Logged out successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/post" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full h-16 bg-neutral-100 text-black flex justify-between items-center px-6 md:px-16 py-4 relative">
      <Link href="/" className="text-2xl text-neutral-800 font-bold">
        Blog
      </Link>

      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        <GiHamburgerMenu className="text-neutral-800 text-2xl" />
      </button>

      <ul className="hidden md:flex space-x-6 items-center">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
        {/* Profile Icon */}
        <li className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center focus:outline-none"
            type="button"
          >
            {user ? (
              // user exists → show avatar with initials or profile image
              <Avatar className="h-10 w-10">
                {user.profileImageUrl ? (
                  <AvatarImage
                    src={user.profileImageUrl}
                    alt={user.username || "profile image"}
                  />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-xl">
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            ) : (
              <FaUserCircle className="text-2xl text-neutral-700 hover:text-neutral-900 transition-colors" />
            )}
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded py-2 z-50">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </li>
      </ul>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="flex flex-col space-y-4 absolute top-16 left-0 w-full bg-white shadow-md py-6 z-50 md:hidden items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-neutral-700 hover:text-neutral-900 transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {/* Profile Icon for mobile */}
          <li>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center focus:outline-none"
              type="button"
            >
              <FaUserCircle className="text-2xl text-neutral-700 hover:text-neutral-900 transition-colors" />
            </button>
            {showProfileMenu && (
              <div className="mt-2 w-40 bg-white shadow-lg rounded py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                      type="button"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsOpen(false);
                    }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

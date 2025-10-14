"use client";
import { signOutApi } from "@/services/AuthService";
import { getCurrentUser } from "@/services/postServices";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
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
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (!isMounted) return;
        setUser(res);
        setIsAuthenticated(!!res);
      } catch (error) {
        console.error("Error checking authentication:", error);
        if (!isMounted) return;
        setIsAuthenticated(false);
      }
    };

    const handleAuthChanged = () => {
      checkAuth();
    };

    const handleVisibilityOrFocus = () => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        checkAuth();
      }
    };

    checkAuth();
    if (typeof window !== "undefined") {
      window.addEventListener("auth-changed", handleAuthChanged);
      window.addEventListener("focus", handleVisibilityOrFocus);
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    }

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("auth-changed", handleAuthChanged);
        window.removeEventListener("focus", handleVisibilityOrFocus);
      }
      if (typeof document !== "undefined") {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityOrFocus
        );
      }
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
  ];

  return (
    <>
      <nav className="w-full h-26 text-gray-50 flex justify-between items-center px-6 md:px-16 py-2 relative sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        {/* Left side - Nav links (desktop only) */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-neutral-900 hover:text-neutral-900 transition-colors text-lg font-medium"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger menu (mobile only) */}
        <button
          className="md:hidden z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          {isOpen ? (
            <IoClose className="text-neutral-800 text-2xl" />
          ) : (
            <GiHamburgerMenu className="text-neutral-800 text-2xl" />
          )}
        </button>

        {/* Center - Logo (truly centered) */}
        <Link
          href="/"
          className="absolute left-1/2 transform -translate-x-1/2 text-6xl text-neutral-800 font-bold logo"
        >
          <h1>./localhost</h1>
        </Link>

        {/* Right side - Profile */}
        <div className="relative z-50" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
            type="button"
            aria-label="Profile menu"
          >
            {user ? (
              <Avatar className="h-10 w-10 cursor-pointer">
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
              <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center hover:bg-neutral-300 transition-colors">
                <svg
                  className="w-6 h-6 text-neutral-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 border border-neutral-200">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile
                  </Link>
                  <hr className="my-1 border-neutral-200" />
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Horizontal line - not full width */}
      <hr className="border-neutral-300 mx-auto w-[95%]" />

      {/* Mobile menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Menu */}
          <div className="fixed top-16 left-0 w-full bg-white shadow-md py-6 z-40 md:hidden animate-slideDown">
            <ul className="flex flex-col space-y-4 items-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;

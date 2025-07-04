"use client"

import Link from "next/link"
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "next/navigation"
import {
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiSettings,
  FiMapPin,
  FiSliders
} from "react-icons/fi"
import { FaCar } from "react-icons/fa";

import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-teal-400 via-pink-400 to-blue-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg transition group-hover:scale-105">
              <FaCar className="text-white text-2xl" />
            </span>
            <div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center">
                Traffic Montenegro
              </span>
              <span className="text-xs text-orange-600 dark:text-yellow-300 font-medium mt-1 flex items-center gap-1">
                <FaCar className="inline-block mr-1" />
                Traffic jam in 
                <ReactCountryFlag countryCode="ME" svg style={{ width: "1.5em", height: "1.5em", marginLeft: "0.25em" }} />
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme} 
              className="w-9 h-9 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? (
                <FiMoon className="h-5 w-5 text-teal-500" />
              ) : (
                <FiSun className="h-5 w-5 text-yellow-400" />
              )}
            </Button>

            {/* User menu or login/register */}
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                          <AvatarFallback>
                            {user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-56 border border-gray-200 dark:border-gray-700" 
                      align="end" 
                      forceMount
                    >
                      <div className="flex items-center gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.full_name}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/profile" className="flex items-center w-full">
                          <FiUser className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/settings" className="flex items-center w-full">
                          <FiSettings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white shadow">
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
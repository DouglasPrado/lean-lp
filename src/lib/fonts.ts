import localFont from "next/font/local"
import { Inter } from "next/font/google"

export const calSans = localFont({
  src: "../../public/fonts/CalSans-SemiBold.otf",
  variable: "--font-cal-sans",
  display: "swap",
})

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

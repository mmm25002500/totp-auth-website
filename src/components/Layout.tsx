import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LayoutData } from "@/types/Layout/Layout";

const Layout = ({ children }: LayoutData) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout;
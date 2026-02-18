"use client";

import { usePathname } from "next/navigation";

// Pages where the hero extends behind the navbar (no top padding)
const HERO_PAGES = ["/", "/products", "/about", "/articles", "/bespoke"];

// Pages where navbar is hidden (no padding needed at all)
const NO_NAVBAR_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

function isHeroPath(pathname) {
    if (HERO_PAGES.includes(pathname)) return true;
    if (pathname.startsWith("/category/")) return true;
    return false;
}

export default function PageWrapper({ children }) {
    const pathname = usePathname();

    // Auth pages have no navbar, so no padding
    if (NO_NAVBAR_PAGES.includes(pathname)) {
        return <>{children}</>;
    }

    const isHeroPage = isHeroPath(pathname);
    const isAdminPage = pathname.startsWith("/admin");

    return (
        <div className={`${isAdminPage ? "pt-[70px]" : isHeroPage ? "pt-0" : "pt-[140px] md:pt-[160px]"} ${!isHeroPage ? "bg-white" : ""}`}>
            {children}
        </div>
    );
}

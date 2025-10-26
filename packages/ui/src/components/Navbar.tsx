"use client";

import { tv, type VariantProps } from "tailwind-variants";
import {ReactNode} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

const navbar = tv({
  base: "flex justify-center items-center transition-all duration-200",
  slots: { 
    sectionLeft: "flex items-center ml-2.5 space-x-2 flex-1",
    sectionCenter: "hidden md:flex justify-center flex-1",
    sectionRight: "flex items-center justify-end space-x-3 flex-1",
    brand: "flex items-center",
    title: "text-2xl font-bold text-gray-400",    
    navLinks: "flex items-center space-x-4",
    link: "hover:text-blue-600 ring-0 hover:ring rounded-[16px] p-1.5 ",
    menuToggle: "flex md:hidden",
    actions: "hidden md:flex items-center space-x-2",
    avatar: "flex items-center cursor-pointer",
  },
  variants: {
    variant: {      
      admin: "sticky top-0 z-50 bg-background py-2.5 px-1.5 flex justify-center items-center"
    }
  },
  defaultVariants: {
    variant: "admin"
  }
});



export interface NavbarProps extends VariantProps<typeof navbar> {
  theme?: "light" | "dark";
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  menuToggle?: ReactNode;
  links?: { label: string; href: string }[];
  brand?: ReactNode;
  avatar?: ReactNode;
  sidenav?: ReactNode;
}

export function Navbar({  
  title,
  actions,
  links,
  brand,
  avatar,
  menuToggle,
  sidenav
}: NavbarProps)

{
  const styles = navbar({});
  const pathname = usePathname();

  return (
    <nav className={styles.base()}>     
      <div className={styles.sectionLeft()}>
        <div className={styles.brand()}>
          {brand}          
          <span className={styles.title()}>{title}</span>          
        </div>
      </div>

      <div className={styles.sectionCenter()}>
        {links &&
          <div className={styles.navLinks()}>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return(
                <Link
                  key={link.label}
                  href={link.href}
                  className={`
                    p-1.5 rounded-xl transition-all duration-500                 
                    ${isActive ? "text-white bg-blue-600" : "hover:ring hover:text-blue-600"}
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        }
      </div>

      <div className={styles.sectionRight()}>    
        {menuToggle && <div className={styles.menuToggle()}>{menuToggle}</div>}    
        {actions && <div className={styles.actions()}>{actions}</div>}
        {avatar && <div className={styles.avatar()}>{avatar}</div>}
      </div>
      {sidenav}
    </nav>
  );
}
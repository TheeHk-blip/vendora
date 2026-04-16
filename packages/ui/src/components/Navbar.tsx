"use client";

import {tv, type VariantProps} from "tailwind-variants";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navbar = tv({
  slots: {
    wrapper: "w-full transition-all duration-300",
    sectionLeft: "flex items-center",
    sectionCenter: "",
    sectionRight: "flex items-center",
    brand: "flex items-center",
    search: "flex items-center mx-auto",
    title: "hidden md:flex transition-opacity duration-300",
    navLinks: "flex gap-2",
    actions: "hidden md:flex gap-1 md:gap-3",
    link: "",
    menuToggle: "flex md:hidden items-center gap-2.5",
    avatar: "flex items-center cursor-pointer",
  },

  variants: {
    app: {
      landing: {
        wrapper: "flex flex-row items-center justify-center sticky top-0 z-50 bg-background px-2.5 py-2.5",
        sectionLeft: "flex items-center space-x-2 flex-1",
        sectionCenter: "flex justify-center flex-1",
        sectionRight: "flex items-center justify-end space-x-3 flex-1",
        actions: "items-center gap-2",
        brand: "flex md:hidden"
      },
      store: {
        wrapper: "grid grid-cols-12 items-center sticky top-0 z-50 px-1.5 md:px-2.5 md:py-2.5 bg-background",   
        sectionLeft: "flex items-center space-x-2 md:flex-1 col-span-3 md:col-span-2",  
        brand: "md:hidden flex w-fit",          
        sectionCenter: "flex justify-center flex-1 col-span-7",        
        sectionRight: "flex items-center justify-end flex-1 col-span-3 md:col-span-3",
        actions: "items-center"
      },
      admin: {
        wrapper: "flex flex-col sticky top-0 px-1.5 pb-2 h-screen w-[240px] shadow-sm shadow-black/30 dark:shadow-black border-r border-gray-100 dark:border-zinc-600",
        sectionLeft: "flex mb-2.5",
        brand: "flex w-full justify-between",
        sectionCenter: "flex-1",
        sectionRight: "flex items-center my-auto",
        navLinks: "flex flex-col",
        actions: "flex flex-col w-full"
      },
      adminnav: {
        wrapper: "flex flex-row items-center px-1.5 py-1.5 sticky top-0 max-w-full mx-auto mb-3.5 z-50 bg-background",
        sectionLeft: "flex items-center space-x-2 flex-1",
        brand: "flex md:hidden",
        sectionCenter: "md:hidden flex justify-center flex-1",
        sectionRight: "flex items-center justify-end space-x-2 flex-1",
        actions: "flex"
      },
      storeFilter: {
        wrapper: "flex flex-col px-1 sticky top-17 h-[calc(100vh-[80px])] z-30 w-full overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        sectionLeft: "flex mb-2.5 w-full items-center",
        brand: "flex w-full justify-start items-center",
        search: "w-full " ,
        sectionCenter: "flex-1",
        sectionRight: "flex items-center my-auto",
        navLinks: "flex flex-col space-y-2",
        actions: "flex flex-col w-full"
      }
    },

    sticky: {
      true: "sticky top-0 z-50"
    },
  },

  defaultVariants: {
    app: "landing",
    sticky: true,
  }
});

const navLink = tv({
  base: "text-gray-600 dark:text-gray-300 flex px-2 py-1 font-medium transition-all duration-300 rounded-xl",
  variants: {
    app: {
      landing: "ring-0 hover:ring hover:text-blue-600 gap-2 md:gap-4",
      store: "ring-0 hover:ring hover:text-green-600 gap-2",
      admin: "text-neutral-700 dark:text-neutral-400 hover:text-purple-700 hover:dark:text-purple-700 hover:bg-white/50 dark:hover:bg-black/50 gap-2",
      adminnav: " ring-0 hover:ring hover:text-purple-600 gap-2 md:gap-4",
      storeFilter: "gap-2 md:gap-4"
    },
    active: {
      true: "",
    },
  },

  compoundVariants: [
    {
      app: "landing",
      active: true,  
      className: "text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-slate-800 hover:text-white dark:hover:text-white hover:bg-blue-500 hover:ring-0 scale-[1.05]"
    },
    {
      app: "store",
      active: true,
      className: "text-green-700 dark:text-green-500 bg-lime-600/15 dark:bg-green-300/15 hover:ring-0"
    },
    {
      app: "admin",
      active: true,
      className: "text-purple-700 dark:text-purple-700 bg-purple-500/15 dark:bg-purple-400/10"
    },  
    {
      app: "adminnav",
      active: true,
      className: "text-purple-700 dark:text-purple-700 bg-purple-500/15 dark:bg-purple-400/10 hover:ring-0 scale-105"
    }    
  ],
  defaultVariants: {
    active: false
  }
});

export interface NavbarProps extends VariantProps<typeof navbar> {
  theme?: "light" | "dark";
  app?: "landing" | "store" | "admin" | "adminnav" | "storeFilter";
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  menuToggle?: ReactNode;
  links?: { label: string; href: string; icon?:any }[];
  brand?: ReactNode;
  search?: ReactNode;
  avatar?: ReactNode;
}

export function Navbar({  
  title,
  app,
  sticky,
  actions,
  links,
  brand,
  search,
  avatar,
  menuToggle,
}: NavbarProps)

{
  const styles = navbar({ app, sticky });
  const pathname = usePathname();

  return (
    <nav className={styles.wrapper()}>     
      <div className={styles.sectionLeft()}>
        <span className={styles.brand()}>{brand} </span>                   
        <span className={styles.title()}>{title}</span>
        <div className={styles.search()}>{search}</div>        
      </div>

      <div className={styles.sectionCenter()}>
        {links &&
          <div className={styles.navLinks()}>
            {links.map((link, index) => {
              const isActive = pathname === link.href;
              return(
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${navLink({ app, active: pathname === link.href})} ${index >=3 ? "hidden md:flex" : "flex"}`}
                  aria-current={isActive ? "page" : undefined}
                >                  
                  {link.icon && <span className="hidden md:flex" ><link.icon /></span>}
                  <span>{link.label}</span>
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
    </nav>    
  );
}
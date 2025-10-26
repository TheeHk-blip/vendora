"use client";

import { tv, type VariantProps } from "tailwind-variants";
import { ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";

const card = tv({
  base: "relative overflow-hidden rounded-2xl transition-all duration-300",
  variants: {
    variant: {
      flat: "p-1.5",
      solid: "bg-white/35 dark:bg-zinc-700/30 backdrop-blur-md rounded-[30px] p-4",
      outlined: "border-2 border-border bg-background shadow-sm",
      glass: "flex flex-col bg-gradient-to-b from-gray-200 -to-transparent dark:from-zinc-800 -to-transparent dackdrop-blur-sm shadow-sm shadow-black/30",
      admin: "p-3 rounded-xl bg-black/10 dark:bg-white/40 shadow-sm shadow-black/25",
      admin_card: "p-2 rounded-xl bg-black/10 dark:bg-zinc-700/40"
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    },
    hoverable: {
      true: "hover:scale-[1.02] hover:shadow-lg cursor-pointer transition-all duration-300",
    },
  },
  defaultVariants: {
    variant: "solid",  
  },
  slots: {
    background: "absolute inset-0 bg-cover bg-center -z-10",
    overlay: "absolute inset-0 -z-10 bg-white/10 dark:bg-black/20",
    image: "w-full h-48 object-cover rounded-xl",
    header: "pt-2",
    body: "p-5 text-sm relative z-10",
    footer: "text-sm relative mt-auto z-10 ",
  },
});

export interface CardProps extends VariantProps<typeof card> {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  imageSrc?: any;
  backgroundSrc?: string;
  lightSrc?: string;
  darkSrc?: string;
  overlay?: boolean;
  className?: string;
}

export function Card({
  variant,
  shadow,
  hoverable,
  children,
  header,
  footer,
  imageSrc,
  backgroundSrc,
  lightSrc,
  darkSrc,  
  overlay,
  className
}: CardProps) {
  const styles = card({ variant, shadow, hoverable });
  const { theme } = useTheme();

  const currentTheme = theme ?? "light"
  const backgroundUrl = backgroundSrc || (currentTheme === "dark" ? darkSrc : lightSrc) 

  useEffect(() => {
    const urls = [lightSrc, darkSrc, backgroundSrc].filter(Boolean) as string[];
    const imgs: HTMLImageElement[] = [];
    for (const u of urls) {
      const i = new Image();
      i.src = u;
      imgs.push(i);
    }
    return () => {
      imgs.length = 0;
    }
  }, [lightSrc, darkSrc, backgroundSrc])

  return (
    <div className={styles.base({ class: className})}>
      {/* 🔹 Background slot */}
      {(lightSrc || darkSrc) && (
        <div 
          className={styles.background()}
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}

      {overlay && backgroundUrl && <div className={styles.overlay()} />}

      {/* 🔹 Image slot */}
      {imageSrc && <img src={imageSrc} loading="lazy" alt="card image" className={styles.image()} />}

      {/* 🔹 Header */}
      {header && <div className={styles.header()}>{header}</div>}

      {/* 🔹 Body */}
      {children && <div className={styles.body()}>{children}</div>}

      {/* 🔹 Footer */}
      {footer && <div className={styles.footer()}>{footer}</div>}
    </div>
  );
}

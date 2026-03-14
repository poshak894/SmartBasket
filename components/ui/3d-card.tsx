"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type CardContextValue = {
  mouseX: number;
  mouseY: number;
};

const CardContext = React.createContext<CardContextValue>({ mouseX: 0, mouseY: 0 });

export function CardContainer({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const [mouse, setMouse] = React.useState({ mouseX: 0, mouseY: 0 });

  return (
    <div
      className={cn("flex items-center justify-center [perspective:1000px]", className)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
        const mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
        setMouse({ mouseX, mouseY });
      }}
      onMouseLeave={() => setMouse({ mouseX: 0, mouseY: 0 })}
    >
      <CardContext.Provider value={mouse}>{children}</CardContext.Provider>
    </div>
  );
}

export function CardBody({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const { mouseX, mouseY } = React.useContext(CardContext);

  return (
    <div
      className={cn("relative transition-transform duration-200 ease-out [transform-style:preserve-3d]", className)}
      style={{
        transform: `rotateX(${mouseY}deg) rotateY(${mouseX}deg)`
      }}
    >
      {children}
    </div>
  );
}

type CardItemProps<T extends React.ElementType> = {
  as?: T;
  translateZ?: number | string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function CardItem<T extends React.ElementType = "div">({
  as,
  translateZ = 0,
  children,
  className,
  ...props
}: CardItemProps<T>) {
  const Component = as ?? "div";
  const z = typeof translateZ === "number" ? `${translateZ}px` : translateZ;

  return (
    <Component
      className={cn("transition-transform duration-200 ease-out [transform-style:preserve-3d]", className)}
      style={{ transform: `translateZ(${z})` }}
      {...props}
    >
      {children}
    </Component>
  );
}

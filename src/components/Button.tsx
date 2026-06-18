"use client";

import { forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const variantStyles = {
  primary:
    "bg-accent text-white hover:bg-terra-700 active:bg-terra-800 shadow-sm hover:shadow-md",
  outline:
    "border border-earth-300 text-text hover:border-accent hover:text-accent active:border-terra-800",
  ghost:
    "text-text-muted hover:text-text hover:bg-earth-100/50 active:bg-earth-200/50",
} as const;

const sizeStyles = {
  sm: "px-5 py-2 text-[0.6875rem] leading-none",
  md: "px-7 py-3 text-[0.8125rem] leading-none",
  lg: "px-9 py-4 text-[0.875rem] leading-none",
} as const;

type ButtonVariant = keyof typeof variantStyles;
type ButtonSize = keyof typeof sizeStyles;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = "primary",
      size = "md",
      className,
      children,
      ...rest
    } = props;

    const classes = clsx(
      "inline-flex items-center justify-center gap-2",
      "font-sans font-medium tracking-[0.04em] uppercase",
      "rounded-full transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page",
      "disabled:pointer-events-none disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (typeof (props as ButtonAsLink).href === "string") {
      const { href, ...linkRest } = rest as Omit<
        ComponentPropsWithoutRef<typeof Link>,
        keyof ButtonBaseProps
      > & { href: string };
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...linkRest}
        >
          {children}
        </Link>
      );
    }

    const { ...buttonRest } = rest as ComponentPropsWithoutRef<"button">;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...buttonRest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export type { ButtonVariant, ButtonSize };
export { Button };
export default Button;

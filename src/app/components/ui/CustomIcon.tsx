"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

interface CustomIconProps {
  name: string;
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
  fallbackIcon?: string;
  [key: string]: any;
}

// Icon cache to prevent reloading icons
const iconCache = new Map();

// Component placeholder for loading state
const LoadingPlaceholder = ({ width = 24, height = 24 }) => (
  <span style={{ width, height, display: "inline-block" }}></span>
);

// Component placeholder for error state
const ErrorPlaceholder = ({ width = 24, height = 24 }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: "currentColor",
      opacity: 0.3,
      borderRadius: "4px",
    }}
  />
);

const CustomIcon = ({
  name,
  width = 24,
  height = 24,
  fill,
  color = "currentColor",
  fallbackIcon = "default",
  ...props
}: CustomIconProps) => {
  const [error, setError] = useState(false);
  const [iconName, setIconName] = useState(name);

  // Handle icon loading errors
  useEffect(() => {
    // Reset error state when icon name changes
    if (name !== iconName) {
      setError(false);
      setIconName(name);
    }
  }, [name, iconName]);

  // Switch to fallback when error occurs
  useEffect(() => {
    if (error && iconName !== fallbackIcon) {
      setIconName(fallbackIcon);
      setError(false);
    }
  }, [error, fallbackIcon, iconName]);

  // Get or create the dynamic component
  let IconComponent = iconCache.get(iconName);

  if (!IconComponent) {
    IconComponent = dynamic(
      () =>
        import(`@/assets/icons/${iconName}.svg`).catch(() => {
          setError(true);
          return ErrorPlaceholder;
        }),
      {
        loading: () => <LoadingPlaceholder width={width} height={height} />,
        ssr: false, // Add this to prevent SSR issues
      }
    );

    // Cache the component
    iconCache.set(iconName, IconComponent);
  }

  return (
    <IconComponent
      width={width}
      height={height}
      fill={fill}
      color={color}
      {...props}
    />
  );
};

export default React.memo(CustomIcon);

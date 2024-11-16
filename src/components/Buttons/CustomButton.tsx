import React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import tinycolor from "tinycolor2";

interface ArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  text: string;
  textColor?: string;
  buttonOverlayColor?: string;
  buttonColor?: string;
  iconColor?: string;
  className?: string;
  icontype?: "play" | "pause" | "reset";
  borderColor?: string;
}

export default function CustomButton({
  text = "Open",
  textColor = "white",
  buttonOverlayColor = "#bf49ff",
  borderColor = "#bf49ff",
  buttonColor = "#c284f9",
  iconColor = "white",
  className,

  ...props
}: ArrowButtonProps) {
  const tyColor = tinycolor(props.color);

  textColor = tyColor.darken(0).toString() || textColor;
  borderColor = props.color || borderColor;
  buttonOverlayColor = props.color || buttonOverlayColor;
  buttonColor = tyColor.desaturate(30).darken(30).toString() || buttonColor;

  return (
    <button
      style={{
        borderColor: borderColor,
        backgroundColor: buttonColor,
      }}
      {...props}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-red-950  px-6 py-3 font-medium shadow-md transition duration-300 ease-out ${className}`}
    >
      <span
        style={{ background: buttonOverlayColor }}
        className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-purple-400 text-white duration-300 group-hover:translate-x-0"
      >
        {props.icontype === "play" && <Play style={{ color: iconColor }} />}
        {props.icontype === "pause" && <Pause style={{ color: iconColor }} />}
        {props.icontype === "reset" && (
          <RotateCcw style={{ color: iconColor }} />
        )}
      </span>
      <span
        style={{ color: textColor }}
        className="absolute flex h-full w-full transform items-center justify-center font-bold transition-all duration-300 ease-in-out group-hover:translate-x-full font-mono"
      >
        {text.toUpperCase()}
      </span>
      <span className="invisible relative">Button</span>
    </button>
  );
}

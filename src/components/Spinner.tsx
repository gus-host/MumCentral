import clsx from "clsx";
import { Loader2 } from "lucide-react";

function Spinner({
  size = 24,
  color = "black",
  strokeWidth = 2,
  classNames,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  classNames?: string;
}) {
  return (
    <Loader2
      className={clsx("animate-spin", classNames)}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}

export default Spinner;

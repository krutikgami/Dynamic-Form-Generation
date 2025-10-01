import { useState } from "react";
import Loader from "../Loader";

export default function Button({
  title,
  type = "button",
  className = "",
  onClickFunction,
  disabled,
  showLoader = false,
  style = {}
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    if (!onClickFunction) return;

    try {
      setIsLoading(true);
      await onClickFunction(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled ? disabled : isLoading || showLoader}
      className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer${
        isLoading || showLoader ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      style={style}
    >
      {isLoading || showLoader ? <Loader /> : title}
    </button>
  );
}

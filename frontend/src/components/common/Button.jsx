import { useState } from "react";
import Loader from "../Loader";

export default function Button({
  title,
  type = "button",
  className = "",
  onClickFunction,
  showLoader = false,
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
      disabled={isLoading || showLoader}
      className={`px-4 py-2 rounded-lg transition duration-200 ${
        isLoading || showLoader ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading || showLoader ? <Loader /> : title}
    </button>
  );
}

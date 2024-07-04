import { useState, useLayoutEffect } from "react";

const getInitialSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export function useWindowSize() {
  const [size, setSize] = useState(getInitialSize());

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return size;
}

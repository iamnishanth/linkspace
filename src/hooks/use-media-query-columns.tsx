import { useEffect, useState } from "react";

export const useMediaQueryColumns = ({
  defaultColumns = 3,
  breakpoints = [576, 768, 992, 1200],
  columnCount = [2, 3, 4, 5],
}) => {
  const [columns, setColumns] = useState(defaultColumns);

  useEffect(() => {
    const mediaQueries = breakpoints.map((breakpoint) =>
      window.matchMedia(`(min-width: ${breakpoint}px)`),
    );

    const onSizeChange = () => {
      let matches = 0;

      mediaQueries.forEach((mediaQuery) => {
        if (mediaQuery.matches) {
          matches++;
        }
      });

      // Update Values
      const index = Math.min(mediaQueries.length - 1, Math.max(0, matches));
      setColumns(columnCount[index]);
    };

    // Initial Call
    onSizeChange();

    // Apply Listeners
    for (const mediaQuery of mediaQueries) {
      mediaQuery.addEventListener("change", onSizeChange);
    }

    return () => {
      for (const mediaQuery of mediaQueries) {
        mediaQuery.removeEventListener("change", onSizeChange);
      }
    };
  }, [defaultColumns, breakpoints, columnCount]);

  return { columns };
};

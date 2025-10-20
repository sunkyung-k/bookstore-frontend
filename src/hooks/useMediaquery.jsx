import React, { useEffect, useState } from "react";

function useMediaquery(props) {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
}

export default useMediaquery;

/* 
  import useMediaquery from "@/hooks/useMediaquery";
  const width = useMediaquery();
  {width < 768 ? <LocationSelect /> : null}
*/

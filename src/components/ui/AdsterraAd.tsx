"use client";

import { useEffect } from "react";

export default function AdsterraAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//pl26399415.profitableratecpm.com/415fda5bf27d7e5b309c69ff3b380ffe/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="container-415fda5bf27d7e5b309c69ff3b380ffe"></div>;
}

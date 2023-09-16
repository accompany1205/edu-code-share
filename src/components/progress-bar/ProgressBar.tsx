// next
import { useRouter } from "next/router";
import { useEffect } from "react";

import NProgress from "nprogress";

//
import { StyledProgressBar } from "./styles";

// ----------------------------------------------------------------------

export function ProgressBar(): React.ReactElement {
  const router = useRouter();

  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    const handleStart = (): void => {
      NProgress.start();
    };
    const handleStop = (): void => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return <StyledProgressBar />;
}

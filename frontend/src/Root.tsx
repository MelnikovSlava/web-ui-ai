import clsx from "clsx";
import { localStorageUtils } from "./utils/localStorage";
import App from "./App";
import { Auth } from "./auth/Auth";

import "./index.css";

const Root = () => {
  return (
    <div
      className={clsx(
        "flex h-full",
        "bg-[var(--main-background)] text-[var(--main-color-text)]",
        "border-t-[var(--main-border)] border-t",
      )}
    >
      {localStorageUtils.getToken() ? <App /> : <Auth />}
      {/* {isLoading && <CircularProgress className={clsx('!mx-auto self-center')} />} */}
    </div>
  );
};

export default Root;

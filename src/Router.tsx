import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { PageNotFound } from "./errors";
import configs from "./configs";
import { i18n } from "./utils";

function Router() {
  useEffect(() => {
    const loadLanguage = async () => {
      await i18n.changeLanguage(configs.DEFAULT_LANGUAGE_CODE);
    };

    loadLanguage();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<>Hello World</>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;

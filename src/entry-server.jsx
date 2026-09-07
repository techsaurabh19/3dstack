import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppShell, PAGE_META, FAQ_ITEMS } from "./App.jsx";

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
}

export { PAGE_META, FAQ_ITEMS };

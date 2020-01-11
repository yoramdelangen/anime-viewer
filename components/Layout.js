import Head from "next/head";
import { version, license } from "../package.json";

export default ({
  children,
  className,
  title = "This is the default title"
}) => {
  const classes = new Set([
    "flex",
    "flex-col",
    "min-h-screen",
    ...(className || "").split(" ")
  ]);

  return (
    <div className={Array.from(classes.values()).join(" ")}>
      <Head>
        <title>{"AnimeViewer" + (title ? " | " + title : "")}</title>
      </Head>

      <section className="flex-1">{children}</section>

      <footer className="mt-auto py-2 sm:py-4 text-gray-700 font-thin text-sm flex justify-between">
        <div>{"Build with Kitsu API.s"}</div>
        <div>
          license: {license} - version: {version}
        </div>
      </footer>
    </div>
  );
};

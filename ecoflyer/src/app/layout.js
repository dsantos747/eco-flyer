import "./globals.css";
import { DM_sans } from "./fonts";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export const metadata = {
  title: "Eco-Flyer",
  description: "Book your next holiday with the planet in mind",
  generator: "Next.js",
  applicationName: "Eco-Flyer",
  authors: [{ name: "Daniel Santos", url: "https://github.com/dsantos747" }],
  keywords: ["flights", "emissions", "environment", "travel", "low emissions"],
  creator: "Daniel Santos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={DM_sans.className}>{children}</body>
    </html>
  );
}

import "./globals.css";
import { DM_sans } from "./fonts";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
// import fetch from "node-fetch";
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

async function wakeUpServer() {
  try {
    const baseUrl = process.env.API_URL;
    const response = await fetch(`${baseUrl}/api/ping`);
    if (response.ok) {
      console.log("Flask Server Awake");
    } else {
      console.error("Flask server response NOK");
    }
  } catch (error) {
    console.error("Error contacting Flask Server: ", error);
  }
}

export default function RootLayout({ children }) {
  wakeUpServer();
  return (
    <html lang="en">
      <body className={DM_sans.className}>{children}</body>
    </html>
  );
}

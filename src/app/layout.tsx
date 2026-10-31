import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Little Journal",
    template: "%s · Little Journal",
  },
  description:
    "Góc nhỏ của riêng mình — nhật ký cá nhân về những ngày thường khi du học.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans font-normal text-neutral-800">
        {children}
      </body>
    </html>
  );
}

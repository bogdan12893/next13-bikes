import "./globals.css";
import QueryWrapper from "./QueryWrapper";

export const metadata = {
  title: "Bikes App",
  description: "Bikes bikes bikes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryWrapper>{children}</QueryWrapper>
      </body>
    </html>
  );
}

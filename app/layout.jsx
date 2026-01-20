import "./globals.css";

export const metadata = {
  title: "AItrendpromt",
  description: "Discover viral AI image prompt trends with real examples",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}

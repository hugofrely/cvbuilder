'use client';

import { usePathname } from 'next/navigation';
import { Box } from "@mui/material";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBuilderPage = pathname === '/builder';

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
        {children}
      </Box>
      {!isBuilderPage && <Footer />}
    </Box>
  );
}

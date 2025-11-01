import { Box } from "@mui/material";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mt: 0 }}>
      {children}
    </Box>
  );
}

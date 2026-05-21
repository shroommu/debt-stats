import { Box, Typography } from "@mui/material";

export default function StateDetailChart({
  data,
  activeState,
  stateAbbv,
}: {
  data: { [key: string]: any };
  activeState: string;
  stateAbbv: string;
}) {
  return (
    <Box
      component="div"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        backgroundColor: "white",
        opacity: 0.9,
        p: 2,
        borderRadius: 4,
        boxShadow: 3,
        width: "80%",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Debt Details for {activeState}
      </Typography>
    </Box>
  );
}

import express from "express";

const app = express();
const PORT = 3000;

app.get("/health", (req, res): void => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
    },
    error: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
} from "@mui/material";

export default function BatchCard() {
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dosage, setDosage] = useState("");
  const [forField, setForField] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      recipe: selectedRecipe,
      quantity,
      dosage,
      for: forField,
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: "auto",
        marginTop: 4,
        padding: 2,
        textAlign: "center",
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="/path/to/logo.png"
              alt="Logo"
              style={{ width: 80, height: 80 }}
            />
            <Typography variant="h6" sx={{ marginTop: 1 }}>
              Recipe Form
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Recipe</InputLabel>
            <Select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              label="Recipe"
            >
              <MenuItem value="Recipe 1">Recipe 1</MenuItem>
              <MenuItem value="Recipe 2">Recipe 2</MenuItem>
              <MenuItem value="Recipe 3">Recipe 3</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            label="Dosage"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
          <TextField
            label="For (Optional)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={forField}
            onChange={(e) => setForField(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

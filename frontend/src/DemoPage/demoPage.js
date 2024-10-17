import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, CheckCircle, Cancel } from "@mui/icons-material";

export default function DemoPage() {
  const [newService, setNewService] = useState("");
  const [existingServices, setExistingServices] = useState([]);
  const [editedPrice, setEditedPrice] = useState(0);
  const [entryType, setEntryType] = useState("expense");
  const [isEditing, setIsEditing] = useState(false);
  const [editedServiceId, setEditedServiceId] = useState(null);

  const initialFakeData = [
    {
      id: 1,
      expenceIncomeName: "demo / Pirkau batus",
      amount: 100,
      expenceIncomeType: "expense",
      formatedDateTimeString: "01/01/2024",
    },
    {
      id: 2,
      expenceIncomeName: "demo / Pirkau detales masinai",
      amount: 200,
      expenceIncomeType: "income",
      formatedDateTimeString: "01/02/2024",
    },
  ];

  useEffect(() => {
    const fetchPersonalFinance = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      setExistingServices(initialFakeData);
    };

    fetchPersonalFinance();
  }, []);

  const handleNewServiceSubmit = () => {
    if (newService && editedPrice >= 0) {
      const newServiceObj = {
        id: Date.now(),
        expenceIncomeName: newService,
        amount: editedPrice,
        expenceIncomeType: entryType,
        formatedDateTimeString: new Date().toLocaleString(),
      };

      setExistingServices((prev) => [...prev, newServiceObj]);
      setNewService("");
      setEditedPrice(0);
    }
  };

  const handleEditSubmit = () => {
    setIsEditing(false);

    if (editedServiceId !== null) {
      const updatedServices = existingServices.map((service) =>
        service.id === editedServiceId
          ? {
              ...service,
              expenceIncomeName: newService,
              amount: editedPrice,
              expenceIncomeType: entryType,
            }
          : service
      );
      setExistingServices(updatedServices);
      setEditedServiceId(null);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedServiceId(null);
  };

  const handleEdit = (serviceId) => {
    setIsEditing(true);
    setEditedServiceId(serviceId);

    const serviceToEdit = existingServices.find(
      (service) => service.id === serviceId
    );

    if (serviceToEdit) {
      setNewService(serviceToEdit.expenceIncomeName);
      setEditedPrice(serviceToEdit.amount);
      setEntryType(serviceToEdit.expenceIncomeType);
    }
  };

  const handleDelete = (serviceId) => {
    const updatedServices = existingServices.filter(
      (service) => service.id !== serviceId
    );
    setExistingServices(updatedServices);
  };

  const getIncomeAmount = () => {
    return existingServices
      .filter((service) => service.expenceIncomeType === "income")
      .reduce((acc, service) => acc + service.amount, 0);
  };

  const getExpenseAmount = () => {
    return existingServices
      .filter((service) => service.expenceIncomeType === "expense")
      .reduce((acc, service) => acc + service.amount, 0);
  };

  const getOverallBalance = () => {
    return getIncomeAmount() - getExpenseAmount();
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Išlaidų/Įplaukų valdymas
        </Typography>

        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginBottom: "10px", fontWeight: "bold" }}
        >
          Išlaidų suma: {getExpenseAmount()}
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginBottom: "10px", fontWeight: "bold" }}
        >
          Įplaukų suma: {getIncomeAmount()}
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
            color: getOverallBalance() >= 0 ? "green" : "red",
          }}
        >
          Likutis: {getOverallBalance()}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Kategorija"
              variant="outlined"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Suma"
              type="number"
              variant="outlined"
              value={editedPrice}
              onChange={(e) => setEditedPrice(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Tipas</InputLabel>
              <Select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
                label="Tipas"
              >
                <MenuItem value="expense">Išlaidos</MenuItem>
                <MenuItem value="income">Įplaukos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={isEditing ? handleEditSubmit : handleNewServiceSubmit}
            >
              {isEditing ? "Redaguoti" : "Pridėti"}
            </Button>
          </Grid>
        </Grid>

        <List>
          {existingServices.map((service) => (
            <ListItem key={service.id}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                  {isEditing && editedServiceId === service.id ? (
                    <TextField
                      fullWidth
                      label="Redaguoti kategoriją"
                      variant="outlined"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                    />
                  ) : (
                    <ListItemText primary={service.expenceIncomeName} />
                  )}
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ListItemText secondary={`Sukūrta vartotojo: Vartotojas`} />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <ListItemText secondary={`Kaina: ${service.amount}`} />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <ListItemText
                    secondary={`Tipas: ${
                      service.expenceIncomeType === "expense"
                        ? "Išlaidos"
                        : "Įplaukos"
                    }`}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <ListItemText
                    secondary={`Data: ${service.formatedDateTimeString}`}
                  />
                </Grid>
                <Grid item xs={6} sm={1}>
                  <ListItemSecondaryAction>
                    {isEditing && editedServiceId === service.id ? (
                      <>
                        <IconButton
                          onClick={() => handleEditSubmit()}
                          edge="end"
                          color="primary"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditCancel()}
                          edge="end"
                          color="secondary"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEdit(service.id)}
                          edge="end"
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(service.id)}
                          edge="end"
                          color="secondary"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

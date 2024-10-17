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
import { usePersonalFinance } from "../context/financeContext";
import { useAuth } from "../context/authContext";

export default function ServiceManagementPage() {
  const [newService, setNewService] = useState("");
  const [existingServices, setExistingServices] = useState([]);
  const [editedPrice, setEditedPrice] = useState(0);
  const [entryType, setEntryType] = useState("expense");
  const [isEditing, setIsEditing] = useState(false);
  const [editedServiceId, setEditedServiceId] = useState(null);

  const { upsertFinance, getFinance, deleteFinance } = usePersonalFinance();
  const { user } = useAuth();

  const getFinances = async () => {
    const finances = await getFinance();
    if (!user.userRoles.includes("Admin")) {
      return finances.filter((x) => x.username === user.username);
    }

    return finances;
  };

  useEffect(() => {
    const fetchPersonalFinance = async () => {
      try {
        const fetchedFinances = await getFinances();
        setExistingServices(fetchedFinances);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPersonalFinance();
  }, []);

  const handleNewServiceSubmit = async () => {
    if (newService && editedPrice >= 0) {
      const newServiceObj = {
        expenceIncomeName: newService,
        amount: editedPrice,
        expenceIncomeType: entryType,
        username: user.username,
      };

      try {
        const response = await upsertFinance(newServiceObj);
        setExistingServices((prev) => [...prev, response]);
        setNewService("");
        setEditedPrice(0);
      } catch (error) {
        console.error("Error creating new service:", error);
      }
    }
  };

  const handleEditSubmit = async () => {
    setIsEditing(false);

    if (editedServiceId !== null) {
      const serviceToEdit = existingServices.find(
        (service) => service.id === editedServiceId
      );

      if (serviceToEdit) {
        try {
          const response = await upsertFinance(serviceToEdit);
          const updatedServices = existingServices.map((service) =>
            service.id === response.id ? response : service
          );
          setExistingServices(updatedServices);
        } catch (error) {
          console.error("Error updating service:", error);
        }
      }
    }

    setEditedServiceId(null);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedServiceId(null);
  };

  const handleEdit = (serviceId) => {
    setIsEditing(true);
    setEditedServiceId(serviceId);
  };

  const handleDelete = async (serviceId) => {
    try {
      await deleteFinance(serviceId);
      setExistingServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceId)
      );
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const getIncomeAmount = () => {
    if (existingServices && !isEditing) {
      return existingServices
        .filter((service) => service.expenceIncomeType === "income")
        .reduce((acc, service) => acc + service.amount, 0);
    }

    return 0;
  };

  const getExpenseAmount = () => {
    if (existingServices && !isEditing) {
      return existingServices
        .filter((service) => service.expenceIncomeType === "expense")
        .reduce((acc, service) => acc + service.amount, 0);
    }

    return 0;
  };

  // =====================================================================================

  // const getIncomeAmount = () => {
  //   if (existingServices) {
  //     return existingServices
  //       .filter((service) => service.expenceIncomeType === "income")
  //       .reduce((acc, service) => acc + service.amount, 0);
  //   }

  //   return 0;
  // };

  // const getExpenseAmount = () => {
  //   if (existingServices) {
  //     return existingServices
  //       .filter((service) => service.expenceIncomeType === "expense")
  //       .reduce((acc, service) => acc + service.amount, 0);
  //   }

  //   return 0;
  // };

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
              onClick={handleNewServiceSubmit}
            >
              Pridėti
            </Button>
          </Grid>
        </Grid>

        <List>
          {existingServices &&
            existingServices.map((service) => (
              <ListItem key={service.id}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    {isEditing && editedServiceId === service.id ? (
                      <TextField
                        fullWidth
                        label="Redaguoti kategoriją"
                        variant="outlined"
                        value={service.expenceIncomeName}
                        onChange={(e) => {
                          const updatedServices = existingServices.map((s) =>
                            s.id === service.id
                              ? { ...s, expenceIncomeName: e.target.value }
                              : s
                          );
                          setExistingServices(updatedServices);
                        }}
                      />
                    ) : (
                      <ListItemText primary={service.expenceIncomeName} />
                    )}
                  </Grid>
                  <Grid item xs={3} sm={3}>
  {isEditing && editedServiceId === service.id ? (
    <TextField
      fullWidth
      label="Redaguoti Kaina"
      variant="outlined"
      value={service.amount}
      onChange={(e) => {
        const updatedServices = existingServices.map((s) =>
          s.id === service.id
            ? { ...s, amount: e.target.value }
            : s
        );
        setExistingServices(updatedServices);
      }}
    />
  ) : (
    <ListItemText secondary={`Kaina: ${service.amount}`} />
  )}
</Grid>
                  <Grid item xs={6} sm={3}>
                    <ListItemText
                      secondary={`Sukūrta vartotojo: ${service.username}`}
                    />
                  </Grid>
                  {/* <Grid item xs={6} sm={2}>
                    <ListItemText secondary={`Kaina: ${service.amount}`} />
                  </Grid> */}
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

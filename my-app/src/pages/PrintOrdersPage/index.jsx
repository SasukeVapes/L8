import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Snackbar,
  Slide,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContainer from '../../components/General/Cards/CardContainerGeneral';

export const PrintOrdersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [clickedCard, setClickedCard] = useState(null);
  const [token, setToken] = useState('');
  const [cards, setCards] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(response => {
        console.log('Raw Response:', response);
        return response.json();
      })
      .then(data => {
        console.log('Parsed Data:', data);
        setCards(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  const [newCardData, setNewCardData] = useState({
    title: '',
    description: '',
    price: '',
    customerName: '',
    customerAddress: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleGoSomewhereClick = (clickedCard) => {
    setShowForm(true);
    setClickedCard(clickedCard);
  };

  const handleCloseClick = () => {
    setShowForm(false);
    setClickedCard(null);
  };

  const handleTokenClick = () => {
    navigator.clipboard.writeText(clickedCard?.customerAddress).then(
      () => {
        alert('Address is copied to the clipboard!');
      },
      () => {
        console.error('Failed to copy');
      }
    );
  };

  const handlePlusButtonClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newCard = { ...newCardData };
    // Instead of updating the local state directly, send a POST request to the server
    fetch('http://localhost:5000/api/postData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCard),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from server:', data);
        // Assuming the server responds with success: true
        setCards([...cards, newCard]);
        setSnackbarOpen(true);
      })
      .catch(error => console.error('Error posting data:', error));

    setNewCardData({
      title: '',
      description: '',
      price: '',
      customerName: '',
      customerAddress: '',
    });
    setShowForm(false);
  };

  return (
    <Container>
      <div className="card text-bg-dark text-white border-0">
        <img
          src="/Books.jpg"
          className="card-img"
          alt="Background"
          height="350px"
          style={{ objectFit: 'cover' }}
        />
        <div
          className="card-img-overlay d-flex flex-column justify-content-center"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="container">
            <Typography
              className="card-title display-3 fw-bolder mb-0 d-flex 
            justify-items-center align-items-center flex-column"
              variant="h5"
            >
              Leathered Parchment Manufacture
            </Typography>
            <Typography
              className="card-text lead fs-2 d-flex 
            justify-items-center align-items-center flex-column"
              variant="body1"
            >
              Since 1955
            </Typography>
          </div>
        </div>
      </div>
      <Typography className="d-flex justify-content-center mt-4 fw-bold" variant="h2">
        Orders
      </Typography>
      <CardContainer cards={cards} onGoSomewhereClick={handleGoSomewhereClick} />
      <div className="d-flex justify-content-center">
        <Button variant="contained" color="secondary" onClick={handlePlusButtonClick}>
          Plus
        </Button>
      </div>
      <div>
        {showForm && (
          <Slide direction="up" in={showForm}>
            <div className="form-container2">
              <form onSubmit={handleFormSubmit}>
                <Typography variant="h2">Add New Card</Typography>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={newCardData.title}
                    onChange={(e) => setNewCardData({ ...newCardData, title: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={newCardData.description}
                    onChange={(e) =>
                      setNewCardData({ ...newCardData, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    value={newCardData.price}
                    onChange={(e) => setNewCardData({ ...newCardData, price: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="customerName"
                    value={newCardData.customerName}
                    onChange={(e) =>
                      setNewCardData({ ...newCardData, customerName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="customerAddress" className="form-label">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="customerAddress"
                    value={newCardData.customerAddress}
                    onChange={(e) =>
                      setNewCardData({ ...newCardData, customerAddress: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" variant="contained" color="primary">
                  Add Card
                </Button>
              </form>
            </div>
          </Slide>
        )}
      </div>
      <div>
        {showForm && clickedCard && (
          <div className="form-container">
            <div className="overlay"></div>
            <div className="container form-content">
              <Typography variant="h2">Client Info</Typography>
              <Typography variant="body1">Price: {clickedCard.price}</Typography>
              <Typography variant="body1">Customer Name: {clickedCard.customerName}</Typography>
              <Typography variant="body1">Customer Address: {clickedCard.customerAddress}</Typography>
              <Button
                className="btn btn-lg btn-danger downloadbtn"
                variant="contained"
                onClick={handleCloseClick}
              >
                Close
              </Button>
              <Button
                className="btn btn-lg btn-primary token"
                variant="contained"
                onClick={handleTokenClick}
              >
                CopyAddress
              </Button>
            </div>
          </div>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="New card added!"
      />
    </Container>
  );
};

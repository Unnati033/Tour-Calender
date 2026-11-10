import "./App.css"
import { useState, useEffect } from "react";

function App() {
  const [totalSeats] = useState(20);

  const [bookedSeats, setBookedSeats] = useState(() => {
    const saved = localStorage.getItem("bookedSeats");
    return saved !== null ? Number(saved) : 15;
  });

  const [bookings, setBookings] = useState(() => {
    return JSON.parse(localStorage.getItem("bookings") || "[]");
  });

  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [seatCount, setSeatCount] = useState(1);

  const remainingSeats = totalSeats - bookedSeats;

  useEffect(() => {
    localStorage.setItem("bookedSeats", bookedSeats);
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookedSeats, bookings]);

  function confirmBooking() {
    const seats = Number(seatCount);

    if (customerName.trim() === "") {
      alert("Please enter customer name");
      return;
    }

    if (seats <= 0 || seats > remainingSeats) {
      alert("Not enough seats available");
      return;
    }

    const newBooking = {
      id: Date.now(),
      name: customerName,
      seats: seats,
      date: new Date().toLocaleDateString()
    };

    setBookings([...bookings, newBooking]);
    setBookedSeats(bookedSeats + seats);

    setCustomerName("");
    setSeatCount(1);
    setShowForm(false);
  }

  function cancelCustomerBooking(id) {
    const booking = bookings.find((item) => item.id === id);

    if (!booking) return;

    setBookings(bookings.filter((item) => item.id !== id));
    setBookedSeats(bookedSeats - booking.seats);
  }

  return (
    <div>
      <h1>Tour Booking Calendar</h1>

      <div className="tour-card">
        <h2>Tadoba Tiger Safari</h2>
        <img src="/Tadoba.jpg" alt="Tadoba Tiger Safari" className="tour-image"/>
        <div className="tour-details">
          <p><strong>Location:</strong> Chandrapur, Maharashtra</p>
          <p><strong>Tour Date:</strong> 15 January 2027</p>
          <p><strong>Duration:</strong> 3 Days / 2 Nights</p>
          <p><strong>Tour Guide:</strong>Rahul Patil</p> 
          <p><strong>Total Seats:</strong> {totalSeats}</p>
          <p><strong>Booked Seats:</strong> {bookedSeats}</p>
          <p><strong>Remaining Seats:</strong> {remainingSeats}</p>
      </div>

        <h3>
          {remainingSeats === 0 ? "Fully Booked" : "Available"}
        </h3>

        <button
          onClick={() => setShowForm(true)}
          disabled={remainingSeats === 0}
        >
          Add Booking
        </button>

        {showForm && (
          <div className="booking-form">
            <h3>New Booking</h3>

            <input
              type="text"
              className="form-control"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              type="number"
              className="form-control"
              min="1"
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
            />

            <button className="form-buttons"  onClick={confirmBooking}>
              Confirm Booking
            </button>

            <button onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
        )}

        <h3>Customer Booking Details</h3>

        {bookings.map((booking) => (
          <div key={booking.id}>
            <p>Customer: {booking.name}</p>
            <p>Seats: {booking.seats}</p>
            <p>Booking Date: {booking.date}</p>

            <button onClick={() => cancelCustomerBooking(booking.id)}>
              Cancel This Booking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

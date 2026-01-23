// ticket-submit.js
document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticket-form');
    const statusMsg = document.getElementById('statusMsg');
    if (!ticketForm || !statusMsg) return;

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check if user is logged in
        const currentUser = localStorage.getItem('loggedInUser'); // set by auth.js
        if (!currentUser) {
            statusMsg.textContent = '❌ You must be logged in to submit a ticket.';
            statusMsg.style.color = 'red';
            return;
        }

        // Collect ticket info
        const formData = new FormData(ticketForm);
        const ticket = { 
            user: currentUser,
            submitted: new Date().toISOString()
        };
        formData.forEach((value, key) => ticket[key] = value);

        // For now, save tickets locally in localStorage
        let tickets = JSON.parse(localStorage.getItem('scs6027Tickets') || '[]');
        tickets.push(ticket);
        localStorage.setItem('scs6027Tickets', JSON.stringify(tickets));

        // Feedback
        statusMsg.textContent = '✅ Ticket submitted successfully!';
        statusMsg.style.color = 'green';
        ticketForm.reset();

        console.log('Ticket saved:', ticket);
    });
});

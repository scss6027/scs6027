// ticket-submit.js
document.addEventListener('DOMContentLoaded', () => {
  const ticketForm = document.getElementById('ticket-form');
  const statusMsg = document.getElementById('statusMsg');
  const ticketNumberMsg = document.getElementById('ticketNumberMsg');

  if (!ticketForm) return;

  ticketForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ensure user is logged in via auth.js
    if (!window.loggedInEmail) {
      statusMsg.textContent = "You must be logged in to submit a ticket.";
      statusMsg.style.color = "red";
      return;
    }

    const subject = document.getElementById('subject').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!subject || !description) {
      statusMsg.textContent = "Please fill in all fields.";
      statusMsg.style.color = "red";
      return;
    }

    // Predict next ticket number based on last known number
    const lastTicket = localStorage.getItem('lastTicket') || "0000";
    const nextNum = String(parseInt(lastTicket, 10) + 1).padStart(4, '0');
    localStorage.setItem('lastTicket', nextNum);

    // Display immediately
    ticketNumberMsg.innerHTML = `
      Your ticket number is <strong>${nextNum}</strong>.<br>
      Please note it down. No emails are sent automatically.
    `;

    const payload = {
      email: window.loggedInEmail,
      subject,
      description,
      timestamp: new Date().toISOString()
    };

    try {
      statusMsg.textContent = "Submitting your ticket...";
      statusMsg.style.color = "black";

      await fetch(
        'https://api.github.com/repos/scss6027/scs6027/dispatches',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token YOUR_GITHUB_PAT`, // handled via secret in workflow
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'new_ticket',
            client_payload: payload
          })
        }
      );

      statusMsg.textContent = "Ticket submitted successfully!";
      statusMsg.style.color = "green";
      ticketForm.reset();

    } catch (err) {
      console.error(err);
      statusMsg.textContent = "Network or GitHub error: Could not submit ticket.";
      statusMsg.style.color = "red";
    }
  });
});

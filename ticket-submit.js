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

    // Collect form data
    const subject = document.getElementById('subject').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!subject || !description) {
      statusMsg.textContent = "Please fill in all fields.";
      statusMsg.style.color = "red";
      return;
    }

    // Create payload for GitHub Action
    const payload = {
      email: window.loggedInEmail,
      subject,
      description,
      timestamp: new Date().toISOString()
    };

    try {
      statusMsg.textContent = "Submitting your ticket...";
      statusMsg.style.color = "black";

      // Call GitHub repository_dispatch API
      const response = await fetch(
        'https://api.github.com/repos/scss6027/scs6027/dispatches',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token YOUR_GITHUB_PAT`, // replace with workflow secret
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'new_ticket',
            client_payload: payload
          })
        }
      );

      if (response.status === 204) {
        statusMsg.textContent = "Ticket submitted successfully!";
        statusMsg.style.color = "green";
        ticketNumberMsg.innerHTML = `
          Your ticket number will be assigned automatically. 
          <strong>Save this page or note your ticket number for reference.</strong>
        `;
        ticketForm.reset();
      } else {
        const errText = await response.text();
        statusMsg.textContent = "Error submitting ticket: " + errText;
        statusMsg.style.color = "red";
      }

    } catch (err) {
      console.error(err);
      statusMsg.textContent = "Network or GitHub error: Could not submit ticket.";
      statusMsg.style.color = "red";
    }
  });
});

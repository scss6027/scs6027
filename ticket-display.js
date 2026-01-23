// ticket-display.js
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('ticketContainer');
  if (!container) return;

  async function getUserEmail() {
    try {
      const resp = await fetch('https://scss6027.github.io/scs6027/auth.json');
      const data = await resp.json();
      return data.loggedInEmail || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function loadTickets() {
    const email = await getUserEmail();
    if (!email) {
      container.innerHTML = '<p class="no-tickets">You must be logged in to view your tickets.</p>';
      return;
    }

    try {
      const resp = await fetch('https://scss6027.github.io/scs6027/scs6027UsersTickets.json');
      const userTickets = await resp.json();

      const ticketsForUser = userTickets[email] || [];
      if (ticketsForUser.length === 0) {
        container.innerHTML = '<p class="no-tickets">You have not submitted any tickets yet.</p>';
        return;
      }

      container.innerHTML = '';
      for (const ticketNum of ticketsForUser) {
        const ticketResp = await fetch(`https://scss6027.github.io/scs6027/scs6027Tickets/${ticketNum}.txt`);
        const ticketText = await ticketResp.text();

        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'ticket-item';

        // Parse the ticket text
        const lines = ticketText.split('\n');
        let subject = '', description = '', date = '', submittedBy = '';
        lines.forEach((line, idx) => {
          if (line.startsWith('Subject:')) subject = line.replace('Subject:', '').trim();
          if (line.startsWith('Description:')) description = lines.slice(idx + 1).join('\n').trim();
          if (line.startsWith('Date:')) date = line.replace('Date:', '').trim();
          if (line.startsWith('Submitted by:')) submittedBy = line.replace('Submitted by:', '').trim();
        });

        ticketDiv.innerHTML = `
          <h3>Ticket #${ticketNum}</h3>
          <p><strong>Date Submitted:</strong> ${date}</p>
          <p><strong>Submitted by:</strong> ${submittedBy}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Description:</strong><br>${description.replace(/\n/g,'<br>')}</p>
        `;
        container.appendChild(ticketDiv);
      }

    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="no-tickets">Error loading tickets.</p>';
    }
  }

  loadTickets();
});

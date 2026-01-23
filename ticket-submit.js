// ticket-submit.js (SCS6027 – real ticket number + initial status)
document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticket-form');
    const statusMsg = document.getElementById('statusMsg');
    const ticketNumberMsg = document.getElementById('ticketNumberMsg');
    if (!ticketForm || !statusMsg || !ticketNumberMsg) return;

    // Get logged-in user email
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

    // Get latest ticket number for this user (from latestTickets.json)
    async function getLatestTicket(email) {
        try {
            const resp = await fetch('https://scss6027.github.io/scs6027/scs6027Tickets/latestTickets.json');
            const data = await resp.json();
            return data[email] || null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userEmail = await getUserEmail();
        if (!userEmail) {
            alert('You must be logged in to submit a ticket.');
            return;
        }

        const formData = new FormData(ticketForm);
        const payload = {
            email: userEmail,
            subject: formData.get('subject'),
            description: formData.get('description'),
            status: "Open"  // Automatically add initial status field
        };

        statusMsg.textContent = 'Submitting your ticket...';
        ticketNumberMsg.textContent = '';

        try {
            // Trigger GitHub Actions workflow via repository_dispatch
            await fetch('https://api.github.com/repos/scss6027/scs6027/dispatches', {
                method: 'POST',
                headers: { 'Accept': 'application/vnd.github+json' },
                body: JSON.stringify({
                    event_type: 'new_ticket',
                    client_payload: payload
                })
            });

            // Wait a few seconds for the workflow to commit the new ticket
            statusMsg.textContent = 'Ticket submitted! Retrieving ticket number...';
            setTimeout(async () => {
                const latest = await getLatestTicket(userEmail);
                if (latest) {
                    ticketNumberMsg.textContent = `Your ticket number is: ${latest}`;
                    statusMsg.textContent = 'Ticket submitted successfully!';
                    ticketForm.reset();
                } else {
                    ticketNumberMsg.textContent = '';
                    statusMsg.textContent = 'Ticket submitted! Could not retrieve ticket number yet.';
                }
            }, 8000); // 8 seconds delay for workflow to commit

        } catch (err) {
            console.error(err);
            statusMsg.textContent = 'Network error: Could not submit ticket.';
        }
    });
});

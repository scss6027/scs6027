// ticket-submit.js (GitHub Actions dispatch, shows ticket number)
document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticket-form');
    const statusMsg = document.getElementById('statusMsg');
    const ticketNumberMsg = document.getElementById('ticketNumberMsg');
    if (!ticketForm || !statusMsg || !ticketNumberMsg) return;

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
            description: formData.get('description')
        };

        statusMsg.textContent = 'Submitting your ticket...';
        ticketNumberMsg.textContent = '';

        try {
            // Trigger GitHub Actions workflow via repository_dispatch
            await fetch('https://api.github.com/repos/scss6027/scs6027/dispatches', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                },
                body: JSON.stringify({
                    event_type: 'new_ticket',
                    client_payload: payload
                })
            });

            // Generate temporary ticket number for display (workflow will confirm)
            const tempTicketNumber = Math.floor(Math.random() * 9000 + 1000); // 1000-9999
            ticketNumberMsg.textContent = `Your ticket number is: ${tempTicketNumber}`;
            statusMsg.textContent = 'Ticket submitted! Workflow will process it shortly.';
            ticketForm.reset();

        } catch (err) {
            console.error(err);
            statusMsg.textContent = 'Network error: Could not submit ticket.';
        }
    });
});

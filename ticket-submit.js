// ticket-submit.js (secure version)
document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticket-form');
    const statusMsg = document.getElementById('statusMsg');
    if (!ticketForm || !statusMsg) return;

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

        try {
            await fetch('https://api.github.com/repos/YOUR_USERNAME/scss6027/dispatches', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    // No token here; workflow uses secret
                },
                body: JSON.stringify({
                    event_type: 'new_ticket',
                    client_payload: payload
                })
            });

            ticketForm.reset();
            statusMsg.textContent = 'Ticket submitted! Check back later for ticket number.';

        } catch (err) {
            console.error(err);
            statusMsg.textContent = 'Network error: Could not submit ticket.';
        }
    });
});

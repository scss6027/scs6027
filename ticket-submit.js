// ticket-submit.js

document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticket-form');
    const statusMsg = document.getElementById('statusMsg');
    if (!ticketForm || !statusMsg) return;

    // Load logged-in user email from auth.json
    async function getUserEmail() {
        try {
            const resp = await fetch('https://scss6027.github.io/scs6027/auth.json');
            const data = await resp.json();
            return data.loggedInEmail || null;
        } catch (err) {
            console.error('Error loading auth.json:', err);
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
        const subject = formData.get('subject');
        const description = formData.get('description');

        // Payload to send to GitHub Actions
        const payload = {
            email: userEmail,
            subject: subject,
            description: description
        };

        statusMsg.textContent = 'Submitting your ticket...';

        try {
            const resp = await fetch('https://api.github.com/repos/YOUR_USERNAME/scss6027/dispatches', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': 'Bearer ' + YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
                },
                body: JSON.stringify({
                    event_type: 'new_ticket',
                    client_payload: payload
                })
            });

            if (resp.ok) {
                ticketForm.reset();
                statusMsg.textContent = `Ticket submitted! Please note your ticket for reference. GitHub will assign a number shortly.`;
            } else {
                const errText = await resp.text();
                console.error(errText);
                statusMsg.textContent = 'Error submitting ticket. Check console.';
            }
        } catch (err) {
            console.error(err);
            statusMsg.textContent = 'Network error. Could not submit ticket.';
        }
    });
});

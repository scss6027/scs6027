// ticket-modify.js
document.addEventListener('DOMContentLoaded', () => {
    const modifyForm = document.getElementById('modify-ticket-form');
    const statusMsg = document.getElementById('statusMsg');
    if (!modifyForm || !statusMsg) return;

    // Get logged-in user email from auth.json
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

    modifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userEmail = await getUserEmail();
        if (!userEmail) {
            alert('You must be logged in to modify a ticket.');
            return;
        }

        const ticketNumber = modifyForm.ticketNumber.value.trim();
        const newSubject = modifyForm.subject.value.trim();
        const newDescription = modifyForm.description.value.trim();

        if (!ticketNumber || !newSubject || !newDescription) {
            statusMsg.textContent = 'All fields are required.';
            return;
        }

        statusMsg.textContent = 'Submitting ticket update...';

        // Build payload for GitHub Actions
        const payload = {
            email: userEmail,
            ticketNumber: ticketNumber,
            subject: newSubject,
            description: newDescription
        };

        try {
            // Trigger workflow_dispatch on GitHub Actions
            await fetch('https://api.github.com/repos/scss6027/scs6027/dispatches', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                },
                body: JSON.stringify({
                    event_type: 'modify_ticket',
                    client_payload: payload
                })
            });

            statusMsg.textContent = `Ticket #${ticketNumber} submitted for update. Workflow will process it shortly.`;
            modifyForm.reset();

        } catch (err) {
            console.error(err);
            statusMsg.textContent = 'Network error: Could not submit ticket update.';
        }
    });
});

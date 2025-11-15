export async function login(username, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response;
}

export async function register(username, password) {
    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role: 'USER' }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return response.json();
}

export async function logout() {
    const response = await fetch('/api/logout', {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }
}

export async function getCurrentUser() {
    const response = await fetch('/api/users/me');

    if (!response.ok) {
        throw new Error('Not authenticated');
    }

    return response.json();
}

export async function getTickets(filters = {}) {
    const params = new URLSearchParams();
    if (filters.subject) {
        params.append('subject', filters.subject);
    }
    if (filters.status) {
        params.append('status', filters.status);
    }
    if (filters.priority) {
        params.append('priority', filters.priority);
    }

    const response = await fetch(`/api/tickets?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch tickets');
    }

    return response.json();
}

export async function getTicketById(id) {
    const response = await fetch(`/api/tickets/${id}`);

    if (!response.ok) {
        throw new Error('Failed to fetch ticket');
    }

    return response.json();
}

export async function createComment(ticketId, content) {
    const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error('Failed to create comment');
    }

    return response.json();
}

export async function createTicket(ticketData) {
    const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
        throw new Error('Failed to create ticket');
    }

    return response.json();
}

export async function getUsers() {
    const response = await fetch('/api/users');

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
}

export async function updateTicket(id, ticketData) {
    const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
        throw new Error('Failed to update ticket');
    }

    return response.json();
}

export async function deleteUser(id) {
    const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
}

export async function updateUserRole(id, role) {
    const response = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
    });

    if (!response.ok) {
        throw new Error('Failed to update user role');
    }

    return response.json();
}

export async function uploadFile(ticketId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/tickets/${ticketId}/attachments`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload file');
    }

    return response.text();
}

export async function rateTicket(ticketId, rating, feedback) {
    const response = await fetch(`/api/tickets/${ticketId}/rate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, feedback }),
    });

    if (!response.ok) {
        throw new Error('Failed to rate ticket');
    }

    return response.json();
}
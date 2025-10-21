<?php

use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel('ticket_{ticketId}', function ($user, $ticketId) {
    $ticket = \App\Models\Ticket::find($ticketId);

    if (!$ticket) {
        return false;
    }

    // Admins can access all tickets
    if ($user->isAdmin()) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role
        ];
    }

    // Customers can only access their own tickets
    if ($ticket->user_id === $user->id) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role
        ];
    }

    return false;
});

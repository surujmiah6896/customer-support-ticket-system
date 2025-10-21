<?php
// app/Events/NewChatMessage.php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewChatMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chatMessage;

    public function __construct(ChatMessage $chatMessage)
    {
        $this->chatMessage = $chatMessage;
    }

    public function broadcastOn()
    {
        // Use PresenceChannel for private broadcasting
        return new Channel('ticket_' . $this->chatMessage->ticket_id);
    }

    public function broadcastWith()
    {
        // Fix the user data structure - remove the nested Model class name
        return [
            'chatMessage' => [
                'id' => $this->chatMessage->id,
                'message' => $this->chatMessage->message,
                'ticket_id' => $this->chatMessage->ticket_id,
                'user_id' => $this->chatMessage->user_id,
                'is_read' => $this->chatMessage->is_read,
                'created_at' => $this->chatMessage->created_at->toDateTimeString(),
                'updated_at' => $this->chatMessage->updated_at->toDateTimeString(),
                'user' => [
                    'id' => $this->chatMessage->user->id,
                    'name' => $this->chatMessage->user->name,
                    'email' => $this->chatMessage->user->email,
                    'role' => $this->chatMessage->user->role,
                    'created_at' => $this->chatMessage->user->created_at,
                    'updated_at' => $this->chatMessage->user->updated_at,
                ]
            ]
        ];
    }

    public function broadcastAs()
    {
        return 'new.chat.message';
    }

    // Important: Make sure the event is broadcasted to others
    public function broadcastWhen()
    {
        return true;
    }
}

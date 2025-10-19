<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewChatMessage
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chatMessage;
    /**
     * Create a new event instance.
     */
    public function __construct(ChatMessage $chatMessage)
    {
        $this->chatMessage = $chatMessage;
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('ticket.' . $this->chatMessage->ticket_id);
    }


    public function broadcastWith()
    {
        return [
            'id' => $this->chatMessage->id,
            'message' => $this->chatMessage->message,
            'user' => [
                'id' => $this->chatMessage->user->id,
                'name' => $this->chatMessage->user->name,
                'role' => $this->chatMessage->user->role,
            ],
            'ticket_id' => $this->chatMessage->ticket_id,
            'created_at' => $this->chatMessage->created_at->toDateTimeString(),
        ];
    }
}

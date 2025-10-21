<?php

namespace App\Http\Controllers;

use App\Events\NewChatMessage;
use App\Models\ChatMessage;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\TryCatch;

class ChatController extends Controller
{
    public function getMessages(Request $request, $ticketId)
    {
        $ticket = Ticket::forUser($request->user())->find($ticketId);

        if (!$ticket) {
            return response()->json(['errors' => ['message' => 'ticket not found!']], 404);
        }

        $messages = ChatMessage::where('ticket_id', $ticketId)
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        $data = [
            'status' => true,
            'messages' => $messages,
            'message' => 'get all message',
        ];

        return response()->json($data);
    }



    public function sendMessage(Request $request, $ticketId)
    {
        $ticket = Ticket::forUser($request->user())->find($ticketId);

        if (!$ticket) {
            return response()->json(['errors' => ['message' => 'ticket not found!']], 404);
        }

        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $chatMessage = ChatMessage::create([
                'message' => $request->message,
                'ticket_id' => $ticketId,
                'user_id' => $request->user()->id,
            ]);

            // Load user relationship for the event
            $chatMessage->load('user');

            // Add debug log to see exact channel name
            Log::info('Chat message created', [
                'message_id' => $chatMessage->id,
                'ticket_id' => $ticketId,
                'user_id' => $request->user()->id,
            ]);

            // Broadcast the event
            Log::info('Attempting to broadcast NewChatMessage event');

            broadcast(new NewChatMessage($chatMessage));

            Log::info('NewChatMessage event broadcast called');

            $data = [
                'status' => true,
                'chatMessage' => $chatMessage,
                'message' => 'message sent successful',
            ];

            return response()->json($data, 201);
            
        } catch (\Exception $e) {
            Log::error('Error in sendMessage:', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'user_id' => $request->user()->id,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to send message'
            ], 500);
        }
    }


    public function markAsRead(Request $request, $ticketId)
    {
        $ticket = Ticket::forUser($request->user())->find($ticketId);

        if (!$ticket) {
            return response()->json(['errors' => ['message' => 'Ticket not found!']], 404);
        }

        // Mark all unread messages as read for this ticket
        // Exclude messages from the current user
        ChatMessage::where('ticket_id', $ticketId)
            ->where('user_id', '!=', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'status' => true,
            'message' => 'Messages marked as read'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\NewChatMessage;
use App\Models\ChatMessage;
use App\Models\Ticket;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\TryCatch;

class ChatController extends Controller
{
    public function getMessages(Request $request, $ticketId)
    {
        try {
            $ticket = Ticket::forUser($request->user())->find($ticketId);

            if (!$ticket) {
                return sendResponseWithMessage(false, 'ticket not found!', 404);
            }

            $messages = ChatMessage::where('ticket_id', $ticketId)
                ->with('user')
                ->orderBy('created_at', 'asc')
                ->get();

            return sendResponseWithData('messages', $messages, true, 'get all messages', 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }


    public function sendMessage(Request $request, $ticketId)
    {
        try {
            $ticket = Ticket::forUser($request->user())->find($ticketId);

            if (!$ticket) {
                return sendResponseWithMessage(false, 'ticket not found!', 404);
            }

            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) {
                return sendResponseWithData('errors', $validator->errors(), true, 422);
            }

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

            return sendResponseWithData('chatMessage', $chatMessage, true, 'message send successfully', 200);
        } catch (\Exception $e) {
            Log::error('Error in sendMessage:', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'user_id' => $request->user()->id,
            ]);

            return sendResponseWithMessage(false, 'Failed to send message', 500);
        }
    }


    public function markAsRead(Request $request, $ticketId)
    {
        try {
            $ticket = Ticket::forUser($request->user())->find($ticketId);

            if (!$ticket) {
                return sendResponseWithMessage(false, 'ticket not found!', 404);
            }

            ChatMessage::where('ticket_id', $ticketId)
                ->where('user_id', '!=', $request->user()->id)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return sendResponseWithMessage(true, 'Messages marked as read!', 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }
}

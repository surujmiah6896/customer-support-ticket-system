<?php

namespace App\Http\Controllers;

use App\Events\NewChatMessage;
use App\Models\ChatMessage;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function sendMessage(Request $request, $ticketId)
    {
        $ticket = Ticket::forUser($request->user())->find($ticketId);

        if(!$ticket){
            return response()->json(['errors' => ['message' => 'ticket not found!']], 404);
        }

        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $chatMessage = ChatMessage::create([
            'message' => $request->message,
            'ticket_id' => $ticketId,
            'user_id' => $request->user()->id,
        ]);

        //call event
        broadcast(new NewChatMessage($chatMessage))->toOthers();
        $data = [
            'status' => true,
            'chatMessage' => $chatMessage->load('user'),
            'message' => 'message sent successfull',
        ];

        return response()->json($data, 201);
    }
}

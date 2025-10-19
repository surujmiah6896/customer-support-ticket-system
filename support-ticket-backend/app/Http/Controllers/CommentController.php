<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function store(Request $request, $ticketId)
    {
        $ticket = Ticket::forUser($request->user())->find($ticketId);

        if(!$ticket){
            return response()->json(['errors' => ['message'=>'ticket not found!']], 404);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = Comment::create([
            'content' => $request->content,
            'ticket_id' => $ticketId,
            'user_id' => $request->user()->id,
        ]);

        $data = [
            'status' => true,
            'comment' => $comment->load('user'),
            'messages' => 'create comment successfully',
        ];

        return response()->json($data, 201);
    }
}

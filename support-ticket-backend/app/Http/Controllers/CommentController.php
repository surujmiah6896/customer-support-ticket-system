<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Ticket;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function store(Request $request, $ticketId)
    {
        try {
            $ticket = Ticket::forUser($request->user())->find($ticketId);

            if (!$ticket) {
                return sendResponseWithMessage(false, 'ticket not found!', 404);
            }

            $validator = Validator::make($request->all(), [
                'content' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) {
                return sendResponseWithData('errors', $validator->errors(), false, 'validation error', 422);
            }

            $comment = Comment::create([
                'content' => $request->content,
                'ticket_id' => $ticketId,
                'user_id' => $request->user()->id,
            ]);

            $comment = $comment->load('user');

            return sendResponseWithData('comment', $comment, true, 'create comment successfully', 201);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, $ticketId, $commentId)
    {
        try {
            $comment = Comment::where('ticket_id', $ticketId)->find($commentId);

            if (!$comment) {
                return sendResponseWithMessage(false, 'comment not found!', 404);
            }

            if ($comment->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return sendResponseWithMessage(false, 'Unauthorized', 403);
            }
            $comment->delete();

            return sendResponseWithMessage(true, 'Comment deleted successfully', 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }
}

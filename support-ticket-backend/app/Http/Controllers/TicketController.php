<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tickets = Ticket::forUser($user)
            ->with(['user', 'assignedAdmin'])
            ->orderBy('created_at', 'desc')
            ->get();

        $data = [
            'status' => true,
            'tickets' => $tickets,
            'message' => 'get all tickets',
        ];

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:technical,billing,general,support',
            'priority' => 'required|in:low,medium,high,urgent',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments');
        }

        $ticket = Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
            'attachment' => $attachmentPath,
            'user_id' => $request->user()->id,
        ]);

        $data = [
            'status'=>true,
            'ticket' => $ticket->load('user'),
            'message' => 'create ticket',
        ];
        return response()->json($data, 201);
    }
}

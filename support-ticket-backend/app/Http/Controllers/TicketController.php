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

    public function show(Request $request, $id)
    {
        $ticket = Ticket::forUser($request->user())->findOrFail($id);
        $data = [
            'status' => true,
            'ticket' => $ticket->load(['user', 'assignedAdmin']),
        ];
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::forUser($request->user())->findOrFail($id);

        // Customers can only update certain fields
        if ($request->user()->isCustomer()) {
            $validator = Validator::make($request->all(), [
                'subject' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
            ]);
        } else {
            // Admins can update status and assign tickets
            $validator = Validator::make($request->all(), [
                'status' => 'sometimes|in:open,in_progress,resolved,closed',
                'assigned_admin_id' => 'sometimes|nullable|exists:users,id',
            ]);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ticket->update($request->all());

        $data = [
            'status' => true,
            'ticket' => $ticket->load(['user', 'assignedAdmin']),
            'message' => 'update successfully',
        ];

        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $ticket = Ticket::forUser($request->user())->findOrFail($id);

        if ($request->user()->isCustomer() && $ticket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ticket->delete();

        $data = [
            'status' => true,
            'message' => 'Ticket deleted successfully',
        ];

        return response()->json($data);
    }

}

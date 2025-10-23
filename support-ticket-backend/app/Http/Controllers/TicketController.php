<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Exception;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $tickets = Ticket::forUser($user)
                ->with(['user', 'assignedAdmin'])
                ->orderBy('created_at', 'desc')
                ->get();

            if (!$tickets) {
                return  sendResponseWithMessage(false, 'ticket not found!', 404);
            }

            return sendResponseWithData('tickets', $tickets, true, 'get all tickets', 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'subject' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|in:technical,billing,general,support',
                'priority' => 'required|in:low,medium,high,urgent',
                'attachment' => 'nullable|file|max:10240',
            ]);

            if ($validator->fails()) {
                return sendResponseWithData('errors', $validator->errors(), true, 422);
            }

            $attachmentPath = null;

            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $filename = time() . '_' . $file->getClientOriginalName();

                $directory = public_path('uploads');
                if (!File::exists($directory)) {
                    File::makeDirectory($directory, 0755, true);
                }

                $file->move($directory, $filename);
                $attachmentPath = 'uploads/' . $filename;
            }

            $user_id = $request->user_id ? $request->user_id : $request->user()->id;

            $ticket = Ticket::create([
                'subject' => $request->subject,
                'description' => $request->description,
                'category' => $request->category,
                'priority' => $request->priority,
                'attachment' => $attachmentPath,
                'user_id' => $user_id,
            ]);

            $ticket = $ticket->load('user');
            return sendResponseWithData('ticket', $ticket, true, 'create ticket', 201);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $ticket = Ticket::forUser($request->user())->find($id);

            if (!$ticket) {
                return sendResponseWithMessage(false, 'ticket not found!', 404);
            }

            $ticket = $ticket->load(['user', 'assignedAdmin', 'comments.user', 'chatMessages.user']);

            return sendResponseWithData('ticket', $ticket, true, 'get successfully!', 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $ticket = Ticket::forUser($request->user())->find($id);

            if (!$ticket) {
                return sendResponseWithMessage(false, 'ticket not found!', 404);
            }

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
                return sendResponseWithData('errors', $validator->errors(), true, 422);
            }

            $ticket->update($request->all());

            $ticket = $ticket->load(['user', 'assignedAdmin']);

            return sendResponseWithData('ticket', $ticket, true, 'update successfully!', 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try{
            $ticket = Ticket::forUser($request->user())->find($id);

            if (!$ticket) {
                return sendResponseWithMessage(false, 'ticket not found!', 404);
            }

            if ($request->user()->isCustomer() && $ticket->user_id !== $request->user()->id) {
                return sendResponseWithMessage(false, 'Unauthorized', 403);
            }
            $ticket->delete();

            return sendResponseWithMessage(true, 'Ticket deleted successfully', 200);

        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }
}

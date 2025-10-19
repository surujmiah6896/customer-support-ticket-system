<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'ticket_id',
        'user_id',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];
}

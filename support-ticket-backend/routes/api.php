<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TicketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::prefix('v1')->group(function(){
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);



    Route::middleware('auth:sanctum')->group(function(){
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::get('/customers', [AuthController::class, 'getCustomers']);

        // tickets
        Route::apiResource('tickets', TicketController::class);
        Route::post('tickets/{id}', [TicketController::class,'update']);
        Route::delete('tickets/{id}', [TicketController::class, 'destroy']);

        //comments
        Route::post('tickets/{ticketId}/comments', [CommentController::class, "store"]);
        Route::delete('tickets/{ticketId}/comments/{commentId}', [CommentController::class, 'destroy']);

        //chat
        Route::get('/tickets/{ticketId}/chat', [ChatController::class, 'getMessages']);
        Route::post('tickets/{ticketId}/chat', [ChatController::class, 'sendMessage']);
        Route::post('tickets/{ticketId}/chat/mark-read', [ChatController::class, 'markAsRead']);
    });
});



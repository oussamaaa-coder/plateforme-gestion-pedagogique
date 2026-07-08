<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Channel;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get all messages for a specific channel
     */
    public function index($channelId)
    {
        try {
            // Find messages ordered by created_at ascending as requested
            $messages = Message::with('user:id,nom,prenom,role') // load basic user info
                ->where('channel_id', $channelId)
                ->orderBy('created_at', 'asc')
                ->get();
                
            return ApiResponse::ok($messages);
        } catch (\Exception $e) {
            \Log::error("Get Channel Messages Error: " . $e->getMessage());
            return ApiResponse::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Store a new message
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'content' => 'required|string',
                'channel_id' => 'required|integer|exists:channels,id'
            ]);

            // Create new message
            $message = Message::create([
                'content' => $data['content'],
                'user_id' => auth()->id() ?? $request->input('user_id'), // fallback for safety
                'channel_id' => $data['channel_id']
            ]);

            // Eager load the user data so frontend can display names immediately
            $message->load('user:id,nom,prenom,role');

            return ApiResponse::ok($message, 'Message sent', [], 201);
        } catch (\Exception $e) {
            \Log::error("Send Message Error: " . $e->getMessage());
            return ApiResponse::error($e->getMessage(), null, 500);
        }
    }
}

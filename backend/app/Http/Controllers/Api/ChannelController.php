<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Channel;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    /**
     * Get channels for a specific group
     */
    public function getGroupChannels($groupId)
    {
        try {
            // Find all channels belonging to this group
            $channels = Channel::where('groupe_id', $groupId)->get();
            
            // If none exist, create a default "Général" channel to make it easy
            if ($channels->isEmpty()) {
                $defaultChannel = Channel::create([
                    'name' => 'Général',
                    'groupe_id' => $groupId
                ]);
                
                $channels = collect([$defaultChannel]);
            }
            
            return ApiResponse::ok($channels);
        } catch (\Exception $e) {
            \Log::error("Get Group Channels Error: " . $e->getMessage());
            return ApiResponse::error($e->getMessage(), null, 500);
        }
    }
}

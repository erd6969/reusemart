<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class NotificationController
{
    public function sendNotification(Request $request)
    {
        $deviceToken = $request->input('token');
        $title = $request->input('title');
        $body = $request->input('body');

        $messaging = app('firebase.messaging');

        $notification = Notification::create($title, $body);

        $data = [
            'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
            'title' => $title,
            'body' => $body,
        ];

        $message = CloudMessage::new()
            ->withTarget('token', $deviceToken)
            ->withNotification($notification)
            ->withData($data);

        try {
            $messaging->send($message);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }
}

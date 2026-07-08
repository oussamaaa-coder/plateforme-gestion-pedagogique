<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::query()->where('user_id', $request->user()->id);

        if ($request->filled('is_read')) {
            $query->where('is_read', filter_var($request->query('is_read'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $result = $query->orderByDesc('id')->paginate($perPage);

        return ApiResponse::ok($result, 'Notifications chargées.', [
            'filters' => [
                'is_read' => $request->query('is_read'),
            ],
        ]);
    }

    public function unreadCount(Request $request)
    {
        $count = Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return ApiResponse::ok(['count' => $count], 'Nombre de notifications non lues.');
    }

    public function markRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            return ApiResponse::error("Accès refusé: notification non accessible.", null, 403, 'FORBIDDEN');
        }

        $notification->is_read = true;
        $notification->save();

        return ApiResponse::ok($notification->fresh(), 'Notification marquée comme lue.', [
            'changed' => ['is_read'],
        ]);
    }

    public function markAllRead(Request $request)
    {
        $count = Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return ApiResponse::ok(['updated' => $count], 'Toutes les notifications ont été marquées comme lues.', [
            'changed' => ['is_read'],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'message' => ['required', 'string'],
            'title'   => ['nullable', 'string', 'max:255'],
            'type'    => ['nullable', 'string', 'in:info,warning,success,absence,note,system'],
        ]);

        $notification = Notification::query()->create($data);

        return ApiResponse::ok($notification, 'Notification créée.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function broadcast(Request $request)
    {
        $data = $request->validate([
            'message' => ['required', 'string'],
            'title'   => ['nullable', 'string', 'max:255'],
            'type'    => ['nullable', 'string', 'in:info,warning,success,absence,note,system'],
            'roles'   => ['nullable', 'array'],
            'roles.*' => ['string', 'in:admin,formateur,etudiant'],
        ]);

        $query = User::query();
        if (!empty($data['roles'])) {
            $query->whereIn('role', $data['roles']);
        }

        $users = $query->pluck('id');
        $count = 0;

        foreach ($users as $userId) {
            Notification::create([
                'user_id' => $userId,
                'message' => $data['message'],
                'title'   => $data['title'] ?? null,
                'type'    => $data['type'] ?? 'info',
            ]);
            $count++;
        }

        return ApiResponse::ok(['sent' => $count], "Notification envoyée à {$count} utilisateur(s).", [], 201);
    }

    public function all(Request $request)
    {
        $query = Notification::query()->with('user:id,prenom,nom,role');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function($q) use ($search) {
                $q->where('message', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('prenom', 'like', "%{$search}%")
                        ->orWhere('nom', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $result = $query->orderByDesc('id')->paginate($perPage);

        return ApiResponse::ok($result, 'Toutes les notifications chargées.');
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return ApiResponse::ok(null, 'Notification supprimée.');
    }
}

<?php

namespace App\Support;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function ok(mixed $data = null, string $message = 'OK', array $meta = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data instanceof Arrayable ? $data->toArray() : $data,
            'meta' => (object) $meta,
        ], $status);
    }

    public static function error(string $message, mixed $errors = null, int $status = 400, ?string $errorCode = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'code' => $status,
            'error_code' => $errorCode,
        ], $status);
    }
}


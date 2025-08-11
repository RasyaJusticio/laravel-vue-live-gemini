<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    public function generateAuthToken($expireIn = 30, $uses = 1)
    {
        $expireTime = Carbon::now('UTC')->addMinutes($expireIn)->toIso8601String();
        $body = [
            'expireTime' => $expireTime,
            'uses' => $uses,
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'x-goog-api-key' => env('GEMINI_API_KEY'),
        ])->post('https://generativelanguage.googleapis.com/v1alpha/auth_tokens', $body);

        $data = $response->json();

        return [
            'token' => $data['name'],
            'expireTime' => $expireTime,
            'maxUses' => $uses,
        ];
    }
}

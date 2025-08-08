<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class GeminiService
{
    public function generateAuthToken($expireIn = 30, $uses = 1)
    {
        $body = [
            'expireTime' => Carbon::now('UTC')->addMinutes($expireIn)->toIso8601String(),
            'uses' => $uses,
            'bidiGenerateContentSetup' => [
                'model' => 'models/gemini-2.0-flash-exp',
                'generationConfig' => [
                    'responseModalities' => ['AUDIO'],
                    'temperature' => 0.7,
                ],
                'sessionResumption' => (object) [],
            ],
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'x-goog-api-key' => env('GEMINI_API_KEY'),
        ])->post('https://generativelanguage.googleapis.com/v1alpha/auth_tokens', $body);
        
        $data = $response->json();

        return $data['name'];
    }
}

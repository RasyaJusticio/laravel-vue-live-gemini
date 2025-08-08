<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MainAppController extends Controller
{
    public function index(GeminiService $geminiService)
    {
        $token = $geminiService->generateAuthToken();

        return Inertia::render('App', ['token' => $token]);
    }
}

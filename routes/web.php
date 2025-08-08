<?php

use App\Http\Controllers\MainAppController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainAppController::class, 'index'])->name('home');

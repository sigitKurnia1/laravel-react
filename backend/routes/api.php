<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//Admin Route
Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::apiResource("/hotel", App\Http\Controllers\Api\HotelController::class);
    Route::apiResource("/foodcafe", App\Http\Controllers\Api\FoodcafeController::class);
    Route::apiResource("/facility", App\Http\Controllers\Api\FacilityController::class);
    Route::apiResource("/news", App\Http\Controllers\Api\NewsController::class);
});

//Admin & User Route
Route::post('/register', App\Http\Controllers\Api\RegisterController::class);
Route::post('/login', App\Http\Controllers\Api\LoginController::class);
Route::post('/logout', App\Http\Controllers\Api\LogoutController::class);
Route::get("/refresh-token", [AuthController::class, 'refresh_token']);
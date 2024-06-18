<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\UserController;

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

//User Route
Route::middleware(['auth:api', 'user'])->group(function () {
    Route::get("/user-hotel", [UserController::class, "show_hotel"]);
    Route::get("/user-hotel-detail/{id}", [UserController::class, "detail_hotel"]);
    Route::get("/user-foodcafe", [UserController::class, "show_foodcafe"]);
    Route::get("/user-foodcafe-detail/{id}", [UserController::class, "detail_foodcafe"]);
    Route::get("/user-facility", [UserController::class, "show_facility"]);
    Route::get("/user-facility-detail/{id}", [UserController::class, "detail_facility"]);
    Route::get("/user-news", [UserController::class, "show_news"]);
    Route::get("/user-news-detail/{id}", [UserController::class, "detail_news"]);
});

//Admin & User Route
Route::post("/register", App\Http\Controllers\Api\RegisterController::class);
Route::post("/login", App\Http\Controllers\Api\LoginController::class);
Route::post("/logout", App\Http\Controllers\Api\LogoutController::class);
Route::get("/refresh-token", [AuthController::class, "refresh_token"]);
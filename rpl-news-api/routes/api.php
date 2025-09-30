<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\GalleryController;
use App\Http\Controllers\api\NewsController;
use App\Http\Middleware\OnlyAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
    Route::post('change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::post('update-profile/{id}', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
    Route::post('update-user/{id}', [AuthController::class, 'updateUser'])->middleware('auth:sanctum', OnlyAdmin::class);
    Route::post('delete-user/{id}', [AuthController::class, 'deleteUser'])->middleware('auth:sanctum', OnlyAdmin::class);
    Route::get('user', [AuthController::class, 'getUser'])->middleware('auth:sanctum');
    Route::get('allUsers', [AuthController::class, 'allUsers'])->middleware('auth:sanctum');
});


Route::prefix('news')->group(function () {
    Route::post('create', [NewsController::class, 'create'])->middleware('auth:sanctum');
    Route::put('update/{id}', [NewsController::class, 'update'])->middleware('auth:sanctum');
    Route::post('delete/{id}', [NewsController::class, 'delete'])->middleware('auth:sanctum');
    Route::patch('approve/{id}', [NewsController::class, 'approve'])->middleware('auth:sanctum');
    Route::patch('reject/{id}', [NewsController::class, 'reject'])->middleware('auth:sanctum');
    Route::get('detail/{id}', [NewsController::class, 'details'])->middleware('auth:sanctum');
    Route::get('list', [NewsController::class, 'index']);
});

Route::prefix('gallery')->group(function () {
    Route::post('create', [GalleryController::class, 'create'])->middleware('auth:sanctum');
    Route::get('list', [GalleryController::class, 'index']);
    Route::get('show/{id}', [GalleryController::class, 'show']);
    Route::post('update/{id}', [GalleryController::class, 'update'])->middleware('auth:sactum');
    Route::post('delete/{id}', [GalleryController::class, 'delete'])->middleware('auth:sanctum');
});

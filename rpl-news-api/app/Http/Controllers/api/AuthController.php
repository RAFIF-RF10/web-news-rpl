<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{

    // Edit password
    public function changePassword(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6',
        ]);
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Password lama salah'], 400);
        }
        $user->password = bcrypt($request->new_password);
        $user->save();
        return response()->json(['success' => true, 'message' => 'Password berhasil diubah']);
    }

    // Edit profile (termasuk upload gambar)
   public function updateProfile(Request $req)
{
    $user = $req->user();

    $req->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'profile_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',
    ]);

    $updateData = $req->only(['name', 'email']);

    // Handle upload image
    if ($req->hasFile('profile_image')) {
        // Hapus file lama jika ada
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $req->file('profile_image')->store('profile_images', 'public');
        $updateData['profile_image'] = $path;
    }

    $user->update($updateData);

    return response()->json([
        'message' => 'Profile updated successfully',
        'data' => $user
    ], 200);
}



    // Admin register author
    public function register(Request $request)
    {
        // Hapus field profile_image jika kosong/null agar validator tidak error
        if (!$request->hasFile('profile_image') && empty($request->profile_image)) {
            $request->request->remove('profile_image');
        }
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'in:admin,author',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
        ]);
        $data = $request->only(['name', 'email', 'password', 'role']);
        $data['password'] = bcrypt($data['password']);
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $data['profile_image'] = $path;
        }
        // Default role author jika tidak diisi
        if (!isset($data['role'])) {
            $data['role'] = 'author';
        }
        $user = \App\Models\User::create($data);
        return response()->json(['success' => true, 'data' => $user]);
    }

    // Admin edit user
    public function updateUser(Request $req, $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 404);
    }

    $req->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'role' => 'sometimes|in:admin,author',
        'profile_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',
        'password' => 'nullable|string|min:6'
    ]);

    $updateData = $req->only(['name', 'email', 'role']);

    if ($req->filled('password')) {
        $updateData['password'] = bcrypt($req->password);
    }

    if ($req->hasFile('profile_image')) {
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }
        $path = $req->file('profile_image')->store('profile_images', 'public');
        $updateData['profile_image'] = $path;
    }

    $user->update($updateData);

    return response()->json([
        'message' => 'User updated successfully',
        'data' => $user
    ], 200);
}

    // Admin delete user
    public function deleteUser($id)
    {
        $user = \App\Models\User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan'], 404);
        }
        $user->delete();
        return response()->json(['success' => true, 'message' => 'User berhasil dihapus']);
    }

    public function getUser(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function allUsers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden'
            ], 403);
        }

        $users = User::all();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }


    public function login(Request $req)
    {
        $req->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $req->email)->first();
        if (!$user || !Hash::check($req->password, $user->password)) {
            return response()->json([

                'message' => 'Invalid email or password'
            ], 401);
        }
        $token = $user->createToken('auth_tokern')->plainTextToken;
        return response()->json([
            'messgae' => 'User Logged In Successfully',
            'data' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $req)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'message' => 'User Not Found'
            ], 404);
        }
        $user->currentAccessToken()->delete();
        return response()->json([
            'message' => 'User Logged Out Successfully'
        ], 200);
    }
}

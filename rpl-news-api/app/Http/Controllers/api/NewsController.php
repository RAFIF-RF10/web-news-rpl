<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function create(Request $req)
    {
        $req->validate([
            'title' => 'required',
            'location' => 'required',
            'category' => 'required|in:news,competition,alumni,kerjasama',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'sub' => 'nullable|string',
            'content' => 'nullable|string',
            'status' => 'in:draft,published'
        ]);

        $user = $req->user();
        $path = null;
        if ($req->hasFile('image')) {
            $path = $req->file('image')->store('images', 'public');
        }

        $data = $req->except('image');
        if ($user && $user->role === 'author') {
            $data['status'] = 'draft';
        }

        if ($user && $user->role === 'admin') {
            $data['status'] = $req->status ?? 'draft';
        }

        $news = new News($data);
        $news->user_id = $user ? $user->id : null;
        $news->image = $path;

        if ($news->status === 'published') {
            $news->published_at = now();
        }

        $news->save();

        return response()->json([
            'message' => 'News Created Successfully',
            'data' => $news
        ], 201);
    }

    // Endpoint untuk approve berita (admin only)
    public function approve($id)
    {
        $user = request()->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => ' Unauthorized'], 403);
        }
        $news = News::find($id);
        if (!$news) {
            return response()->json(['message' => ' News Not Found'], 404);
        }

        $news->status = 'published';
        $news->published_at = now();
        $news->save();

        return response()->json(['message' => ' News Approved', 'data' => $news]);
    }

    public function details(Request $req, $id)
    {
        $news = News::with('user')->find($id);

        if (!$news) {
            return response()->json(['message' => 'News Not Found'], 404);
        }

        return response()->json(['data' => $news]);
    }

    public function update(Request $req, $id)
    {

        $req->validate([
            'title' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:jpeg,png,gif,svg|max:2048',
            'location' => 'sometimes|string',
            'category' => 'sometimes|in:news,competition,alumni,kerjasama',
            'sub' => 'sometimes|string',
            'content' => 'sometimes|string',
            'status' => 'in:draft,published'
        ]);

        $news = News::find($id);
        if (!$news) {
            return response()->json([
                'message' => 'News Not Found'
            ], 404);
        }

        $updateData = $req->only(['title', 'location', 'category', 'sub', 'content', 'status']);

        if ($req->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $path = $req->file('image')->store('images', 'public');
            $news->image = $path;
        }

        $news->update($updateData);

        return response()->json([
            'message' => 'Partner updated successfully',
            'data' =>  $news
        ], 201);
    }

    public function reject($id)
    {
        $user = request()->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $news = News::find($id);
        if (!$news) {
            return response()->json(['message' => 'News Not Found'], 404);
        }

        $news->status = 'rejected';
        $news->save();

        return response()->json(['message' => 'News Rejected', 'data' => $news]);
    }

    public function delete($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json(['message' => 'News Not Found'], 404);
        }

        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        return response()->json(['message' => 'News Deleted Successfully']);
    }

    public function index()
    {
        $user = request()->user();
        $isAll = request()->query('all') === 'true';

        if ($isAll) {
            if ($user && $user->role === 'author') {
                $news = News::with('user')->where('user_id', $user->id)
                    ->orderByDesc('created_at')
                    ->get();
            } else {
                $news = News::with('user')->orderByDesc('created_at')->get();
            }
        } else {
            $news = News::with('user')->where('status', 'published')
                ->latest('published_at')
                ->get();
        }

        return response()->json(['data' => $news]);
    }

    public function show($id)
    {
        $news = News::with('user')->find($id);

        if (!$news) {
            return response()->json(['message' => 'News Not Found'], 404);
        }

        return response()->json(['data' => $news]);
    }
}

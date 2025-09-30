<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gallery = Gallery::all();
        return response()->json([
            'data' => $gallery
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'image' => 'required|image|mimes:png,jpg,jpeg,svg,gif',
            'description' => 'nullable|string',
        ]);


        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
        }
        $gallery = Gallery::create($request->all());


        $gallery->image = $path ?? null;
        $gallery->save();

        return response()->json([
            'message' => 'Gallery Created Successfully',
            'data' => $gallery
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $gallery = Gallery::find($id);

        if (!$gallery) {
            return response()->json([
                'message' => 'Gallery Not Found'
            ], 404);
        }

        return response()->json([
            'data' => $gallery
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return $this->show($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'sometimes|string'
        ]);

        $gallery = Gallery::find($id);
        if (!$gallery) {
            return response()->json([
                'message' => 'not found'
            ], 404);
        }

        $updateData = $request->only(['title', 'description']);
        if (!$request->hasFile('image')) {
            if (!$gallery->image) {
                Storage::disk('public')->delete($gallery->image);
            }
            $path = $request->file('image')->store('galleries', 'public');
            $gallery->image = $path;
        }

        $gallery->update($updateData);

        return response()->json([
            'message' => 'Gallery updated successfully',
            'data' => $gallery
        ], 201);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id)
    {
        $gallery = Gallery::find($id);

        if (!$gallery) {
            return response()->json([
                'message' => 'Gallery Not Found'
            ], 404);
        }

        // Delete image if exists
        if ($gallery->image) {
            Storage::disk('public')->delete($gallery->image);
        }

        $gallery->delete();

        return response()->json([
            'message' => 'Gallery Deleted Successfully'
        ]);
    }
}

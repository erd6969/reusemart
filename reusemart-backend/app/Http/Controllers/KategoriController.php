<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function searchByName($nama_kategori)
    {
        $kategori = Kategori::where('nama_kategori', 'like', '%' . $nama_kategori . '%')
        ->whereRaw('id_kategori % 10 != 0')
        ->get();
        if ($kategori->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori not found',
            ], 404);
        }

        return response()->json($kategori);
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
    public function show(kategori $kategori)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, kategori $kategori)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(kategori $kategori)
    {
        //
    }
}

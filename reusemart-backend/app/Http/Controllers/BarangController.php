<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Http\UploadedFile;
use App\Models\Kategori;

class BarangController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function showAll()
    {
        try {
            $Barang = Barang::all();
            return response()->json($Barang, 200);
        } catch (Exception $e) {
            return $e;
            // return response()->json(['message' => 'Data Barang tidak ditemukan.'], 404);
        }
    }

    public function showByCategory($namacategory)
    {
        try {
            $category = Kategori::where('nama_kategori', $namacategory)->firstOrFail();
            if (!$category) {
                return response()->json(['message' => 'Kategori tidak ditemukan.'], 404);
            }
            
            // dd($category->id_kategori);
            $id_kategori = $category->id_kategori;
            $Barang = Barang::where('id_kategori', $id_kategori)->get();
            if ($Barang->isEmpty()) {
                return response()->json(['message' => 'Data Barang dengan tidak ditemukan.'], 404);
            }
            return response()->json($Barang, 200);
            
        } catch (Exception $e) {
            dd($e);
            return response()->json(['message' => 'Data Barangasdasd tidak ditemukan.'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, barang $barang)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(barang $barang)
    {
        //
    }
}

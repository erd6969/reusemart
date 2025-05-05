<?php

namespace App\Http\Controllers;

use App\Models\Hunter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class HunterController
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
    public function show(hunter $hunter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, hunter $hunter)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(hunter $hunter)
    {
        //
    }

    public function searchHunter($search_hunter){
        try {
            if(empty($search_hunter)) {
                return response()->json([
                    'message' => 'Search query is empty.',
                ], 400); // Return a bad request if search query is empty
            }
    
            $hunter = Hunter::where('nama_hunter', 'like', '%' . $search_hunter . '%')
                ->select('hunter.*')
                ->get();
    
            if ($hunter->isEmpty()) {
                return response()->json([
                    'message' => 'Hunter tidak ditemukan.',
                ], 404);
            }
    
            return response()->json($hunter, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mencari hunter',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function resetPassword($id){
        try{
            $hunter = Hunter::where('id_hunter', $id)->first();
            if (!$hunter) {
                return response()->json([
                    'message' => 'Hunter tidak ditemukan',
                ], 404);
            }
    
            $newPassword = $hunter->tanggal_lahir_hunter;
            Log::info('New Password: ' . $newPassword); // Log the new password for debugging
            $hunter->password_hunter = Hash::make($newPassword);
            $hunter->save();
    
            return response()->json([
                'message' => 'Password berhasil direset',
                'new_password' => $newPassword,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mereset password',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

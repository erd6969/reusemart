<?php

namespace App\Http\Controllers;

use App\Models\Merchandise;
use Illuminate\Http\Request;

class MerchandiseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

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
            $merchandises = Merchandise::all();
            if ($merchandises->isEmpty()) {
                return response()->json([
                    'message' => 'No merchandise found',
                ], 404);
            }
            return response()->json($merchandises, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving merchandise',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, merchandise $merchandise)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(merchandise $merchandise)
    {
        //
    }
}

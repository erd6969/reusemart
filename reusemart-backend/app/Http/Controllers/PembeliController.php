<?php

namespace App\Http\Controllers;

use App\Models\Pembeli;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class PembeliController
{
    public function register(Request $request){
        try{
            $request->validate([
                'email_pembeli' => 'required|email|unique:pembeli,email_pembeli',
                'password_pembeli' => 'required|min:8',
                'nama_pembeli' => 'required|string|max:255',
                'nomor_telepon_pembeli' => 'required|string|max:15',
                'tanggal_lahir_pembeli' => 'required|date',
                'foto_pembeli' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $pembeli = Pembeli::create([
                'email_pembeli' => $request->email_pembeli,
                'password_pembeli' => Hash::make($request->password_pembeli),
                'nama_pembeli' => $request->nama_pembeli,
                'nomor_telepon_pembeli' => $request->nomor_telepon_pembeli,
                'tanggal_lahir_pembeli' => $request->tanggal_lahir_pembeli,
                'poin_loyalitas' => 0,
                'foto_pembeli' => $request->foto_pembeli ?? null,
            ]);

            return response()->json([
                'message' => 'Registration successful',
                'pembeli' => $pembeli,
            ], 201);
            
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
        
    }

    public function login(Request $request){
        $request->validate([
            'email_pembeli' => 'required|email',
            'password_pembeli' => 'required',
        ]);

        $pembeli = Pembeli::where('email_pembeli', $request->email_pembeli)->first();

        if (!$pembeli || !Hash::check($request->password_pembeli, $pembeli->password_pembeli)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $token = $pembeli->createToken('Personal Access Token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'pembeli' => $pembeli,
            'token' => $token,
        ]);
    }

    public function logout(Request $request){
        if(Auth::check()){
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Logout successful',
            ]);
        }

        return response()->json([
            'message' => 'No user is logged in',
        ], 401);
    }

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
    public function show(pembeli $pembeli)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, pembeli $pembeli)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(pembeli $pembeli)
    {
        //
    }
}

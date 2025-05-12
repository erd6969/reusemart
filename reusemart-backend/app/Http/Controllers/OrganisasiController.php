<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use App\Models\Barang;
use App\Models\RequestDonasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class OrganisasiController
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'email_organisasi' => 'required|email|unique:organisasi,email_organisasi|unique:penitip,email_penitip|unique:pegawai,email_pegawai|unique:hunter,email_hunter|unique:pembeli,email_pembeli',
                'password_organisasi' => 'required|min:8|same:konfirmasi_password_organisasi',
                'konfirmasi_password_organisasi' => 'required',
                'nama_organisasi' => 'required|string|max:255',
                'nomor_telepon_organisasi' => 'required|string|max:15',
                'alamat_organisasi' => 'required|string|max:255',
                'foto_organisasi' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $foto_organisasi_path = 'blank-organisasi-profile-picture.png';

            $organisasi = Organisasi::create([
                'email_organisasi' => $request->email_organisasi,
                'password_organisasi' => Hash::make($request->password_organisasi),
                'nama_organisasi' => $request->nama_organisasi,
                'nomor_telepon_organisasi' => $request->nomor_telepon_organisasi,
                'alamat_organisasi' => $request->alamat_organisasi,
                'foto_organisasi' => $foto_organisasi_path,
            ]);

            return response()->json([
                'message' => 'Registration successful',
                'organisasi' => $organisasi,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
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
    public function show()
    {
        try {
            return response()->json(Organisasi::paginate(10), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Organisasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showByOpenDonasi()
    {
        try {
            $barang = Barang::join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->where('detail_transaksi_penitipan.status_penitipan', '=', 'open donasi')
                ->select('barang.*')
                ->paginate(10);

            return response()->json($barang, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'data ga ada woiii',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showWaitingRequestById()
    {
        try {
            $organisasi = auth('organisasi')->user();
            $donasi = DB::table('request_donasi')  
            ->where('request_donasi.id_organisasi', $organisasi->id_organisasi)              
            ->where('request_donasi.status_request', '=', 'waiting')
            ->get();
            return response()->json([
                'meesage' => 'Request Donasi found',
                'data' => $donasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
   
    public function showHistoryRequestById()
    {
        try {
            $organisasi = auth('organisasi')->user();
            $donasi = DB::table('request_donasi')  
            ->where('request_donasi.id_organisasi', $organisasi->id_organisasi)              
            ->whereIn('status_request', ['rejected', 'accepted'])
            ->get();
            return response()->json([
                'meesage' => 'Request Donasi found',
                'data' => $donasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function profile()
    {
        try {
            $organisasi = auth('organisasi')->user();
            return response()->json($organisasi, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Organisasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }


    public function update(Request $request, $id_organisasi)
    {
        try {
            $organisasi = Organisasi::find($id_organisasi);
            if (!$organisasi) {
                return response()->json(['message' => 'Organisasi not found'], 404);
            }

            $validatedData = $request->validate([
                'email_organisasi' => 'required|email|unique:organisasi,email_organisasi,' . $id_organisasi . ',id_organisasi',
                'nama_organisasi' => 'required|string|max:255',
                'nomor_telepon_organisasi' => 'required|string|max:15',
                'alamat_organisasi' => 'required|string|max:255',
                'foto_organisasi' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $updateData = [
                'email_organisasi' => $validatedData['email_organisasi'],
                'nama_organisasi' => $validatedData['nama_organisasi'],
                'nomor_telepon_organisasi' => $validatedData['nomor_telepon_organisasi'],
                'alamat_organisasi' => $validatedData['alamat_organisasi'],
            ];

            if ($request->hasFile('foto_organisasi')) {
                $image = $request->file('foto_organisasi');
                $uploadFolder = 'img/Organisasi';
                $image_uploaded_path = $image->store($uploadFolder, 'public');
                $uploadedImageResponse = basename($image_uploaded_path);

                // Menghapus foto lama jika ada
                if ($organisasi->foto_organisasi && Storage::disk('public')->exists($uploadFolder . '/' . $organisasi->foto_organisasi)) {
                    Storage::disk('public')->delete($uploadFolder . '/' . $organisasi->foto_organisasi);
                }

                // Update foto organisasi
                $updateData['foto_organisasi'] = $uploadedImageResponse;
            }

            $organisasi->update($updateData);

            return response()->json([
                'message' => 'Organisasi updated successfully',
                'data' => $organisasi
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update organisasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id_organisasi)
    {
        try {
            $organisasi = Organisasi::find($id_organisasi);
            if (!$organisasi) {
                return response()->json([
                    'message' => 'Organisasi not found',
                ], 404);
            }
            $organisasi->delete();
            return response()->json([
                'message' => 'Organisasi deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Organisasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function search($search_)
    {
        try {
            $organisasi = Organisasi::where('nama_organisasi', 'like', '%' . $search_ . '%')->get();
            if ($organisasi->isEmpty()) {
                return response()->json([
                    'message' => 'Organisasi not found',
                ], 404);
            }
            return response()->json([
                'message' => 'Organisasi found',
                'data' => $organisasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Organisasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }


    public function createRequestDonasi(Request $request)
    {
        $organisasi = auth('organisasi')->user();
        try {
            $request->validate([
                'detail_request' => 'required|string|max:255',
            ]);

            $request_donasi = RequestDonasi::create([
                'id_organisasi' => $organisasi->id_organisasi,
                'detail_request' => $request->detail_request,
                'status_request' => 'Waiting',
            ]);

            return response()->json([
                'message' => 'Request Donasi created successfully',
                'data' => $request_donasi
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create Request Donasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function searchRequestDonasi($search_)
    {
        $organisasi = auth('organisasi')->user();
        try {
            $organisasi = RequestDonasi::where('detail_request', 'like', '%' . $search_ . '%')
            ->where('id_organisasi', $organisasi->id_organisasi)
            ->where('status_request', 'waiting')
            ->get();
            if ($organisasi->isEmpty()) {
                return response()->json([
                    'message' => 'Request tidak ada',
                ], 404);
            }
            return response()->json(
               $organisasi
            , 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request ga ada',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function searchHistoryReqDonasi($search_)
    {
        $organisasi = auth('organisasi')->user();
        try {
            $organisasi = RequestDonasi::where('detail_request', 'like', '%' . $search_ . '%')
            ->where('id_organisasi', $organisasi->id_organisasi)
            ->whereIn('status_request', ['rejected', 'accepted'])
            ->get();
            if ($organisasi->isEmpty()) {
                return response()->json([
                    'message' => 'Request tidak ada',
                ], 404);
            }
            return response()->json(
               $organisasi
            , 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request ga ada',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function updateRequestDonasi(Request $request, $id_request_donasi)
    {
        try {
            $organisasi = RequestDonasi::find($id_request_donasi);
            if (!$organisasi) {
                return response()->json(['message' => 'req donasi tidak ditemukan'], 404);
            }

            $validatedData = $request->validate([
              'detail_request' => 'required|string|max:255',
            ]);

            $updateData = [
                'detail_request' => $validatedData['detail_request']
            ];

            $organisasi->update($updateData);

            return response()->json([
                'message' => 'Organisasi updated successfully',
                'data' => $organisasi
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update organisasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function DeleteRequestDonasi($id_request_donasi)
    {
        try {
            $organisasi = RequestDonasi::find($id_request_donasi);
            if (!$organisasi) {
                return response()->json([
                    'message' => 'request not found',
                ], 404);
            }
            $organisasi->delete();
            return response()->json([
                'message' => 'request deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'request not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }


}

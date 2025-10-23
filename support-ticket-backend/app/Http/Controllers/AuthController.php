<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use function Laravel\Prompts\error;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try{
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return sendResponseWithData('errors', $validator->errors(), true, 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'customer',
            ]);

            $token = $user->createToken('auth_token', ['*'], now()->addWeek())->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'status' => true,
                'message' => 'successfull register',
            ], 201);
        }catch(Exception $e){
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }

    }

    public function login(Request $request)
    {
        try{
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return sendResponseWithData('errors', $validator->errors(), false, 'validation error', 422);
            }

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'Invalid login details'
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'status' => true,
                'message' => 'successfull login',
            ], 200);
        }catch(Exception $e){
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function logout(Request $request){
        try{
            $request->user()->currentAccessToken()->delete();
            return sendResponseWithMessage(true, 'Logged out successfully', 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function user(Request $request)
    {
        try{
            $user = $request->user();
            return sendResponseWithData('user', $user, true, "user get successfully", 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }

    public function getCustomers(Request $request)
    {
        try{
            $customers = User::where('role','customer')->get();
            return sendResponseWithData('customers', $customers, true, "customers get successfully", 200);
        } catch (Exception $e) {
            return sendResponseWithMessage(false, $e->getMessage(), 500);
        }
    }


}

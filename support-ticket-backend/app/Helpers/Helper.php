<?php

if (!function_exists('sendResponseWithMessage')) {
    function sendResponseWithMessage($status = false, $message = null, $code=500)
    {
        return response()->json([
            'status' => $status,
            'message' => $message
        ], $code);
    }
}

if (!function_exists('sendResponseWithData')) {
    function sendResponseWithData($dataKey = null, $data = null, $status = false, $message = null, $code=500)
    {
        return response()->json([
            'status'  => $status,
            'message' => $message,
            $dataKey  => $data ?? [],
        ], $code);
    }
}

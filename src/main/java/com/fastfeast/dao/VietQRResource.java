package com.fastfeast.dao;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.json.JSONObject;

public class VietQRResource {

    private static final String API_URL = "https://api.vietqr.io/v2/generate";
    private static final String CLIENT_ID = System.getenv("VIETQR_CLIENT_ID");
    private static final String API_KEY = System.getenv("VIETQR_API_KEY");

    // POST thông tin ngân hàng lên VietQR để generate QR
    public static JSONObject generateQR(String orderId, int amount) throws Exception {

        if (CLIENT_ID == null || API_KEY == null) {
            throw new RuntimeException(
                    "Lỗi biến môi trường VIETQR_CLIENT_ID hoặc VIETQR_API_KEY, hãy chắc chắn bạn đã cài đặt biến môi trường");
        }

        URL url = new URL(API_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("x-client-id", CLIENT_ID);
        conn.setRequestProperty("x-api-key", API_KEY);
        conn.setDoOutput(true);

        JSONObject body = new JSONObject();
        body.put("accountNo", "0001479224441");
        body.put("accountName", "HUYNH LE ANH THANG");
        body.put("acqId", 970422);
        body.put("amount", amount);
        body.put("addInfo", "FASTFEAST " + orderId);
        body.put("template", "nUD9Lni");

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = body.toString().getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();

        InputStream is = (responseCode >= 200 && responseCode < 300)
                ? conn.getInputStream()
                : conn.getErrorStream();

        BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
        StringBuilder response = new StringBuilder();
        String line;

        while ((line = br.readLine()) != null) {
            response.append(line.trim());
        }

        conn.disconnect();

        return new JSONObject(response.toString());
    }
}
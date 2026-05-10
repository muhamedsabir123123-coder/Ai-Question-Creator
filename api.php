<?php
header('Content-Type: application/json');

 $apiKey = "AIzaSyDCXy6ja1clZNFjW8wSXBi4fJh3y8Lxgo4";

$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData || !isset($inputData['topic']) || !isset($inputData['count'])) {
    echo json_encode(["error" => ["message" => "Missing topic or count."]]);
    exit;
}

$topic = $inputData['topic'];
$count = $inputData['count'];

$prompt = "You are a professional teacher. Generate exactly " . $count . " multiple-choice questions about " . $topic . ". Format the text neatly. Provide the correct answers clearly at the very bottom of the test.";

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => $prompt]
            ]
        ]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

$response = curl_exec($ch);

if(curl_errno($ch)){
    echo json_encode(["error" => ["message" => "cURL Error: " . curl_error($ch)]]);
} else {
    echo $response;
}

curl_close($ch);
?>
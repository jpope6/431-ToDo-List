<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

require("helpers/handler.php");

$handler = new Handler();

$handler->process();


function GET(Handler $handler) {
    $id = $handler->request->get['id'] ?? false;
    if ($id !== false) {
        $handler->response->json(getRecord($handler, $id));
    } else {
        $handler->response->json(getAllRecords($handler));
    }
}

function getRecord(Handler $handler, $id) {
    $pdo = $handler->db->PDO();
    $query = "SELECT * FROM lists WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$id]);
    $result = $statement->fetchAll();
    $handler->response->json($result);
}

function getAllRecords(Handler $handler) {
    $pdo = $handler->db->PDO();
    $query = "SELECT * FROM lists";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $result = $statement->fetchAll();
    $handler->response->json($result);
}

function DELETE(Handler $handler) {
    $id = $handler->request->get['id'] ?? false;
    if (!$id) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing ID for deletion");
    }
    $pdo = $handler->db->PDO();
    $query = "DELETE FROM lists WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$id]);
    $handler->response->json(["success" => true, "message" => "Record deleted"]);
}

function POST(Handler $handler) {
    $name = $handler->request->input['name'] ?? null;
    if (!$name) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing necessary fields");
    }
    $pdo = $handler->db->PDO();
    $query = "INSERT INTO lists (name) VALUES (?)";
    $statement = $pdo->prepare($query);
    $statement->execute([$name]);
    $id = $pdo->lastInsertId();
    $handler->response->json(["success" => true, "id" => $id, "message" => "Record created"]);
}

function PUT(Handler $handler) {
    $id = $handler->request->get['id'] ?? null;

    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? null;

    if (!$id || !$name) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing ID or new data for update");
        return;
    }
    $pdo = $handler->db->PDO();
    $query = "UPDATE lists SET name = ? WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$name, $id]);
    $handler->response->json(["success" => true, "message" => "Record updated"]);
}
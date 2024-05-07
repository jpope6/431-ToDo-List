<?php

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
    $query = "SELECT * FROM Lists WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$id]);
    $result = $statement->fetchAll();
    $handler->response->json($result);
}

function getAllRecords(Handler $handler) {
    $pdo = $handler->db->PDO();
    $query = "SELECT * FROM Lists";
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
    $query = "DELETE FROM Lists WHERE idx = ?";
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
    $query = "INSERT INTO Lists (name) VALUES (?)";
    $statement = $pdo->prepare($query);
    $statement->execute([$name]);
    $id = $pdo->lastInsertId();
    $handler->response->json(["success" => true, "id" => $id, "message" => "Record created"]);
}

function PUT(Handler $handler) {
    $id = $handler->request->input['id'] ?? null;
    $name = $handler->request->input['name'] ?? null;
    if (!$id || !$name) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing ID or new data for update");
    }
    $pdo = $handler->db->PDO();
    $query = "UPDATE Lists SET name = ? WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$name, $id]);
    $handler->response->json(["success" => true, "message" => "Record updated"]);
}
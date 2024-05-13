<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

require("helpers/handler.php");

$handler = new Handler();

$handler->process();


function GET(Handler $handler) {
    $id = $handler->request->get['id'] ?? false;
    $listId = $handler->request->get['list_id'] ?? false;
    if ($id !== false) {
        getRecord($handler, $id);
    } else if ($listId !== false) {
        getListItems($handler, $listId);
    } else {
        getAllRecords($handler);
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

function getListItems(Handler $handler, $listId) {
    $pdo = $handler->db->PDO();
    $query = "SELECT * FROM listitems WHERE list_idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$listId]);
    $items = $statement->fetchAll();
    $handler->response->json($items);
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
    $id = $handler->request->get['id'] ?? null;
    $itemId = $handler->request->get['item_id'] ?? null;

    // Determine if this is a request to delete a list item
    if ($itemId !== null) {
        DELETE_ListItem($handler, $itemId);
        return;
    }

    // Handle list deletion
    if (!$id) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing ID for list deletion");
        return;
    }
    $pdo = $handler->db->PDO();
    $query = "DELETE FROM lists WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$id]);
    $handler->response->json(["success" => true, "message" => "List deleted"]);
}

function POST(Handler $handler) {
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if the request is to create a list item
    if (isset($input['list_id']) && isset($input['text'])) {
        POST_ListItem($handler, $input);
        return;
    }

    // Continue with list creation if not a list item creation
    $name = $input['name'] ?? null;
    if (!$name) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing necessary fields yerr");
        return;
    }

    $pdo = $handler->db->PDO();
    $query = "INSERT INTO lists (name) VALUES (?)";
    $statement = $pdo->prepare($query);
    $statement->execute([$name]);
    $id = $pdo->lastInsertId();
    $handler->response->json(["success" => true, "id" => $id, "message" => "Record created"]);
}

function POST_ListItem(Handler $handler, $input) {
    $listId = $input['list_id'] ?? null;
    $text = $input['text'] ?? null;

    if (!$listId || !$text) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing necessary fields man");
        return;
    }

    $pdo = $handler->db->PDO();
    $query = "INSERT INTO listitems (text, list_idx) VALUES (?, ?)";
    $statement = $pdo->prepare($query);
    $statement->execute([$text, $listId]);
    $id = $pdo->lastInsertId();
    $handler->response->json(["success" => true, "id" => $id, "message" => "List item created"]);
}

function PUT_ListItem(Handler $handler, $itemId, $input) {
    $text = $input['text'] ?? null;
    $checked = isset($input['checked']) ? (int)$input['checked'] : null;  // Cast to int to handle it correctly in SQL

    if (!$itemId || ($text === null && $checked === null)) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing ID or new data for list item update");
        return;
    }

    $pdo = $handler->db->PDO();
    $queryParams = [];
    $query = "UPDATE listitems SET ";
    if ($text !== null) {
        $query .= "text = ?, ";
        $queryParams[] = $text;
    }
    if ($checked !== null) {
        $query .= "checked = ?, ";
        $queryParams[] = $checked;  // Ensure boolean is correctly handled as an integer
    }
    $query = rtrim($query, ", ");
    $query .= " WHERE idx = ?";
    $queryParams[] = $itemId;

    $statement = $pdo->prepare($query);
    $success = $statement->execute($queryParams);
    if ($success) {
        $handler->response->json(["success" => true, "message" => "List item updated"]);
    } else {
        $handler->response->json(["success" => false, "message" => "Failed to update list item"]);
    }
}

function DELETE_ListItem(Handler $handler, $itemId) {
    if (!$itemId) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing item ID for list item deletion");
        return;
    }

    $pdo = $handler->db->PDO();
    $query = "DELETE FROM listitems WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $success = $statement->execute([$itemId]);
    if ($success) {
        $handler->response->json(["success" => true, "message" => "List item deleted"]);
    } else {
        $handler->response->json(["success" => false, "message" => "Failed to delete list item"]);
    }
}


function PUT(Handler $handler) {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $handler->request->get['id'] ?? null;
    $itemId = $handler->request->get['item_id'] ?? null;

    // Determine if this is a request to update a list item
    if ($itemId !== null) {
        PUT_ListItem($handler, $itemId, $input);
        return;
    }

    // Handle list update
    $name = $input['name'] ?? null;
    if (!$id || !$name) {
        $handler->response->HttpResponseCode(400, "Bad Request", "Missing ID or new data for list update");
        return;
    }
    $pdo = $handler->db->PDO();
    $query = "UPDATE lists SET name = ? WHERE idx = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$name, $id]);
    $handler->response->json(["success" => true, "message" => "Record updated"]);
}
<?php

namespace Brisum\DataTable;

trait WpCellUpdate
{
    /**
     * @param $table
     * @param $allowKeys
     * @return void
     */
    public function update($table, array $allowKeys = [])
    {
        global $wpdb;

        if (!isset($_POST['id'])) {
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            die('Empty id');
        }

        if (!isset($_POST['key']) || !in_array($_POST['key'], $allowKeys)) {
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            die('Empty key');
        }

        if (!isset($_POST['value'])) {
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            die('Empty translation');
        }

        global $wpdb;
        $id = intval($_POST['id']);
        $key = preg_replace('/[^a-z0-9_]/', '', $_POST['key']);
        $value = $_POST['value'];

        $result = $wpdb->query($wpdb->prepare(
            "UPDATE {$table}
                SET {$key} = '%s'
            WHERE id = '%d'",
            $value,
            $id
        ));
        if (false === $result) {
            status_header(500);
            die("Cell hasn't been updated");
        }

        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$table}
            WHERE id = '%d'",
            $id
        ), ARRAY_A);

        foreach ($row as $fieldKey => $field) {
            $row[$fieldKey] = stripslashes($field);
        }

        echo json_encode($row);
        die();
    }
}

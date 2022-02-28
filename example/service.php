<?php

pcntl_async_signals(true);

$name = $argv[1] ?? 'default';
$iterations = $argv[2] ?? 100;

$counter = 0;
$is_force_shutdown = false;

pcntl_signal(SIGINT, function () use (&$is_force_shutdown) {
    echo "Stopping task\n";
    $is_force_shutdown = true;
});

while (true) {
    $counter += 1;
    echo "[$name]: Loop ${counter}\n";

    if ($counter >= $iterations || $is_force_shutdown) {
        break;
    }

    sleep(5);
}

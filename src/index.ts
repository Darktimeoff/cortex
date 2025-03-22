import Express from "./cortex";

const express = new Express();

express.listen(3000, () => {
    console.log('http://localhost:3000');
});
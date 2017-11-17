### parity-web3-sample-repo

Parity Dev chain hello world sample /w web3 v1 beta

Download latest parity stable (e.g. 1.7.9-stable - )

    parity --chain dev --unlock $(parity --chain dev account list | paste -s -d, /dev/stdin) --password ./pass.txt


Install node deps (web3)

    npm i


Run the main file

    try_parity.js

It will output some stuff...

..take a look at the code and at the program output

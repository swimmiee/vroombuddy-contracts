# Vroombuddy-Contracts

## Frontend Repo
https://github.com/Learning-N-Running/vroombuddy

## Installation
```
npm i
```

## Test on localhost
```
npx hardhat node
```

then, open a new terminal and run:
```
npx hardhat ignition deploy ./ignition/modules/Vroombuddy.ts --network localhost
```

If you want to re-run node, delete `ignition/deployments/chain-31337`   
Make sure chainId 31337 is for localhost

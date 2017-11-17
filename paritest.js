#! /usr/bin/env node

const c = console
const fs = require("fs")

const Web3 = require('web3')
const {promisify} = require('util')

const web3 = new Web3('ws://localhost:8546') // ws are faster
// const web3 = new Web3('http://localhost:8545') // standard http json rpc

const eth = web3.eth
const toHex       = web3.utils.toHex
const hexToString = web3.utils.hexToString

const interf = require("./interface.json")
const bytecode = fs.readFileSync("./bytecode.txt").toString().trim()


const main = async () => {

  const accounts = await eth.getAccounts()
  account = accounts[0]
  c.log("Account:", account)

  const balance = await eth.getBalance(account)
  c.log("Balance:", balance)

  const abi = interf.output.abi
  c.log("abi:", abi)
  c.log("bytecode:", bytecode)

  const MyContractClassDep = new eth.Contract(abi, { from: account, data: bytecode }) // contract class (just for deployment)

  const MyCtrDeploy = MyContractClassDep.deploy().send

  // const gasEst = await MyCtrEstimateGas()
  // c.log("Gas estimation:", gasEst) // 1270000

  const deployment = await MyCtrDeploy({
      from: account,
      gas: 1000000,
  })
  const ctrAddress = deployment._address
  // store this address ....


  // then at a later stage

  const myContractInstanceRoot = new eth.Contract(abi, ctrAddress, { from: account }) // contract class

  const myContractInstance = myContractInstanceRoot.methods

  const rand = Math.floor(Math.random() * 10000)
  const string = toHex(`test-${rand}`)
  const receipt = await myContractInstance.set(string).send()

  c.log("TX receipt / details:", receipt)

  const value = await myContractInstance.data().call()
  c.log("Value:", hexToString(value))

}

main()
  .catch((err) => {
    c.error(err)
  })

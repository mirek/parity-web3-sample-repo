#! /usr/bin/env node

const c = console
const fs = require("fs")
const ___ = "---------------------------------------------------"

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
  c.log(___)

  const abi = interf.output.abi

  // uncomment for abi/bytecode details:
  //
  // c.log("abi:", abi)
  // c.log("bytecode:", bytecode)
  // c.log(___)

  const MyContractClassDep = new eth.Contract(abi, { from: account, data: bytecode }) // contract class (just for deployment)
  const MyCtrDeploy = MyContractClassDep.deploy().send

  // optional gas estimation (very useful for public chain)
  // const gasEst = await MyCtrEstimateGas()
  // c.log("Gas estimation:", gasEst)

  const deployment = await MyCtrDeploy({
      from: account,
      gas: 1000000,
  })
  const ctrAddress = deployment._address
  // store this address ....


  // then call the contract instance (ideally you want to save the address and run just the code below at a later stage...)

  const myContractInstanceRoot = new eth.Contract(abi, ctrAddress, { from: account }) // contract class
  const myContractInstance = myContractInstanceRoot.methods

  const rand = Math.floor(Math.random() * 10000)
  const string = toHex(`test-${rand}`)

  // calling the "setter" method - this will trigger a blockchain transaction
  const receipt = await myContractInstance.set(string).send()

  c.log("TX receipt / details:", receipt)
  c.log(___)

  // calling the "getter" method (public data property on the contract side)
  const value = await myContractInstance.data().call()
  c.log("Value:", hexToString(value))

}

main()
  .catch((err) => {
    c.error(err)
  })

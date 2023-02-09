const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Web3 = require('web3')
const math = require('mathjs');

require('dotenv').config()

const P =  process.env.PRIVATE_KEYS.split(",") 

// Telegram bot API KEY - comment out if not using bot
const botAPI = process.env.TELEGRAM_BOT

//Chat_ID - comment out if not using bot
const botChat = process.env.CHAT_ID

//Comment out this function if you do not wish to use a Telegram bot to give you updates. - search in code and replace other sendMessage function calls if you are not using TG bot
async function sendMessage(chatId, message) {
        axios.get(encodeURI('https://api.telegram.org/bot' + botAPI + '/sendMessage?chat_id=' + botChat + '&text=' + message + '&parse_mode=HTML')).then(response => {
}).catch(error => {
        console.log(error);
        });
}

//WEB3 Config
const web3 = new Web3(process.env.RPC_URL)
//rechecks every 10ins. Adjust accordingly in Milliseconds
const POLLING_INTERVAL = 600000 // 10 mins in milliseconds;
let i = 0

function shortId(str, size) {
        return str.substr(0, 6) + '...' + str.substr(36,42);
}

console.log("FURIO AUTO CLAIM-SELL, FURIO sucks donkey dick \n")

console.log(`Polling time: ${POLLING_INTERVAL / 60000} minutes`)

//SMART CONTRACT ABI
const furioABI = [
{
        "anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from_","type":"address"},{"indexed":false,"internalType":"address","name":"to_","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"AirdropSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"particpant_","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"Bonus","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"participant_","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"participant_","type":"address"}],"name":"Complete","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"participant_","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"Compound","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"participant_","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"participant_","type":"address"}],"name":"Maxed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"participant_","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"Tax","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"recipient_","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"TokensSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"addressBook","outputs":[{"internalType":"contract IAddressBook","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"},{"internalType":"address","name":"referrer_","type":"address"}],"name":"adminUpdateReferrer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to_","type":"address"},{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"airdrop","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount_","type":"uint256"},{"internalType":"uint256","name":"minBalance_","type":"uint256"},{"internalType":"uint256","name":"maxBalance_","type":"uint256"}],"name":"airdropTeam","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"autoCompound","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"availableRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"banParticipant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"claimPrecheck","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"compound","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity_","type":"uint256"},{"internalType":"address","name":"referrer_","type":"address"}],"name":"deposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity_","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"},{"internalType":"uint256","name":"quantity_","type":"uint256"}],"name":"depositFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"},{"internalType":"uint256","name":"quantity_","type":"uint256"},{"internalType":"address","name":"referrer_","type":"address"}],"name":"depositFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"getParticipant","outputs":[{"components":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"deposited","type":"uint256"},{"internalType":"uint256","name":"compounded","type":"uint256"},{"internalType":"uint256","name":"claimed","type":"uint256"},{"internalType":"uint256","name":"taxed","type":"uint256"},{"internalType":"uint256","name":"awarded","type":"uint256"},{"internalType":"bool","name":"negative","type":"bool"},{"internalType":"bool","name":"penalized","type":"bool"},{"internalType":"bool","name":"maxed","type":"bool"},{"internalType":"bool","name":"banned","type":"bool"},{"internalType":"bool","name":"teamWallet","type":"bool"},{"internalType":"bool","name":"complete","type":"bool"},{"internalType":"uint256","name":"maxedRate","type":"uint256"},{"internalType":"uint256","name":"availableRewards","type":"uint256"},{"internalType":"uint256","name":"lastRewardUpdate","type":"uint256"},{"internalType":"uint256","name":"directReferrals","type":"uint256"},{"internalType":"uint256","name":"airdropSent","type":"uint256"},{"internalType":"uint256","name":"airdropReceived","type":"uint256"}],"internalType":"struct Vault.Participant","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProperties","outputs":[{"components":[{"internalType":"uint256","name":"period","type":"uint256"},{"internalType":"uint256","name":"lookbackPeriods","type":"uint256"},{"internalType":"uint256","name":"penaltyLookbackPeriods","type":"uint256"},{"internalType":"uint256","name":"maxPayout","type":"uint256"},{"internalType":"uint256","name":"maxReturn","type":"uint256"},{"internalType":"uint256","name":"neutralClaims","type":"uint256"},{"internalType":"uint256","name":"negativeClaims","type":"uint256"},{"internalType":"uint256","name":"penaltyClaims","type":"uint256"},{"internalType":"uint256","name":"depositTax","type":"uint256"},{"internalType":"uint256","name":"depositReferralBonus","type":"uint256"},{"internalType":"uint256","name":"compoundTax","type":"uint256"},{"internalType":"uint256","name":"compoundReferralBonus","type":"uint256"},{"internalType":"uint256","name":"airdropTax","type":"uint256"},{"internalType":"uint256","name":"claimTax","type":"uint256"},{"internalType":"uint256","name":"maxReferralDepth","type":"uint256"},{"internalType":"uint256","name":"teamWalletRequirement","type":"uint256"},{"internalType":"uint256","name":"teamWalletChildBonus","type":"uint256"},{"internalType":"bool","name":"devWalletReceivesBonuses","type":"bool"}],"internalType":"struct Vault.Properties","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"getReferrals","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStats","outputs":[{"components":[{"internalType":"uint256","name":"totalParticipants","type":"uint256"},{"internalType":"uint256","name":"totalDeposits","type":"uint256"},{"internalType":"uint256","name":"totalDeposited","type":"uint256"},{"internalType":"uint256","name":"totalCompounds","type":"uint256"},{"internalType":"uint256","name":"totalCompounded","type":"uint256"},{"internalType":"uint256","name":"totalClaims","type":"uint256"},{"internalType":"uint256","name":"totalClaimed","type":"uint256"},{"internalType":"uint256","name":"totalTaxed","type":"uint256"},{"internalType":"uint256","name":"totalTaxes","type":"uint256"},{"internalType":"uint256","name":"totalAirdropped","type":"uint256"},{"internalType":"uint256","name":"totalAirdrops","type":"uint256"},{"internalType":"uint256","name":"totalBonused","type":"uint256"},{"internalType":"uint256","name":"totalBonuses","type":"uint256"}],"internalType":"struct Vault.Stats","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"maxPayout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"participantBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"participantMaxed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"participantStatus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"remainingPayout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"address_","type":"address"}],"name":"setAddressBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"unbanParticipant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function","name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"
        },
]

const swapABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"addressBook","outputs":[{"internalType":"contract IAddressBook","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"payment_","type":"address"},{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"payment_","type":"address"},{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"buyOutput","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cooldownPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"payment_","type":"address"},{"internalType":"uint256","name":"amount_","type":"uint256"},{"internalType":"address","name":"referrer_","type":"address"}],"name":"depositBuy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"payment_","type":"address"},{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"depositBuy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"disableLiquidtyManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableLiquidityManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"},{"internalType":"bool","name":"value_","type":"bool"}],"name":"exemptFromCooldown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"contract IUniswapV2Factory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fur","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"liquidityManager","outputs":[{"internalType":"contract ILiquidityManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"liquidityManagerEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant_","type":"address"}],"name":"onCooldown","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"contract IUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pumpAndDumpMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pumpAndDumpRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"sell","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"sellOutput","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"address_","type":"address"}],"name":"setAddressBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sweepDust","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"taxHandler","outputs":[{"internalType":"contract ITaxHandler","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"usdc","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"contract IVault","name":"","type":"address"}],"stateMutability":"view","type":"function"}]


const IERC20ABI = [
{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "_owner","type": "address"},{"indexed": true,"internalType": "address","name": "_spender","type": "address"},{"indexed": false,"internalType": "uint256","name": "_value","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "_from","type": "address"},{"indexed": true,"internalType": "address","name": "_to","type": "address"},{"indexed": false,"internalType": "uint256","name": "_value","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address","name": "_owner","type": "address"},{"internalType": "address","name": "_spender","type": "address"}],"name": "allowance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_spender","type": "address"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "approve","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_account","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_recipient","type": "address"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "transfer","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_sender","type": "address"},{"internalType": "address","name": "_recipient","type": "address"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "transferFrom","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"}
]


//Contract address
const Furio_Contract="0x4de2b5d4a343ddfbeef976b3ed34737440385071"
const Swap_Contract ="0xba8c06be90fa46d634515716eae4ffc3a8bfc4cd"
const tokenAddress = "0x48378891d6E459ca9a56B88b406E8F4eAB2e39bF"

//Contract objects
const contract = new web3.eth.Contract(furioABI, Furio_Contract);
const swapContract = new web3.eth.Contract(swapABI, Swap_Contract);
const approveContract = new web3.eth.Contract(IERC20ABI, tokenAddress);

var gasPrice = 2000000000;
// Loop through private keys
P.forEach(element => {
                        let currently_compounding = false
                        let currently_approved= false
      var wallet = web3.eth.accounts.wallet.add(P[i]);

                                //              console.log(wallet);
                                async function checkRollAvailability(){
        var cooldown = await swapContract.methods.onCooldown(wallet.address).call()
                                        if(currently_compounding) return
                                                try {
//                                              console.log("[*] On cooldown :", cooldown)
                                                if (cooldown){
            console.log("[*] On cooldown!");
            } else{

                                                        claimer()
             // }
                                                } catch (err){
                                                        console.log(`Didn't sell/claim/approve any Furio (${err.message}, ${shortId(wallet.address)})`)
//                                                              return
                                                }
                                }

                        async function claimer(){
                                try{
          const participantBalance = await contract.methods.participantBalance(wallet.address).call()
          const rewardRate = await contract.methods.rewardRate(wallet.address).call()
          const availableRewards = await contract.methods.availableRewards(wallet.address).call()
          var balance = await approveContract.methods.balanceOf(wallet.address).call() 
          //          var gasPrice = await web3.eth.getGasPrice() 
          var block = await web3.eth.getBlock("latest")
          var gasLimit = math.floor(block.gasLimit/block.transactions.length);
          var dailySum = (( participantBalance *rewardRate)/10000)-1e16



                                        // compound daily rate of rewards for once daily
                                        if (availableRewards >= dailySum) {
            setTimeout(() => {  console.log("Starting Claimer ..."); }, 5000);

                                                        // console.log("availableRewards are larger or equal to dailySum")
                                                        console.log(`Claim: ${web3.utils.fromWei(availableRewards.toString(),'ether')} FUR!, ${shortId(wallet.address)}`)
                                                        const claim = await contract.methods.claim().send(
                                                                        {
                from: wallet.address,
                gas: gasLimit,
                gasPrice: gasPrice
                }
                );
                                                        console.log(`Claim status: ${claim.status}, ${shortId(wallet.address)}`);
              sendMessage(botChat, `Claim: ${claim.status}, ${shortId(wallet.address)}, ${web3.utils.fromWei(balance)} FUR`); // only use if using your own telegram bot
                                                        currently_compounding = true;
                                                        // console.log(`gas Price: ${gasPrice}`)
              seller()
          }



        } catch (err){
          currently_compounding = false;
          console.log(`Claim error ${err.message}, ${shortId(wallet.address)}`)
            return
        }
        currently_compounding = false
      }
      //selling function                                                                                                                    
      async function seller(){                            
       //var gasPrice = await web3.eth.getGasPrice() ;        
        var block = await web3.eth.getBlock("latest");                                                                                      
        var gasLimit = math.floor(block.gasLimit/block.transactions.length);
        var balance = await approveContract.methods.balanceOf(wallet.address).call(); 
//        console.log("GasPrice: ", gasPrice);                                                                                                
//        console.log("GasLimit: ", gasLimit);                     
                                                                      
        try {                            
          console.log(`Checking balance: ${shortId(wallet.address)}, ${web3.utils.fromWei(balance)}`);
//          await sleep(10000);                                                                                                             
                                                                      
          if (balance >= 100e18) {
            setTimeout(() => {  console.log("Starting Seller ..."); }, 5000);
            balance = web3.utils.hexToNumberString(100e18);
                                                                      
            const sell = await swapContract.methods.sell(balance).send(
                {        
                from: wallet.address,                                                                                                       
                gas: gasLimit,
                gasprice: gasPrice
                }                           
                );
            console.log(`Sell status: ${sell.status}, ${shortId(wallet.address)}, ${web3.utils.fromWei(balance)} FUR`);
            sendMessage(botChat, `FURIO Sell: ${sell.status}, ${shortId(wallet.address)}, ${web3.utils.fromWei(balance)} FUR`); // only use if using your own telegram bot

            currently_compounding = true;

            } else  {
              if (balance > 1e18) {
                console.log("Starting Seller");
                const sell = await swapContract.methods.sell(balance).send(
                    {
                from: wallet.address, 
                gas: gasLimit,
                gasprice: gasPrice
                }
                );
                console.log(`Sell status: ${sell.status}, ${shortId(wallet.address)}, ${web3.utils.fromWei(balance)} FUR`);
                sendMessage(botChat, `FURIO Sell: ${sell.status}, ${shortId(wallet.address)}, ${web3.utils.fromWei(balance)} FUR`); // only use if using your own telegram bot
                currently_compounding = true;
                }
            }
        } catch (err){
          console.log(`Failed sell  ${err.message}, ${balance}, ${shortId(wallet.address)}`);
          //      console.log(`Failed sell  ${err.status} `);
        }
      }
      //approve function  - only necessary if you haven't pre approved, which I recommend as it saves gas and you can approve more than 1 sells worth of FUR
/*      async function approve() {

//        var gasPrice = await web3.eth.getGasPrice()  ;
        var gasPrice = 4000000000;
        var block = await web3.eth.getBlock("latest");
        var gasLimit = math.floor(block.gasLimit/block.transactions.length);
        const balance = await approveContract.methods.balanceOf(wallet.address).call(); 

        try {
                                        console.log(`Checking balance: ${shortId(wallet.address)}, ${web3.utils.fromWei(balance)}`);
                                        if (balance >= 1e18) {

                                                var cooldown = await swapContract.methods.onCooldown(wallet.address).call();
                                                console.log("[*] On cooldown :", cooldown);
                                                if (cooldown){
                                                        console.log("[*] Come back later pleb");
                                                } else {
                                                        console.log("Start Approval");
                                                        const approve = await approveContract.methods.approve(Swap_Contract, balance).send(
                                                                        {
                                                                                from: wallet.address, 
                                            gas: gasLimit,
                                            gasprice: gasPrice
                                                                        }
                              )

                                                        setTimeout(() => 10000);
                                                        seller();
                                                }
                                        }
  } catch (err){
  //                                    console.log(`Failed sell  ${err.status}, ${err.message}, ${balance}, ${shortId(wallet.address)}`);
  console.log(`Failed approve ${err.message} `);
  }
}
*/

  checkRollAvailability()
setInterval(async () => { await checkRollAvailability() }, POLLING_INTERVAL)
  i++
  });

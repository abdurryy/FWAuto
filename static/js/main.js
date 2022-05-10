const dapp = "FWAuto";
const endpoint = "chain.wax.io";
const chainId = "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4";
let ongoingtransaction = false; 
const url = "http://192.168.1.72"


async function autoLogin() {
    var isAutoLoginAvailable = await wallet_isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
        login()
    }
}

async function selectWallet(walletType) {
    wallet_selectWallet(walletType);
    login()
}

async function login() {
    try {
        const userAccount = await wallet_login();  
        t = await fetch(url+"/api/check_authorization/"+userAccount, 
        {method: "post"})
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            console.log(jsonResponse)
            if (jsonResponse["state"]=="success"){
                document.getElementById("login-container").style.display="none";
                document.getElementById("welcome-sign").style.display="none";
                document.getElementById("wallet").innerHTML=userAccount;
                document.getElementById("farm-panels").style.display="flex";
                document.getElementById("lfirst").style.display="block";
                document.getElementById("account-information").style.display="flex";
                document.getElementById("subscription").innerHTML="Last Invoice: <strong>"+jsonResponse["ts"]+"</strong>";
                document.getElementById("subscription2").innerHTML="Next Invoice: <strong>"+jsonResponse["ts2"]+"</strong>";
                document.getElementById("referral").innerHTML="Invite Friends: <strong>https://fw-auto.xyz/"+userAccount+"</strong>";
                get_configs()
            }else{
                if (jsonResponse["state"]=="invoice"){
                    alert("You have to pay the monthly invoice for continuous usage.")
                }
                document.getElementById("welcome-sign").style.display="none";
                document.getElementById("login-container").style.display="none";
                document.getElementById("buy-container").style.display="flex";
            }
        })
        
        
        loggedIn = true;
    } catch (e) {
        //
    }
}



function showLoginOptions() {
    y = document.getElementById("login-alternatives")
    x = window.getComputedStyle(y).getPropertyValue('display')
    console.log(x)
    if (x == "block"){
        //
    }else{
        y.style.display = "block";
    }
}

const wax = new waxjs.WaxJS("https://" + endpoint, null, null, false);
const anchorTransport = new AnchorLinkBrowserTransport;
const anchorLink = new AnchorLink({
    transport: anchorTransport,
    verifyProofs: true,
    chains: [{
        chainId: chainId,
        nodeUrl: "https://" + endpoint
    }]
});
async function wallet_isAutoLoginAvailable() {
    var sessionList = await anchorLink.listSessions(dapp);
    if (sessionList && sessionList.length > 0) {
        useAnchor = true;
        return true
    } else {
        useAnchor = false;
        return await wax.isAutoLoginAvailable()
    }
}

async function wallet_selectWallet(walletType) {
    useAnchor = walletType == "anchor"
}

let prev_e = ""

async function claim(asset_id) {
    if (loggedIn) {
        try {
            const result = await wallet_transact([{
                account: "farmersworld",
                name: "claim",
                authorization: [{
                    actor: wallet_userAccount,
                    permission: "active"
                }],
                data: {
                    owner: wallet_userAccount,
                    asset_id: asset_id,
                }
            }]);
            await appendAction("CLAIM", asset_id)
            ongoingtransaction = false;
        } catch (e) {
            console.log(e.message)
            if (prev_e != e){
                prev_e = e
                return "success"
            }else{
                return "failure"
            }
        }
    } else {
        ongoingtransaction = false;
        WalletListVisible(true)
    }
}

async function appendAction(x, y){
    ts = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    
    document.getElementById("logs").innerHTML += `<div class="log-item">ACTION | ${x} | ${y} | ${ts}</div>`;
}

async function cropclaim(asset_id) {
    if (loggedIn) {
        try {
            const result = await wallet_transact([{
                account: "farmersworld",
                name: "cropclaim",
                authorization: [{
                    actor: wallet_userAccount,
                    permission: "active"
                }],
                data: {
                    owner: wallet_userAccount,
                    crop_id: asset_id,
                }
            }]);
            await appendAction("CLAIM", asset_id)
            ongoingtransaction = false;
        } catch (e) {
            console.log(e.message)
            if (prev_e != e){
                prev_e = e
                return "success"
            }else{
                return "failure"
            }
        }
    } else {
        ongoingtransaction = false;
        WalletListVisible(true)
    }
}

async function withdraw(x) {
    if (loggedIn) {
        try {
            const result = await wallet_transact([{
                account: "farmersworld",
                name: "withdraw",
                authorization: [{
                    actor: wallet_userAccount,
                    permission: "active"
                }],
                data: {
                    owner: wallet_userAccount,
                    quantities: x,
                    fee: 5,
                }
            }]);
            ongoingtransaction = false;
            await appendAction("WITHDRAW", x)
        } catch (e) {
            console.log(e.message)
            if (prev_e != e){
                prev_e = e
                return "success"
            }else{
                return "failure"
            }
        }
    } else {
        ongoingtransaction = false;
        WalletListVisible(true)
    }
}

async function repair(asset_id) {
    if (loggedIn) {
        try {
            const result = await wallet_transact([{
                account: "farmersworld",
                name: "repair",
                authorization: [{
                    actor: wallet_userAccount,
                    permission: "active"
                }],
                data: {
                    asset_owner: wallet_userAccount,
                    asset_id: asset_id,
                }
            }]);
            await appendAction("REPAIR", asset_id)

            ongoingtransaction = false;
        } catch (e) {
            console.log(e.message)
            if (prev_e != e){
                prev_e = e
                return "success"
            }else{
                return "failure"
            }
        }
    } else {
        ongoingtransaction = false;
        WalletListVisible(true)
    }
}
async function mbsclaim(asset_id) {
    if (loggedIn) {
        try {
            const result = await wallet_transact([{
                account: "farmersworld",
                name: "mbsclaim",
                authorization: [{
                    actor: wallet_userAccount,
                    permission: "active"
                }],
                data: {
                    owner: wallet_userAccount,
                    asset_id: asset_id,
                }
            }]);
            await appendAction("CLAIM", asset_id)
            ongoingtransaction = false;
        } catch (e) {
            console.log(e.message)
            if (prev_e != e){
                prev_e = e
                return "success"
            }else{
                return "failure"
            }
        }
    } else {
        ongoingtransaction = false;
        WalletListVisible(true)
    }
}

const useAnchor = false;

async function recover(energy_recovered) {
    if (loggedIn) {
        try {
            const result = await wallet_transact([{
                account: "farmersworld",
                name: "recover",
                authorization: [{
                    actor: wallet_userAccount,
                    permission: "active"
                }],
                data: {
                    owner: wallet_userAccount,
                    energy_recovered: energy_recovered,
                }
            }]);
            await appendAction("RECOVER", energy_recovered)
            ongoingtransaction = false;
        } catch (e) {
            console.log(e.message)
            if (prev_e != e){
                prev_e = e
                return "success"
            }else{
                return "failure"
            }
        }
    } else {
        ongoingtransaction = false;
        WalletListVisible(true)
    }
}


async function wallet_login() {
    wallet_userAccount = await wax.login();
    wallet_session = wax.api
    return wallet_userAccount
}

async function wallet_transact(actions) {
    if (useAnchor) {
        var result = await wallet_session.transact({
            actions: actions
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
        result = {
            transaction_id: result.processed.id
        }
    } else {
        var result = await wallet_session.transact({
            actions: actions
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        })
    }
    return result
}



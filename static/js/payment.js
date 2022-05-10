async function buy_authorize() {
    if (loggedIn) {
        try {
            const result = await wallet_transact([{
                account: "eosio.token",
                name: "transfer",
                authorization: [{
                    actor: wallet_userAccount,
                    permission: "active"
                }],
                data: {
                    from: wallet_userAccount,
                    to: "bvrlm.c.wam",
                    quantity:"15.00000000 WAX",
                    memo:"FWAuto | INVOICE | "+(Date.now()).toString()
                }
            }]);
            popup("Alert", "Wait a bit, please.")
            
            ts = await fetch(url+"/api/authorize_wallet/"+wallet_userAccount+"/"+result.transaction_id, 
            {method: "post"})
            .then(function(response) {
                return response.json();
            })
            .then(async function(jsonResponse) {
                if (jsonResponse["state"]=="success"){
                    popup("Success", "You've paid off the access fee, refresh to gain entry.<br> <br>https://wax.bloks.io/transaction/"+result.transaction_id)
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    window.location.reload()
                }else{
                    alert("Failure", "You've paid off the access fee, but something went wrong with the API.<br> <br>join our discord: hhttps://discord.gg/FkxHJRHg4q <br> <br>https://wax.bloks.io/transaction/"+result.transaction_id + "Something went wrong. If you're sure you did all good, ")
                }
            })
            ts

        } catch (e) {
            console.log(e)
        }
    } else {
        ongoingtransaction = false;
        WalletListVisible(true)
    }
}

let a = []
let x = 5;
let m = ""
let s = false

function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

async function bot() {
    await wait(5000);
    await fetch(url + "/api/assets_wallet/" + wallet_userAccount, {
            method: "post",mode: 'no-cors'
        })
        .then(async function(response, m) {
            if (response.ok){
                m = "Assets | Fetching Response"
                document.getElementById("assetsp").innerHTML = m;
                return response.json();
            }else{
                m = "Assets | 500 Internal Issue"
                document.getElementById("assetsp").innerHTML = m;
                await wait(5000);
                m = "Assets | Sending Request"
                document.getElementById("assetsp").innerHTML = m;
                return await bot();
            }
        })
        .then(await async function(jsonResponse, m) {
                  try{
                    assets.innerHTML = ""
                    document.getElementById("logs").innerHTML = ""
                    if (jsonResponse["state"] == "success") {
                        if (jsonResponse["data"][1] == 'UNPAID INVOICE') {
                            m = "Assets | You have an unpaid invoice."
                            document.getElementById("assetsp").innerHTML = m;
                            await new Promise(resolve => setTimeout(resolve, 20000000000));
                            return;
                        }
                        if (jsonResponse["data"][7] == 'Failed') {
                            m = "Assets | An issue encountered."
                            document.getElementById("assetsp").innerHTML = m;
                            await wait(10000);
                            return await bot();
                        }


                energy = jsonResponse["data"][2][0]["energy"]
                max_energy = jsonResponse["data"][2][0]["max_energy"]
                diff = Math.round((energy/max_energy)*100,2)
                let energys = document.getElementById("energy")
                diff2 = Number((energys.value).replace("%",""))
                
            
                if (diff < diff2){
                    m = "Assets | Recovering Energy"
                    document.getElementById("assetsp").innerHTML = m;
                   diff = max_energy - energy
                   await wait(5000);
                   g = await recover(diff)
                   //för alla
                   if (g == "failure"){
                        m = "Assets | An issue encountered."
                        document.getElementById("assetsp").innerHTML = m;
                        await wait(10000);
                        return await bot();
                    }
                }


                    for (i=0; i < jsonResponse["data"][0].length; i++){
                    dif = Math.round(((jsonResponse["data"][0][i]["durability"]/jsonResponse["data"][0][i]["max_durability"])*100),2)
                    let repairs = document.getElementById("repair")
                    diff1 = Number((repairs.value).replace("%",""))
                    if (dif < diff1){
                        m = "Repairing Assets"
                        document.getElementById("assetsp").innerHTML = m;
                        await wait(5000);
                        g = await repair(jsonResponse["data"][0][i]["asset_id"])
                        if (g == "failure"){
                            m = "Assets | An issue encountered."
                            document.getElementById("assetsp").innerHTML = m;
                            await wait(10000);
                            return await bot();
                        }
                    }
                    if (jsonResponse["data"][0][i]["type"] == "Food"){

                        assets.innerHTML += '<div class="farm-item">' +jsonResponse["data"][0][i]["name"]+ " | "+ Math.round(((jsonResponse["data"][0][i]["durability"]/jsonResponse["data"][0][i]["max_durability"])*100),2)+"%"+'</div>'
                        appendAction("Asset Loaded", jsonResponse["data"][0][i]["name"])
                    }else if (jsonResponse["data"][0][i]["type"] == "Wood"){
                        assets.innerHTML += '<div class="farm-item">' +jsonResponse["data"][0][i]["name"]+ " | "+ Math.round(((jsonResponse["data"][0][i]["durability"]/jsonResponse["data"][0][i]["max_durability"])*100),2)+"%"+'</div>'
                    }else if (jsonResponse["data"][0][i]["type"] == "Gold"){
                        assets.innerHTML += '<div class="farm-item">' +jsonResponse["data"][0][i]["name"]+ " | "+ Math.round(((jsonResponse["data"][0][i]["durability"]/jsonResponse["data"][0][i]["max_durability"])*100),2)+"%"+'</div>'
                    }
                    m
                    
                    appendAction("Asset Loaded", jsonResponse["data"][0][i]["name"])
                }
    
                        for (i = 0; i < jsonResponse["data"][3].length; i++) {
                            m = "Assets | Claiming Assets"
                            document.getElementById("assetsp").innerHTML = m;
                            asset_id = jsonResponse["data"][3][i]
                            await wait(5000);
                            g = await claim(asset_id)
                            if (g == "failure"){
                                m = "Assets | An issue encountered."
                                document.getElementById("assetsp").innerHTML = m;
                                await wait(10000);
                                return await bot();
                            }
                        }

                        for (i = 0; i < jsonResponse["data"][4].length; i++) {
                            m = "Assets | Claiming Assets"
                            document.getElementById("assetsp").innerHTML = m;
                            asset_id = jsonResponse["data"][4][i]
                            await wait(5000);
                            g = await mbsclaim(asset_id)
                            if (g == "failure"){
                                m = "Assets | An issue encountered."
                                document.getElementById("assetsp").innerHTML = m;
                                await wait(10000);
                                return await bot();
                            }
                        }

                        

                        for (i = 0; i < jsonResponse["data"][1].length; i++) {
                            m = "Assets | Loading Assets"
                            document.getElementById("assetsp").innerHTML = m;
                            if (jsonResponse["data"][1][i]["type"] == "Food") {
                                assets.innerHTML += '<div class="farm-item"> Food ' + jsonResponse["data"][1][i]["name"] + 'ship</div>'
                            } else if (jsonResponse["data"][1][i]["type"] == "Wood") {
                                assets.innerHTML += '<div class="farm-item"> Wood ' + jsonResponse["data"][1][i]["name"] + 'ship</div>'
                            } else if (jsonResponse["data"][1][i]["type"] == "Gold") {
                                assets.innerHTML += '<div class="farm-item"> Gold ' + jsonResponse["data"][1][i]["name"] + 'ship</div>'
                            }
                            appendAction("Asset Loaded", jsonResponse["data"][1][i]["name"])
                        }
                        m = "Assets | Loaded Assets"
                        document.getElementById("assetsp").innerHTML = m;

                    

                        c_fww = document.getElementById("fww")
                        c_fww = Number((c_fww.value).replace(" FWW", ""))
                        c_fwf = document.getElementById("fwf")
                        c_fwf = Number((c_fwf.value).replace(" FWF", ""))
                        c_fwg = document.getElementById("fwg")
                        c_fwg = Number((c_fwg.value).replace(" FWG", ""))
                        a = []
                        t = false


                        if (jsonResponse["data"][5][0] == 5) {
                            console.log(c_fww, c_fwg, c_fwf)
                            if (c_fww > 0 && jsonResponse["data"][2][0]["wood"] > c_fww) {

                                t = true
                                d = await dec(c_fww, "WOOD")
                                console.log(a)
                            }
                            if (c_fwf > 0 && jsonResponse["data"][2][0]["food"] > c_fwf) {
                                t = true
                                d = await dec(c_fwf, "FOOD")
                                console.log(a)
                            }
                            if (c_fwg > 0 && jsonResponse["data"][2][0]["gold"] > c_fwg) {
                                t = true
                                d = await dec(c_fwg, "GOLD")
                                console.log(a)
                            }
                        }

                        if (t == true) {
                            m = "Assets | Selling Resouces"
                            document.getElementById("assetsp").innerHTML = m;
                            await wait(5000);
                            g = await withdraw(a)
                            if (g == "failure"){
                                m = "Assets | An issue encountered."
                                document.getElementById("assetsp").innerHTML = m;
                                await wait(10000);
                                return await bot();
                            }
                        }
                        m = "Assets | Finished Request"
                        document.getElementById("assetsp").innerHTML = m;
                        x = 5;
                        try {
                            r = Math.ceil(jsonResponse["data"][6])
                            if (r < 0) {
                                r = 2;
                            }
                            g = false
                            timer = setInterval(async function() {
                                if (g == false) {
                                    r -= 1
                                    m = "Assets | Next Action(s): " + r + ' second(s)'
                                    document.getElementById("assetsp").innerHTML = m;
                                    s = true
                                    if (r < 1) {
                                        g = true
                                        m = "Assets | Sending request"
                                        document.getElementById("assetsp").innerHTML = m;
                                        clearInterval(timer);
                                        return await bot();
                                    }
                                }

                            }, 1000)

                            await new Promise(resolve => setTimeout(resolve, Math.ceil(jsonResponse["data"][6])));

                        } catch (e) {
                            console.log(e)
                        }

                    } else {
                        console.log("Something went wrong. You may want to retry, if the issue still occurs join our discord: https://discord.gg/FkxHJRHg4q")
                    }
                    x = 5;
                  }catch(e){
                    return;
                  }
                    
                    
                }
            )
        }

    async function dec(obj, t) {
        s = (obj.toFixed(4)).toString() + " " + t
        a.push(s)
    }

    async function check_configs() {
        const repair = document.getElementById("repair")
        const energy = document.getElementById("energy")
        const fww = document.getElementById("fww")
        const fwf = document.getElementById("fwf")
        const fwg = document.getElementById("fwg")
        li = ""
        console.log((repair.value).indexOf("%"))
        if ((repair.value).indexOf("%") == -1) {
            li += "<li>Forgotten % in repair field.</li>"
        }

        if ((energy.value).indexOf("%") == -1) {
            li += "<li>Forgotten % in energy field.</li>"
        }



        if ((fww.value).indexOf("FWW") == -1) {
            li += "<li>Forgotten FWW in FWW field.</li>"
        }


        if ((fwg.value).indexOf("FWG") == -1) {
            li += "<li>Forgotten FWG in FWG field.</li>"
        }


        if ((fwf.value).indexOf("FWF") == -1) {
            li += "<li>Forgotten FWF in FWF field.</li>"
        }

        if (li != "") {
            popup("Alert", "Make sure to not forgot symbols: <br><br>" + li)
            return "fail"
        }
    }

    async function run(obj) {
        const assets = document.getElementById("assets")


        f = await check_configs()
        if (f == "fail") {
            return "fail"
        }
        obj.style.display = "none";
        document.getElementById("logs").innerHTML = ""

        s = true
        document.getElementById("assetsp").innerHTML = "Assets | Sending Request";
        await bot();
}

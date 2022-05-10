from flask import *
from datetime import datetime
from database import database
from asset import asset_information
import json, requests, time, wget, os
from flask_talisman import Talisman

app = Flask(__name__)

@app.route('/')
def index():
    v = json.load(open("visits.json", "r"))
    v["visits"] = v["visits"]+ 1
    json.dump(v, open("visits.json", "w"))
    jsopen = open("databases/authorized_wallets.json","r")
    data = json.load(jsopen)
    jsopen.close()
    u = 12
    for i in data["authorized_wallets"]:
        print(i)
        u +=1
    return render_template("index.html", users = u, visits = json.load(open("visits.json", "r"))["visits"])

@app.route('/<wallet>')
def fr_index(wallet):
    v = json.load(open("visits.json", "r"))
    v["visits"] = v["visits"]+ 1
    json.dump(v, open("visits.json", "w"))
    jsopen = open("databases/authorized_wallets.json","r")
    data = json.load(jsopen)
    jsopen.close()
    u = 12
    for i in data["authorized_wallets"]:
        print(i)
        u +=1
    return render_template("index.html", users = u, visits = json.load(open("visits.json", "r"))["visits"])

@app.route('/api')
def api():
    return f"Hello World!"

@app.route('/api/authorize_wallet/<wallet>/<transactionid>', methods=["POST"])
def api_authorize(wallet, transactionid):
    if request.method == "POST":
        try:
            time.sleep(5)
            r = check_transaction(wallet, transactionid)
            if r == "Fail":
                return jsonify(state="failed",wallet=wallet, ts=datetime.utcnow().timestamp())
        
            return jsonify(state="success",wallet=wallet, ts=datetime.utcnow().timestamp())
        except Exception as e:
            time.sleep(5)
            check_transaction(wallet, transactionid)
        
    return jsonify(state="failed",wallet=wallet, ts=datetime.utcnow().timestamp())

@app.route('/api/assets_wallet/<r_wallet>', methods=["POST"])
def api_assets(r_wallet):
    if request.method == "POST":
        jsopen = open("databases/authorized_wallets.json","r")
        j = json.load(jsopen)
        for wallet in j["authorized_wallets"]:
            if wallet["wallet"] == r_wallet:
                if datetime.utcnow().timestamp() < wallet["next_invoice"]:
                    s = asset_information.get_items(r_wallet)
                    return jsonify(state="success",data=s)
                else:
                    return jsonify(state="success",data=[[],["UNPAID INVOICE"],[],[],[],[]])
    return jsonify(state="failed")
    

        

def check_transaction(wallet,transactionid):
    #check if transaction already exists
    jsopen = open("databases/authorized_transactions.json","r")
    data = json.load(jsopen)
    jsopen.close()
    for transact in data["authorized_transactions"]:
        if transact["transaction_id"] == transactionid:
            return "Fail"
    time.sleep(10)
    data = {"id":transactionid,"block_num_hint":0}
    r = requests.post("https://wax.greymass.com/v1/history/get_transaction", json=data)
    c_wallet = r.json()["traces"][0]["act"]["data"]["from"]
    amount = r.json()["traces"][0]["act"]["data"]["quantity"]
    rec = r.json()["traces"][0]["act"]["data"]["to"]
    amount = int(float(amount.replace(" WAX", "")))
    if c_wallet == wallet:
        if amount == 15:
            print(rec)
            if rec == "bvrlm.c.wam":
                print("writing")
                database.authorize_wallet(wallet)
                database.authorize_transaction(transactionid)

@app.route('/api/check_authorization/<r_wallet>', methods=["POST"])
def api_check(r_wallet):
    if request.method == "POST":
        jsopen = open("databases/authorized_wallets.json","r")
        j = json.load(jsopen)
        for wallet in j["authorized_wallets"]:
            if wallet["wallet"] == r_wallet:
                ts = datetime.fromtimestamp(wallet["last_invoice"])
                ts3 = datetime.fromtimestamp(wallet["next_invoice"])
                
                
                if ts3.month < 10:
                    month = "0"+str(ts3.month)
                else:
                    month = str(month)
                
                if ts3.day < 10:
                    day = "0"+str(ts3.day)
                else:
                    day = str(ts3.day)

                ts2 = str(day) + "/"+month + "/"+str(ts3.year)

                if ts.month < 10:
                    month = "0"+str(ts.month)
                else:
                    month = str(month)
                
                if ts.day < 10:
                    day = "0"+str(ts.day)
                else:
                    day = str(ts.day)

                ts1 = str(day) + "/"+month + "/"+str(ts.year)

                if datetime.utcnow().timestamp() > ts3.timestamp():
                    return jsonify(state="invoice",wallet=r_wallet, ts=ts1, ts2=ts2)



                return jsonify(state="success",wallet=r_wallet, ts=ts1, ts2=ts2)

    return jsonify(state="failed",wallet=r_wallet, ts=datetime.utcnow().timestamp())
    


"""context = ('/etc/letsencrypt/live/fw-auto.xyz/fullchain.pem', '/etc/letsencrypt/live/fw-auto.xyz/privkey.pem')
Talisman(app, content_security_policy=None)"""
app.run(host="0.0.0.0", port="80")
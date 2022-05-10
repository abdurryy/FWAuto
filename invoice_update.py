import requests, json
from datetime import datetime

j = json.load(open("databases/authorized_wallets.json", "r"))

for i in j["authorized_wallets"]:
    try:
        i["next_invoice"] = i["next_invoice"]
    except: 
        d = datetime.fromtimestamp(i["ts"])
        day = d.day
        
        if (d.month + 1) < 12:
            month = d.month + 1
            year = d.year
        else:
            month = 1
            year = d.year + 1

        i["next_invoice"] = datetime(year, month, day, d.hour, d.minute, d.second, d.microsecond).timestamp()

json.dump(j,open("databases/authorized_wallets.json", "w"), indent = 2)



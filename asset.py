import requests, random,time, wget
from datetime import datetime

class asset_information():
    def get_items(obj):
        s = requests.Session()
        endpoints = ["http://wax.eoseoul.io", "https://api.wax.alohaeos.com", "https://wax.pink.gg"]
        items = [[],[],[],[],[], [], []]
        try:
            data = {"json":True,"code":"farmersworld","scope":"farmersworld","table":"tools","table_key":"","lower_bound":obj,"upper_bound":obj,"index_position":2,"key_type":"i64","limit":100,"reverse":False,"show_payer":False}
            data2 = {"json":True,"code":"farmersworld","scope":"farmersworld","table":"mbs","table_key":"","lower_bound":obj,"upper_bound":obj,"index_position":2,"key_type":"i64","limit":100,"reverse":False,"show_payer":False}
            data3 = {"json":True,"code":"farmersworld","scope":"farmersworld","table":"accounts","table_key":"","lower_bound":obj,"upper_bound":obj,"index_position":1,"key_type":"i64","limit":100,"reverse":False,"show_payer":False}
            data4 = {"json":True,"code":"farmersworld","scope":"farmersworld","table":"config","table_key":"","lower_bound":"","upper_bound":"","index_position":1,"key_type":"","limit":1,"reverse":False,"show_payer":False}
            r = s.post(random.choice(endpoints)+"/v1/chain/get_table_rows", json=data)
            r2 = s.post(random.choice(endpoints)+"/v1/chain/get_table_rows", json=data2)
            r3 = s.post(random.choice(endpoints)+"/v1/chain/get_table_rows", json=data3)
            r4 = s.post(random.choice(endpoints)+"/v1/chain/get_table_rows", json=data4)
            print(obj, 1)
            for i in r.json()["rows"]:
                a = i["asset_id"]
                t = i["type"]
                d = i["current_durability"]
                te = i["template_id"]
                d_max = i["durability"]
                availability = i["next_availability"]
                n = asset_information.get_name(a, s)
                items[0].append({"asset_id": a, "type": t, "durability":d,"max_durability":d_max,"next_availability": availability,"template_id":te, "name": n})
            
            for i in r2.json()["rows"]:
                a = i["asset_id"]
                t = i["type"]
                te = i["template_id"]
                availability = i["next_availability"]
                n = asset_information.get_name(a,s)
                items[1].append({"asset_id": a, "type": t,"template_id":te,"name": n, "next_availability": availability})
            
            wood = 0
            food = 0
            gold = 0

            j1 = r3.json()
            energy = j1["rows"][0]["energy"]
            max_energy = j1["rows"][0]["max_energy"]
            for bal in j1["rows"][0]["balances"]:
                if "WOOD" in bal:
                    wood = float(bal.replace(" WOOD", ""))
                elif "FOOD" in bal:
                    food = float(bal.replace(" FOOD", ""))
                elif "GOLD" in bal:
                    gold = float(bal.replace(" GOLD", ""))
            items[2].append({"energy":energy, "max_energy": max_energy, "wood": wood, "food": food, "gold": gold})
            
            j2 = r4.json()
            fee = j2["rows"][0]["fee"]
            items[5].append(fee)

            return asset_information.get_cooldowns(items)
        except Exception as e:
            print("COULDN'T LOAD ASSETS.", str(e))
            items.append(["Failed"])
            return items
    
    def get_name(a,s):
        p = []
        for proxy in open("proxies.txt", "r").readlines():
            if proxy !="":
                p.append(proxy)

        pro = random.choice(p)
        proxies = {
            "http": "https://"+pro
        }
        
        r = s.get("https://wax.api.atomicassets.io/atomicassets/v1/assets/"+str(a), proxies=proxies, timeout=2)
        try:
            n = r.json()["data"]["template"]["immutable_data"]["name"]
            return n
        except:
            time.sleep(2)
            asset_information.get_name(a,s)
            

    def get_cooldowns(obj):
        food = 0
        wood = 0
        gold = 0
        for membership in obj[1]:
            try:
                if membership["type"] == "Food":
                    if "Gold" in membership["name"]:
                        food +=4
                    elif "Silver" in membership["name"]:
                        food +=2
                    elif "Bronze" in membership["name"]:
                        food +=1
                elif membership["type"] == "Wood":
                    if "Gold" in membership["name"]:
                        wood +=4
                    elif "Silver" in membership["name"]:
                        wood +=2
                    elif "Bronze" in membership["name"]:
                        wood +=1
                elif membership["type"] == "Gold":
                    if "Gold" in membership["name"]:
                        gold +=4
                    elif "Silver" in membership["name"]:
                        gold +=2
                    elif "Bronze" in membership["name"]:
                        gold +=1
            except Exception as e:
                obj.append(["Failed"])
                print("COULDN'T LOAD MEMBERSHIP BENIFIT.")
                return obj
        times = []
        for tool in obj[0]:
            x = datetime.fromtimestamp(tool["next_availability"])
            hours = x.hour
            minutes = x.minute
            seconds = x.second

            if tool["type"] == "Wood":
                hours += wood
                
            elif tool["type"] == "Food":
                hours += food

            elif tool["type"] == "Gold":
                hours += gold
            
            if hours > 23:
                hours -= 23
            
            d = datetime(x.year, x.month, x.day, hours, x.minute, x.second, x.microsecond)
            duration =  d - datetime.now()
            d_p = duration.total_seconds()
            print(d_p)

            if d.timestamp() < datetime.now().timestamp():
                obj[3].append(tool["asset_id"])
            else:
                duration =  d - datetime.now()
                d_p = duration.total_seconds()
                times.append(d_p)

        for membership in obj[1]:
            x = datetime.fromtimestamp(membership["next_availability"])
            if x.timestamp() < datetime.now().timestamp():
                obj[4].append(membership["asset_id"])
            else:
                duration =  x - datetime.now()
                d_p = duration.total_seconds()
                times.append(d_p)
        
        obj[6].append(120)
        obj.append(["Success"])
        return obj

print(asset_information.get_items("roilo.c.wam")[3])
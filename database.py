import json, time
from datetime import datetime

class database():
    auth_database_state = False
    transact_database_state = False
    def authorize_wallet(obj):
        #I need to check if database works
        try:
            if database.auth_database_state == False:
                database.auth_database_state = True
                opjson = open("databases/authorized_wallets.json", "r")
                data = json.load(opjson)
                opjson.close()
                t = False

                for wallet in data["authorized_wallets"]:
                    if wallet["wallet"] == obj:
                        t = True
                        d = datetime.utcnow()
                        wallet["last_invoice"] = d.timestamp()
                        next_month = d.month
                        next_year = d.year
                        next_day = d.day
                        if (next_month + 1) < 12:
                            next_month += 1 
                        else:
                            next_month = 1
                            next_year = d.year + 1
                        
                        wallet["next_invoice"] = datetime(next_year, next_month, next_day, d.hour, d.minute, d.second,d.microsecond).timestamp()

                        
                if t == False:
                    d = datetime.utcnow()
                    last_invoice = d.timestamp()
                    next_month = d.month
                    next_year = d.year
                    next_day = d.day
                    if (next_month + 1) < 12:
                        next_month += 1 
                    else:
                        next_month = 1
                        next_year = d.year + 1
                    
                    next_invoice = datetime(next_year, next_month, next_day, d.hour, d.minute,d.second, d.microsecond).timestamp()
                    
                    opjson = open("databases/authorized_wallets.json", "w+")
                    data["authorized_wallets"].append({"wallet":obj,"last_invoice":last_invoice, "next_invoice": next_invoice})
                
                json.dump(data, open("databases/authorized_wallets.json", "w"), indent=2)
                opjson.close()
                database.auth_database_state = False
            else:
                time.sleep(5)
                return database.authorize_wallet(obj)
        except Exception as e:
            print(str(e))
            return database.authorize_wallet(obj)
    
    def authorize_transaction(obj):
        try:
            if database.transact_database_state == False:
                database.transact_database_state = True
                opjson = open("databases/authorized_transactions.json", "r")
                data = json.load(opjson)
                opjson.close()
                opjson = open("databases/authorized_transactions.json", "w+")
                data["authorized_transactions"].append({"transaction_id":obj,"ts":datetime.utcnow().timestamp()})
                json.dump(data, opjson, indent=2)
                opjson.close()
                database.transact_database_state = False
            else:
                time.sleep(5)
                return database.authorize_transaction(obj)
        except Exception as e:
            print(str(e))
            return database.authorize_transaction(obj)
    
    
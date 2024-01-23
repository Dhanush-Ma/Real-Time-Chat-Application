
from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://iamdhanush02:g8cYKgllybzZEv5H@yuvabe.9z18cvh.mongodb.net/"

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print("Atlas error")
    print(e)


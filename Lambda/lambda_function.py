import json

def lambda_handler(event, context):
    
    print(type(event["body"]))
    if (isinstance(event["body"],str)):         #If the body is a str object then parse to dict
        print(event["body"])
        temp = json.loads(event["body"])
        print(type(temp))
        print("Converted to dict from str")
    elif (isinstance(event["body"],dict)):
        temp = event["body"]                    #good to go
        
    for key in temp:
        print("string" + temp.get(key,"this should not happen"))
        text = temp.get(key)
    
    return {
        'statusCode': 200,
        'headers' : {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(text)
    }

import requests

def test_get_vendors():
    response = requests.get("http://localhost:3000/api/v1/products/getVendors")
    print(response.status_code)
    print(response)
    print(response.json())

def test_get_types():
    response = requests.get("http://localhost:3000/api/v1/products/getTypes")
    print(response.json())
    

print("Testing get_vendors")
test_get_vendors()
print("Testing get_types")
test_get_types()




import fastapi
import uvicorn
from build_db.firebase_client import FirebaseClient
from fastapi import Depends
from utils import verify_api_key
from pydantic import BaseModel
from stripe_tools.get_info import get_cust_payment_method, get_product_id
from stripe_tools.cust_pay_acc import process_payment
app = fastapi.FastAPI()
firebase_client = FirebaseClient("backend/build_db/firebaseCred.json")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/products")
def get_products(api_key: str = Depends(verify_api_key)):
    products = firebase_client.get_all_products()
    return products

class PaymentRequest(BaseModel):
    price_id: str
    customer_id: str
    vendor_id: str
    amount: float

@app.post("/payment")
def payment(request: PaymentRequest, api_key: str = Depends(verify_api_key)):
    product_id = get_product_id(request.price_id, request.vendor_id)
    payment_method = get_cust_payment_method(request.customer_id)
    payment_response = process_payment(request.customer_id, payment_method, product_id, request.price_id, request.vendor_id)
    return payment_response


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

from langchain_core.tools import tool


@tool
def send_payment(amount: float, recipient: str, product: str) -> str:
    """Send a payment to a recipient.
    
    Args:
        amount: The amount to send
        recipient: The recipient of the payment
        product: The product to send the payment for
    Returns:
        str: Confirmation message of the payment
        
    Note:
        Valid recipients are:
        - "Amazon"
        - "Doordash"
        - "Hotels.com"
    """
    valid_recipients = ["Amazon", "Doordash", "Hotels.com"]
    
    if recipient not in valid_recipients:
        return f"Error: Invalid recipient '{recipient}'. Valid recipients are {', '.join(valid_recipients)}"
    
    return f"Payment of ${amount:.2f} sent to {recipient} for {product}"

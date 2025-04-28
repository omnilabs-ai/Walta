# Import necessary packages
import os
import ssl
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage
from langchain_anthropic import ChatAnthropic
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

# Load environment variables
load_dotenv()

# Configure SSL
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Set environment variables for SSL
os.environ['SSL_CERT_FILE'] = ''
os.environ['REQUESTS_CA_BUNDLE'] = ''

memory = MemorySaver()
model = ChatAnthropic(
    model_name="claude-3-7-sonnet-20250219",
    anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
)

# from tools import get_products, get_types, get_vendors, send_payment
tools = []#[get_products, get_types, get_vendors, send_payment]

# Create the ReAct-style agent with tools and memory
agent_executor = create_react_agent(model, tools, checkpointer=memory)

query = "I want to send $200 to book a hotel in SF from hotels.com"

# Use the agent with a test message
config = {"configurable": {"thread_id": "abc123"}}
try:
    for step in agent_executor.stream(
        {"messages": [HumanMessage(content=query)]},
        config,
        stream_mode="values",
    ):
        step["messages"][-1].pretty_print()
except Exception as e:
    print(f"An error occurred: {str(e)}")

# Import necessary packages
import os
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage
from langchain_anthropic import ChatAnthropic
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

# Load environment variables from .env file
load_dotenv()

# Define a custom simulated search tool
from tools import send_payment
# Create the memory checkpoint
memory = MemorySaver()

# Load the Claude model (you can change this to a different LLM if needed)
model = ChatAnthropic(model_name="claude-3-7-sonnet-20250219")

# Register the custom tool
tools = [send_payment]

# Create the ReAct-style agent with tools and memory
agent_executor = create_react_agent(model, tools, checkpointer=memory)



query = "I want to send $200 to book a hotel in SF from hotels.com"


# Use the agent with a test message
config = {"configurable": {"thread_id": "abc123"}}
for step in agent_executor.stream(
    {"messages": [HumanMessage(content=query)]},
    config,
    stream_mode="values",
):
    step["messages"][-1].pretty_print()

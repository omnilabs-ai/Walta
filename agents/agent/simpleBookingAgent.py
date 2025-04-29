# Import necessary packages
import os
import ssl
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage
from langchain_anthropic import ChatAnthropic
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from colorama import init, Fore, Back, Style
import json

# Initialize colorama
init(autoreset=True)

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

from tools import get_products, get_types, get_vendors, send_payment
tools = [get_products, get_types, get_vendors, send_payment]

# Create the ReAct-style agent with tools and memory
agent_executor = create_react_agent(model, tools, checkpointer=memory)

def print_tool_output(tool_name, tool_output):
    print(f"\n{Fore.MAGENTA}{'='*50}")
    print(f"{Fore.MAGENTA}🛠️  Tool Output: {tool_name}")
    print(f"{Fore.MAGENTA}{'-'*50}")
    print(f"{Fore.MAGENTA}Output: {json.dumps(tool_output, indent=2)}")
    print(f"{Fore.MAGENTA}{'='*50}\n")

def print_tool_call(tool_id, tool_name, tool_input):
    print(f"\n{Fore.CYAN}{'='*50}")
    print(f"{Fore.CYAN}🛠️  Tool Call: {tool_name}")
    print(f"{Fore.CYAN}{'-'*50}")
    print(f"{Fore.CYAN}Input: {json.dumps(tool_input, indent=2)}")
    print(f"{Fore.CYAN}{'='*50}\n")

def print_agent_message(message):
    print(f"\n{Fore.GREEN}{'='*50}")
    print(f"{Fore.GREEN}🤖 Agent:")
    print(f"{Fore.GREEN}{'-'*50}")
    print(f"{Fore.GREEN}{message}")
    print(f"{Fore.GREEN}{'='*50}\n")

def print_human_message(message):
    print(f"\n{Fore.BLUE}{'='*50}")
    print(f"{Fore.BLUE}👤 You:")
    print(f"{Fore.BLUE}{'-'*50}")
    print(f"{Fore.BLUE}{message}")
    print(f"{Fore.BLUE}{'='*50}\n")

def run_conversation():
    config = {"configurable": {"thread_id": "abc123"}}
    messages = []
    
    print(f"{Fore.YELLOW}{'='*50}")
    print(f"{Fore.YELLOW}Welcome to the Hotel Booking Assistant!")
    print(f"{Fore.YELLOW}Type 'quit', 'exit', or 'bye' to end the conversation.")
    print(f"{Fore.YELLOW}{'='*50}\n")
    
    while True:
        # Get user input
        print(f"\n{Fore.BLUE}{'='*50}")
        user_input = input(f"{Fore.BLUE}👤 You: ")
        print(f"{Fore.BLUE}{'='*50}\n")

        if user_input.lower() in ['quit', 'exit', 'bye']:
            print(f"{Fore.YELLOW}\nGoodbye! 👋")
            break
            
        # Add user message to conversation history
        messages.append(HumanMessage(content=user_input))
        
        try:
            # Get agent's response
            for step in agent_executor.stream(
                {"messages": messages, "type": "human"},
                config,
                stream_mode="values",
            ):
                print(step)
                if step.type == "text":
                    print_agent_message(step.text)
                # Handle tool calls
                if step.type == "tool_use":
                    print_tool_call(step.id, step.name, step.input)

                if step.type == "tool_output":
                    print_tool_output(step.name, step.output)
                
                # Print agent's response
                if "messages" in step:
                    messages.append(step.messages)
                
        except Exception as e:
            print(f"{Fore.RED}\nAn error occurred: {str(e)}")
            break

if __name__ == "__main__":
    run_conversation()

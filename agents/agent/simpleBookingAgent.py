# Import necessary packages
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
import json
from prompt import system_prompt
from agent_utils import *

load_dotenv()

memory = MemorySaver()
model = ChatOpenAI(
    model_name="gpt-4o-mini",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

from tools import get_products, get_types, get_vendors, send_payment
tools = [get_products, get_types, get_vendors, send_payment]
agent_executor = create_react_agent(model, tools, checkpointer=memory)

def run_conversation(agent_executor):
    config = {"configurable": {"thread_id": "abc123"}}
    messages = []
    
    print_welcome_message()
    
    while True:
        # Get user input
        print(f"\n{Fore.BLUE}{'='*50}")
        user_input = input(f"{Fore.BLUE}👤 You: ")
        print(f"{Fore.BLUE}{'='*50}\n")

        if user_input.lower() in ['quit', 'exit', 'bye']:
            print(f"{Fore.YELLOW}\nGoodbye! 👋")
            break
            
        # Add user message to conversation history
        messages.append(HumanMessage(content=user_input + "\n\n" + system_prompt))
        messages.append(AIMessage(content="Processing..."))
        
        try:
            # Get agent's response
            for step in agent_executor.stream(
                {"messages": messages},
                config,
                stream_mode="values",
            ):
                if isinstance(step, dict) and "messages" in step:
                    last_step = step["messages"][-1]

                    if last_step.additional_kwargs and 'tool_calls' in last_step.additional_kwargs:
                        for tool_call in last_step.additional_kwargs['tool_calls']:
                            print_tool_call(
                                tool_call['id'],
                                tool_call['function']['name'],
                                json.loads(tool_call['function']['arguments'])
                            )
                    
                    # Handle tool outputs
                    elif hasattr(last_step, 'content') and "output" in str(last_step.content):
                        tool_output = json.loads(last_step.content)
                        print_tool_output(tool_output['name'], tool_output['output'])
                        messages.append(last_step)
                    
                    # Handle text responses
                    elif last_step.content:
                        print_agent_message(last_step.content)
                        messages.append(last_step)
                
        except Exception as e:
            print(f"{Fore.RED}\nAn error occurred: {str(e)}")
            print(f"{Fore.RED}Please try again or type 'quit' to exit.")
            continue

if __name__ == "__main__":
    run_conversation(agent_executor)

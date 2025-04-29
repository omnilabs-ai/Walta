from colorama import init, Fore, Style
import json

# Initialize colorama
init(autoreset=True)

def print_tool_output(tool_name, tool_output):
    """Print formatted tool output with color and formatting."""
    print(f"\n{Fore.YELLOW}{'='*50}")
    print(f"{Fore.YELLOW}🛠️  Tool Output: {tool_name}")
    print(f"{Fore.YELLOW}{'-'*50}")
    # If tool output is too long, truncate it
    if len(str(tool_output)) > 300:
        truncated_output = str(tool_output)[:300] + "..."
        tool_output = truncated_output

    print(f"{Fore.YELLOW}Output: {json.dumps(tool_output, indent=2)}")
    print(f"{Fore.YELLOW}{'='*50}\n")

def print_tool_call(tool_id, tool_name, tool_input):
    """Print formatted tool call with color and formatting."""
    print(f"\n{Fore.MAGENTA}{'='*50}")
    print(f"{Fore.MAGENTA}🛠️  Tool Call: {tool_name}")
    print(f"{Fore.MAGENTA}{'-'*50}")
    print(f"{Fore.MAGENTA}Input: {json.dumps(tool_input, indent=2)}")
    print(f"{Fore.MAGENTA}{'='*50}\n")

def print_agent_message(message):
    """Print formatted agent message with color and formatting."""
    print(f"\n{Fore.GREEN}{'='*50}")
    print(f"{Fore.GREEN}🤖 Agent:")
    print(f"{Fore.GREEN}{'-'*50}")
    print(f"{Fore.GREEN}{message}")
    print(f"{Fore.GREEN}{'='*50}\n")

def print_human_message(message):
    """Print formatted human message with color and formatting."""
    print(f"\n{Fore.BLUE}{'='*50}")
    print(f"{Fore.BLUE}👤 You:")
    print(f"{Fore.BLUE}{'-'*50}")
    print(f"{Fore.BLUE}{message}")
    print(f"{Fore.BLUE}{'='*50}\n")

def print_welcome_message():
    """Print the welcome message for the agent."""
    print(f"{Fore.YELLOW}{'='*50}")
    print(f"{Fore.YELLOW}Welcome to the Hotel Booking Assistant!")
    print(f"{Fore.YELLOW}Type 'quit', 'exit', or 'bye' to end the conversation.")
    print(f"{Fore.YELLOW}{'='*50}\n")

def print_goodbye_message():
    """Print the goodbye message."""
    print(f"{Fore.YELLOW}\nGoodbye! 👋") 
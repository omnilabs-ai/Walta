from colorama import init, Fore, Style
import json
import os
import ssl

# Initialize colorama
init(autoreset=True)


# Configure SSL
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Set environment variables for SSL
os.environ['SSL_CERT_FILE'] = ''
os.environ['REQUESTS_CA_BUNDLE'] = ''

print_dash_num = 100

def print_tool_output(tool_name, tool_output):
    """Print formatted tool output with color and formatting."""
    print(f"\n{Fore.YELLOW}{'='*print_dash_num}")
    print(f"{Fore.YELLOW}🛠️  Tool Output: {tool_name}")
    print(f"{Fore.YELLOW}{'-'*print_dash_num}")
    # If tool output is too long, truncate it
    if len(str(tool_output)) > 600:
        truncated_output = str(tool_output)[:600] + "..."
        tool_output = truncated_output

    print(f"{Fore.YELLOW}Output: {json.dumps(tool_output, indent=2)}")
    print(f"{Fore.YELLOW}{'='*print_dash_num}\n")

def print_tool_call(tool_id, tool_name, tool_input):
    """Print formatted tool call with color and formatting."""
    print(f"\n{Fore.MAGENTA}{'='*print_dash_num}")
    print(f"{Fore.MAGENTA}🛠️  Tool Call: {tool_name}")
    print(f"{Fore.MAGENTA}{'-'*print_dash_num}")
    print(f"{Fore.MAGENTA}Input: {json.dumps(tool_input, indent=2)}")
    print(f"{Fore.MAGENTA}{'='*print_dash_num}\n")

def print_agent_message(message):
    """Print formatted agent message with color and formatting."""
    print(f"\n{Fore.GREEN}{'='*print_dash_num}")
    print(f"{Fore.GREEN}🤖 Agent:")
    print(f"{Fore.GREEN}{'-'*print_dash_num}")
    print(f"{Fore.GREEN}{message}")
    print(f"{Fore.GREEN}{'='*print_dash_num}\n")

def print_human_message(message):
    """Print formatted human message with color and formatting."""
    print(f"\n{Fore.BLUE}{'='*print_dash_num}")
    print(f"{Fore.BLUE}👤 You:")
    print(f"{Fore.BLUE}{'-'*print_dash_num}")
    print(f"{Fore.BLUE}{message}")
    print(f"{Fore.BLUE}{'='*print_dash_num}\n")

def print_welcome_message():
    """Print the welcome message for the agent."""
    print(f"{Fore.YELLOW}{'='*print_dash_num}")
    print(f"{Fore.YELLOW}Welcome to the Hotel Booking Assistant!")
    print(f"{Fore.YELLOW}Type 'quit', 'exit', or 'bye' to end the conversation.")
    print(f"{Fore.YELLOW}{'='*print_dash_num}\n")

def print_goodbye_message():
    """Print the goodbye message."""
    print(f"{Fore.YELLOW}\nGoodbye! 👋") 
import os
import requests 


API_KEY = os.getenv('OPENAI_API_KEY')
API_URL = "https://api.openai.com/v1/chat/completions"
  
# Conversation history with a system message
conversation_history = [{"role": "system", "content": "Your answers' token limit are 200. Still keep your answers short as much as possible. "}]

# Token limit for the model (GPT-3.5-turbo has ~4096 tokens)
MAX_TOKENS = 3500  # Reserved space for input
OUTPUT_TOKEN_LIMIT = 150  # Cap for the assistant's response

def count_tokens(messages):
    """
    Approximates the number of tokens in a list of messages.
    """
    return sum(len(message["content"].split()) for message in messages)
def summarize_conversation(history):
    """
    Summarizes the conversation history, incorporating the previous summary.
    """
    # Extract the last summary if it exists
    previous_summary = None
    if history and history[0]['role'] == 'assistant' and 'Summary:' in history[0]['content']:
        previous_summary = history[0]['content']
        history = history[1:]  # Exclude the old summary from messages

    # Keep only the most recent few messages for summarization
    recent_messages = history[-1:]  # Last message
    to_summarize = history[:-1]  # Messages to summarize (excluding recent ones)

    # Combine the previous summary with messages to summarize
    content_to_summarize = (previous_summary or "") + "\n" + "\n".join([msg['content'] for msg in to_summarize])

    if not to_summarize and not previous_summary:
        return history  # Nothing to summarize

    # Call OpenAI API to generate a new summary
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "Summarize the following conversation in 2-3 sentences:"},
            {"role": "user", "content": content_to_summarize.strip()},
        ],
        "max_tokens": 200,
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        if response.status_code == 200:
            new_summary = response.json()['choices'][0]['message']['content']
            # Update the conversation history to only include the new summary
            return [{"role": "assistant", "content": f"Summary: {new_summary}"}] + recent_messages
        else:
            print(f"Error summarizing conversation: {response.status_code}")
            return history
    except Exception as e:
        print(f"Error summarizing conversation: {e}")
        return history
 
def get_chatbot_response(user_message):
    """
    Sends user input to OpenAI and uses a summarized conversation history.
    """
    global conversation_history

    # Add user message to history
    conversation_history.append({"role": "user", "content": user_message})

    # Summarize if the token count exceeds the limit
    if count_tokens(conversation_history) > MAX_TOKENS:
        conversation_history = summarize_conversation(conversation_history)

    # Prepare payload for OpenAI
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": conversation_history,
        "max_tokens": OUTPUT_TOKEN_LIMIT,  # Response length
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        # Call OpenAI API
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        response_data = response.json()
        assistant_reply = response_data['choices'][0]['message']['content']
        # Add assistant reply to conversation history
        conversation_history.append({"role": "assistant", "content": assistant_reply})
        return assistant_reply.strip()
    except requests.exceptions.RequestException as e:
        return f"Error: {e}"


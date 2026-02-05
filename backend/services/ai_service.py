"""AI service for NDA chat using LiteLLM with Cerebras via OpenRouter."""

from litellm import completion
from models.chat import Message, ChatResponse

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a friendly legal assistant helping users create a Mutual Non-Disclosure Agreement (NDA).

Your job is to have a natural conversation to gather all the information needed for the NDA. Ask questions one at a time in a conversational way.

Information you need to collect:
1. Purpose - Why are they creating this NDA? (e.g., "evaluating a business partnership")
2. Effective Date - When should the agreement start? (format: YYYY-MM-DD)
3. MNDA Term - How long should the agreement last?
   - Either "expires" after X years, or "continues" until terminated
4. Confidentiality Term - How long should confidential information be protected?
   - Either X years, or "perpetuity" (forever)
5. Governing Law - Which state's laws govern this agreement? (e.g., "Delaware")
6. Jurisdiction - Where will disputes be resolved? (e.g., "New Castle County, Delaware")
7. Party 1 details: company name, signatory name, title, notice address (email), signature date
8. Party 2 details: company name, signatory name, title, notice address (email), signature date

Guidelines:
- Be conversational and helpful, not robotic
- Ask about one or two related things at a time
- When users give information, acknowledge it naturally
- Suggest reasonable defaults when appropriate (e.g., "Today's date" for effective date, "1 year" for terms)
- For dates, convert relative dates like "today" or "next Monday" to YYYY-MM-DD format
- When you have ALL required information, summarize the NDA details and set isComplete to true
- Required fields: purpose, effectiveDate, governingLaw, jurisdiction, and both parties' company names

In your response field, write your conversational reply to the user.
In the other fields, extract any information the user has provided so far.
Only set isComplete to true when you have gathered all required information and confirmed with the user."""


def get_greeting() -> ChatResponse:
    """Return the initial greeting message."""
    return ChatResponse(
        response="Hello! I'll help you create a Mutual Non-Disclosure Agreement. Let's start with the basics - what's the purpose of this NDA? For example, are you evaluating a potential business partnership, discussing a merger, or something else?",
        isComplete=False
    )


def process_message(messages: list[Message]) -> ChatResponse:
    """Process chat messages and return AI response with extracted NDA fields."""
    llm_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in messages:
        llm_messages.append({"role": msg.role, "content": msg.content})

    response = completion(
        model=MODEL,
        messages=llm_messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY
    )

    if not response.choices or not response.choices[0].message.content:
        raise ValueError("Invalid response from AI service")

    result = response.choices[0].message.content
    return ChatResponse.model_validate_json(result)

import asyncio
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.5-flash')

prompt = """You are CrisisGrid AI's strategic crisis commander. A "flood" scenario has been simulated across 15 districts with severity multiplier 1.5x.

Here are the resulting priority scores:
[
  {
    "name": "District 1",
    "priority": 85,
    "band": "Critical"
  }
]

Provide a 3-4 sentence executive briefing: How many districts are now critical? What is the overall threat level? What immediate actions should the crisis command center take?"""

async def main():
    try:
        res = await model.generate_content_async(prompt)
        print("OUTPUT_START")
        print(res.text)
        print("OUTPUT_END")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())

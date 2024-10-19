from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

# Load environment variables for OpenAI and Unsplash
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageDescriptionRequest(BaseModel):
    image: str
    
class CaptionRequest(BaseModel):
    description: str
    tone: str
    style: str
    context: Optional[str] = None
    emojis: str
    hashtags: str
    
@app.post("/api/description/")
async def generate_keywords(image: ImageDescriptionRequest):
    # Extract keywords from the given blog content using OpenAI
    # keywords = []
    try:
        response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"{image.image}"
                        },                        
                    },
                ],
            },
        ],
        # max_tokens=300,
        )
        description = response.choices[0].message.content.strip()
        return description
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/api/caption/")
async def generate_keywords(content: CaptionRequest):
    try:
        prompt = f'''
        Generate 5 variations of an engaging caption for the following image in JSON format. The caption should be influenced by the image description and the context provided. Tailor the tone, writing style, and any additional elements, such as emojis or hashtags, based on the specified instructions. Each variation should be unique but relevant to the image and the specified parameters.
        Parameters:
        Image Description: {content.description}
        Tone: {content.tone}
        Writing Style: {content.style}
        Additional Context: {content.context}
        Include Emojis: {content.emojis}
        Include Hashtags: {content.hashtags}

        Output Format:
        {{
            "captions": [
                "caption-1",
                "caption-2",
                "caption-3",
                "caption-4",
                "caption-5"
            ]
        }}
        '''
        openai_response = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "As an AI caption creator, your task is to generate 5 distinct variations of captions for images based on the parameters provided. For each image, you must consider the description, tone, writing style, and any additional context. Pay attention to whether emojis and hashtags should be included, and weave them into the captions naturally if specified. Each caption should reflect the mood and style clearly, ensuring creativity and relevance to the given context. Maintain variety across the five captions, making each unique while staying aligned with the overall brief."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        captions = openai_response.choices[0].message.content.strip()
        print(captions)
        return captions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
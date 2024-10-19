# Captionify - AI Caption Generator

## Overview

**Captionify** is a web application that generates AI-based captions for images using OpenAI's API. Users can upload images and receive multiple caption suggestions. The app provides features to select the mood/tone of the caption, adjust the length, and include trending hashtags. The application is built using **React** for the frontend, **FastAPI** for the backend, and **Material UI** for styling.

## Features

- Upload images and get custom AI-generated captions based on your preferences.
- Choose the mood/tone for the caption (e.g., Happy, Sad, Excited, etc) as well as the writing style for the caption (e.g., Poetic, Narrative, Formal, etc).
- Option to include trending and relevant hashtags and emojis
- Display captions in a scrollable list with loading indicators.
- Responsive and mobile-friendly design.
- Powered by OpenAI for caption generation.

## Usage

1. **Go to [Captionify](https://captionify-sage.vercel.app/)**  
   Navigate to the Captionify web app by visiting [this link](https://captionify-sage.vercel.app/).

2. **Upload an image**  
   Upload an image for which the caption is to be generated Supported file types are JPG and PNG (not more than 10MB).

3. **Choose preferences**
   Provide customizations for your captions by setting the following options:
   - Description: The app automatically generates a description for the uploaded image by using an advanced AI model.
   - Tone: Select the mood/tone for the caption i.e. happy, sad, excited, funny, etc.
   - Writing Style: Select the writing style for the caption i.e. narrative, poetic, formal, etc.
   - Additional Context: Add any aditional context regarding the image like location, event, etc.
   - Emojis and Hashtags: Enable/disable relevant and trending emojis and hashtags for the captions.

4. **Generate captions**
   Click on the **Generate** button to let the advanced AI model generate 5 caption variations catering to your need and preferences.

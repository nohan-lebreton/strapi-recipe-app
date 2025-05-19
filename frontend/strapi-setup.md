# Strapi Backend Setup Instructions

For a full implementation, we would set up a Strapi backend as follows:

## 1. Create Strapi Project

```bash
# Create a new Strapi project in a separate directory
npx create-strapi-app@latest strapi --quickstart
```

## 2. Content Types

Create the following content types in Strapi:

### Recipe
- **title**: Text (required)
- **description**: Text
- **image**: Media (image)
- **time**: Number (integer)
- **difficulty**: Enumeration (Easy, Medium, Hard)
- **category**: Relation to Category (many-to-one)
- **rating**: Decimal 
- **ingredients**: Rich Text or JSON
- **instructions**: Rich Text or JSON

### Category
- **name**: Text (required)
- **description**: Text
- **image**: Media (image)
- **recipes**: Relation to Recipe (one-to-many)

## 3. Populate with Sample Data

After setting up the content types, add sample recipes and categories through the Strapi admin panel.

## 4. API Permissions

Configure permissions in Strapi to allow public access to the API endpoints:

1. Go to Settings > Roles > Public
2. Enable "find" and "findOne" permissions for Recipe and Category
3. Save the configuration

## 5. Configure CORS

Configure CORS in Strapi to allow requests from your Vue application:

1. Go to Settings > Security > CORS
2. Add your frontend URL to the allowed origins
3. Save the configuration

## API Integration

In the Vue application, update the API configuration in `src/api/strapi.js` with your Strapi URL:

```javascript
import axios from 'axios';

const strapiURL = 'http://localhost:1337';

export const api = axios.create({
  baseURL: `${strapiURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImageUrl = (path) => {
  return `${strapiURL}${path}`;
};
```

Then update the recipe store to fetch data from Strapi instead of using mock data.
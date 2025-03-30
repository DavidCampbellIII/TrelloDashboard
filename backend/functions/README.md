# Trello Dashboard - Backend Functions

## API Configuration

To use the Trello API, you need to generate the correct API credentials:

### Step 1: Create a Trello Power-Up

1. Log in to your Trello account
2. Visit the [Power-Ups Admin Portal](https://trello.com/power-ups/admin)
3. Click "New" to create a new Power-Up
4. Fill in the required fields:
   - Name: "Trello Dashboard"
   - Other details as needed

### Step 2: Generate API Key and Token

1. Go to [https://trello.com/app-key](https://trello.com/app-key)
2. You'll see your API key on this page
3. To generate a token, click on the "Token" link on the same page
4. Grant permissions to your account (make sure to select both read and write permissions)
5. Copy the provided token

### Step 3: Update Environment Variables

1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your actual API key, token, and board ID:
   ```
   TRELLO_API_KEY=your_api_key_here
   TRELLO_TOKEN=your_token_here
   TRELLO_BOARD_ID=your_board_id_here
   ```

## Common Errors

### "Invalid Key" Error (401 Unauthorized)

If you receive an "invalid key" error, it means your API key is not recognized by Trello. Solutions:

1. Make sure you've generated an API key from a valid Power-Up
2. Ensure you're using the correct key and token together
3. Check if your token has expired (tokens can be set to expire)
4. Generate a new token with the proper permissions

### 429 Rate Limit Error

Trello has rate limits of 300 requests per 10 seconds per API key and 100 requests per 10 seconds per token. If you're hitting these limits, consider implementing caching or batch processing.
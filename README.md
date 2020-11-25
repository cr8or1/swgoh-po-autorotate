# Simple SWGOH PO autorotate Shard Bot

## Deploy straight to Heroku ( Free 24/7 )

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## Configuration

### Set environment variables:


|Variable Name| Description                             | Notes |
|-------------|-----------------------------------------|------ |
|botToken | Bot Token  -  - check number #6      | Required|
|channelIdShard| Discord id of the channel where you want to have the bot showing the PO for your members - check number #8|  Required|
|channelIdPest| Discord id of the channel where you want to have the bot showing the PO for your pest/enemies - check number #8| Required|
|thumbnail | Here you can put an image/avatar of the bot. If you don't want to have an avatar just put ' '| Required|
|url | the url of the heroku page. you can get it by pressing on the open app on top right of this page| Required|
|timePeriod | how often the bot should refresh the PO - check number #9| Required|


## Deploy with Heroku steps
### 0. Delete previously created application(if you have one).

### 1. Click the button below.
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### 2. Create the application with a unique name and press `Deploy app` button.
![ScreenShot](assets/create-app.png)

### 3. Once deployed press `Manage App` button.
![ScreenShot](assets/app-deployed.png)

### 4. Go to settings tab.
![ScreenShot](assets/go-to-settings-tab.png)

### 5. Press `Reveal Config Vars` button and set environment variables.
![ScreenShot](assets/set-env-variables.png)

### 6. Create a discord bot and invite it to your shard discord server.

Visit discord developer url [![URL](https://discord.com/developers/applications)](Discord developer URL). Here you will create your own shard bot.

After you login with your discord username and password, you can create a new application.
![ScreenShot](assets/app-discord-create-new.png)

The next step is to add the bot
![ScreenShot](assets/app-add-bot.png)


After you add it you can change the name for your bot and upload an avatar. Here you will need to copy and save the bot token that you need to add it on heroku in `Config Vars`
![ScreenShot](assets/app-add-bot-token.png)


Next step is to invite the bot on your discord server. (you can do that by selecting OAuth2 from the menu and select the `bot` from Scopes selections)
![ScreenShot](assets/setup-bot-on-discord-server.png)

Copy the url and paste it in a new tab where you’ll be prompted to choose which server the bot should join. (```!!! You need to be and admin of that server to be able to invite it on that server !!!```)
![ScreenShot](assets/add-bot-on-discord-server.png)

### 7. MAKE SURE YOU HAVE DEVELOPER MODE ENABLED
You'll find Developer Mode in User Settings > Appearance.
![ScreenShot](assets/discord-developer-mode.jpg)

### 8. Copy discord id for each channel where you want the bot to post
![ScreenShot](assets/discord-copy-id.jpg)

### 9. Time period
Here are some numbers that represent the period of how often the bot should refresh the PO

####Time:
- 3600000 = every 1 hour
- 1800000 = every 30 min
- 600000 = every 10 min
- 300000 = every 5 min
- 60000 = every 1 min


### 10. Keep only one application and one resource at a time, otherwise you will be charged...
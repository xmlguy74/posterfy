# Posterfy

This is a simple, yet highly customizable movie poster app for Home Assistant. The primary goal of this project was to provide a digital movie poster experience, which displays movie posters based on a feed entity from Home Assistant.

The app is basically a webpage that is designed to be displayed on a large format screen, oriented in portrait layout, like a movie poster. The page will periodically loop thru the list of movie posters provided by a Home Assistant entity's attribute data. This is the feed from which the page draws its information.

Currently, this feed entity is created by using a custom component located here: https://github.com/xmlguy74/posterfy-homeassistant. This component provides a sensor entity which updates its state from the [The Movie DB](https://www.themoviedb.org/). 

The typical setup would involve the following (high level concept):
- Using a Raspberry Pi device (3b+ or 4b), setup Raspbian to automatically launch the browser upon startup. The initial page should be that of the Posterfy application. 
- Use a LCD monitor or TV (turn it sideways!) connected to the Raspberry Pi. This is your 'poster'. 
- Install the Posterfy-HomeAssistant custom component in order to retrieve movie feed data. You will need to get an API key for yourself, and configure the custom component to use it.
- Build and copy the poster files into your www folder path on Home Assistant.

__This project is in an alpha stage.__ If you should have any questions, comments, or want to contribute, please post them on the home assistant forum or create an issue in github.

## Links

- Discussion on Home Assistant Community

## Screenshots

![Screenshot 1](/docs/screenshot1.png)
![Screenshot 2](/docs/screenshot2.png)
![Screenshot 3](/docs/screenshot3.png)

## How to use

1. Clone this repo locally. 
2. Build the Posterfy app. The is a React web app, built using the following commands:
    1. yarn
        - This will install any project dependencies.
    2. yarn build
        - This will transpile the web app into the `build` folder.
3. After building the app, copy the contents of the build folder into your Home Assistants `\www\posterfy` folder.

### !!!WARNING!!!

Files served from the www folder (/local/ url), aren't protected by the Home Assistant authentication. Files stored in this folder, if the URL is known, can be accessed by anybody without authentication. Please make sure that your HA instance is not exposed via Internet or at least that long-lived token is not hardcoded in the config.

## Configuration

The app expects a global CONFIG object. This object contains the configuration settings for the app. Modify the copied config.js file (`/www/posterfy/config.js`) to adjust for any custom settings you want to change. For example, this is where you change the title & subtitle values.

In order for the app to authenticate with Home Assistant, you will need to generate a long-lived token in HA. This value should be passed to the app via a url query parameter when viewing the app in a browser. The query parameter should be named `authToken`.

### Example URL

``
    http://myhomeassistant:8123/local/posterfy/index.html?authToken=<TOKEN-GOES-HERE>
``

## Current Limitations & Assumptions
- The app assumes a 900x1600 resolution (portrait).
- The media player status has been designed using a Roku. Other players may support more advanced abilities. __To be improved!__
- The feed entity is currently limited on what streaming services it looks for under the 'now streaming' category. (Netflix, Amazon Prime, HBO Max).
- Currently assumes a US region.

